# MoonActiveCallengeSolution

A solution for the Moon Active Backend Performance Challenge, as described here:
https://github.com/Moonactive-BE-Meetup/BE-Challenge

## The suggested solution:
Using redis' INCR function to get the card number and increment the number for the next card pull.
Returning all cards while there are still cards in the array, then returning the ALL CARDS response.
Deleting the user's key from redis without waiting, to occur whenever possible in the server.

** The previous commit handles the challenge with additional shuffling for random card at every call from the user, until all cards are pulled

### UPDATE
The submission time is over, however I would like to share that running the same code with fastify instead of express is about 3 times faster!!!
This is an amazing improvement in one small (and incredible) module change. Definitely going to use it going on. Thank you Moon Active.
