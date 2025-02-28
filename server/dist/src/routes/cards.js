"use strict";
/*
Sources:
1. Remove item of an array based on its index: https://sentry.io/answers/remove-specific-item-from-array/
2. Sort an array of objects: https://stackoverflow.com/questions/43311121/sort-an-array-of-objects-in-typescript
3. Using splice: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
*/
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Card_1 = require("../models/Card");
const validateToken_1 = require("../middleware/validateToken");
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
router.post("/cards/fetchdata", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { columnid: string }
    */
    try {
        // fetch the cards and send them back
        let cards = await Card_1.Card.find({ columnid: req.body.columnid });
        if (!cards) {
            res.status(500).json({ error: "Card not found." });
            return;
        }
        res.status(200).json({ cards: cards });
        return;
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/cards/add", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { columnid: string }
    */
    try {
        // find old cards to give the new card an order number
        const oldCards = await Card_1.Card.find({ columnid: req.body.columnid });
        const order = oldCards.length;
        // Add the new card to the database
        const card = new Card_1.Card({
            title: "New card",
            owner: req.user?.username,
            columnid: req.body.columnid,
            order: order
        });
        await card.save();
        // Send back the updated cards
        const cards = await Card_1.Card.find({ columnid: req.body.columnid });
        console.log("In /cards/add", cards);
        res.status(200).json({ cards: cards });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.delete("/cards/delete", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { cardid: string, columnid: string }
    */
    try {
        // Delete the card matching the id in the request body
        await Card_1.Card.deleteOne({ _id: new mongodb_1.ObjectId(req.body.cardid) });
        let cards = await Card_1.Card.find({ columnid: req.body.columnid });
        const reorderedCards = reorderCards(cards); // This code was got from source 2
        // In order to reorder the cards data in the database, we delete the previous cards and insert the newly ordered list of cards
        await Card_1.Card.deleteMany({ columnid: req.body.columnid });
        await Card_1.Card.insertMany(reorderedCards);
        // Send back the reordered cards
        res.status(200).json({ cards: reorderedCards });
    }
    catch (error) {
        console.log("Error while deleting a topic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/cards/rename", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { cardid: string, columnid: string, newtitle: string }
    */
    await Card_1.Card.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.cardid) }, { $set: { title: req.body.newtitle } });
    let cards = await Card_1.Card.find({ columnid: req.body.columnid });
    res.status(200).json({ cards: cards });
});
router.post("/cards/updatecontent", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { columnid: string, cardid: string, newcontent: string }
    */
    try {
        await Card_1.Card.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.cardid) }, { $set: { content: req.body.newcontent } });
        let cards = await Card_1.Card.find({ columnid: req.body.columnid });
        res.status(200).json({ cards: cards });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/cards/updatecolor", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { cardid: string, columnid: stirng, newcolor: string }
    */
    try {
        const edited = new Date();
        await Card_1.Card.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.cardid) }, { $set: { color: req.body.newcolor, lastEdited: edited } });
        let cards = await Card_1.Card.find({ columnid: req.body.columnid });
        res.status(200).json({ cards: cards });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/cards/reorder", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { card: ICard, neworder: number, columnid: string }
    */
    try {
        // remove the card from its old index
        const cards = await Card_1.Card.find({ columnid: req.body.columnid });
        let currentIndex = req.body.card.order;
        cards.splice(currentIndex, 1);
        console.log("\nin /cards/reorder, when card removed:", cards);
        // Add the card on it's desired index and reset the order attributes of the cards using reorderCards
        cards.splice(req.body.neworder, 0, req.body.card);
        console.log("\nin /cards/reorder, when card added back:", cards);
        const reorderedCards = reorderCards(cards);
        console.log("\nAfter reorder", reorderedCards);
        // In order to reorder the cards data in the database, we delete the previous cards and insert the newly ordered list of cards
        await Card_1.Card.deleteMany({ columnid: req.body.columnid });
        // Add the new card to the database
        const newCards = [];
        reorderedCards.forEach(card => {
            const carddata = new Card_1.Card({
                title: card.title,
                content: card.content,
                color: card.color,
                columnid: card.columnid,
                order: card.order,
                createdAt: card.createdAt,
            });
            newCards.push(carddata);
        });
        await Card_1.Card.insertMany(newCards);
        console.log("\nnewCards:", newCards);
        // Send back the reordered cards
        res.status(200).json({ cards: newCards });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const reorderCards = (cards) => {
    let order = 0;
    cards.forEach(card => {
        card.order = order;
        order += 1;
    });
    return cards;
};
exports.default = router;
