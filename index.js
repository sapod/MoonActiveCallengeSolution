const fs = require('fs');
const express = require('express');
const app = express();
const port = +process.argv[2] || 3000;

// setup the redis client
const client = require('redis').createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

// prepare the card array for pulling
const cardsData = fs.readFileSync('./cards.json');
const cards = JSON.parse(cardsData);

// handle card pulling requests
app.get('/card_add', async (req, res) => {
    const  key = String(req.query.id);

    // get the current card number for the user and increment the value for the next call
    let card_number = await client.incr(key);

    // fetch the card from the array or return ALL CARDS if there are no more cards to give
    let card = cards[card_number - 1];
    card ? res.send(card) : res.send({id: "ALL CARDS"});

    // remove the key from redis whenever to cleanup
    if (!card)
        client.del(key);
});

// server status check
app.get('/ready', async (req, res) => {
    res.send({ready: true});
});

// start the server
app.listen(port, '0.0.0.0');