const fs = require('fs');
const express = require('express')
const app = express()
const port = +process.argv[2] || 3000

const client = require('redis').createClient()
client.on('error', (err) => console.log('Redis Client Error', err));

client.on('ready', () => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Example app listening at http://0.0.0.0:${port}`)
    });
})

const cardsData = fs.readFileSync('./cards.json');
const cards = JSON.parse(cardsData);

app.get('/card_add', async (req, res) => {
    const key = String(req.query.id);

    let next_card;
    let exists = await client.exists(key+'-run');
    if (!exists) { // first run
        await redisPut(key+'-run', 'true'); // distinguish start and end of items
        let allCards = [...cards];
        let first_card;
        for(let i = allCards.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = allCards[i];
            allCards[i] = allCards[j];
            allCards[j] = temp;

            next_card = allCards[i];

            if (i === allCards.length - 2) {
                res.send(first_card);
            }

            if (i !== allCards.length - 1)
                await client.rPush(key, JSON.stringify(next_card)); // push the next card to the end of the list
            else
                first_card = next_card;
        }
    }
    else {
        next_card = await client.lPop(key);
    }

    if (exists && next_card) { // not on the first run
        res.send(next_card);
    }
    else if (!next_card) {
        redisDel(key);
        redisDel(key+'-run');
        res.send({id: "ALL CARDS"});
    }
});

async function redisPut(key, value) {
    return new Promise(async (res, rej) => {
        await client.set(key, value).catch( (err) => {
            if(err) {
                console.log(err);
                rej(err);
            }
        });
        res();
    });
}

async function redisDel(key) {
    return new Promise(async (res, rej) => {
        await client.del(key).catch( (err) => {
            if(err) {
                console.log(err);
                rej(err);
            }
        });
        res();
    });
}

app.get('/ready', async (req, res) => {
    res.send({ready: true})
})

client.connect();
