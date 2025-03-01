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
const Comment_1 = require("../models/Comment");
const validateToken_1 = require("../middleware/validateToken");
const mongodb_1 = require("mongodb");
const Column_1 = require("../models/Column");
const router = (0, express_1.Router)();
router.post("/cards/fetchdata", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { columnid: string }
    */
    try {
        // fetch the cards and send them back to frontend
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
    { columnid: string, cardid: string }
    */
    try {
        // Delete the card matching the id in the request body as well as any comment attached to it
        await Card_1.Card.deleteOne({ _id: new mongodb_1.ObjectId(req.body.cardid) });
        await Comment_1.Comment.deleteMany({ cardid: req.body.cardid });
        // Reset the cards' order
        let cards = await Card_1.Card.find({ columnid: req.body.columnid });
        const reorderedCards = reorderCards(cards);
        // In order to reorder the cards in the database, we delete the previous cards 
        // and then insert the newly ordered list of cards into the database
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
    try {
        // Find the card using the cardid and update the name and lastEdited attributes
        const edited = new Date();
        await Card_1.Card.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.cardid) }, { $set: { title: req.body.newtitle, lastEdited: edited } });
        // Send back the updated list of cards
        let cards = await Card_1.Card.find({ columnid: req.body.columnid });
        res.status(200).json({ cards: cards });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/cards/updatecontent", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { columnid: string, cardid: string, newcontent: string }
    */
    try {
        // Find the card using the cardid and update the content and lastEdited attributes
        const edited = new Date();
        await Card_1.Card.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.cardid) }, { $set: { content: req.body.newcontent, lastEdited: edited } });
        // Send back the updated list of cards
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
        // Find the card using the cardid and update the color and lastEdited attributes
        const edited = new Date();
        await Card_1.Card.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.cardid) }, { $set: { color: req.body.newcolor, lastEdited: edited } });
        // Send back the updated list of cards
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
    { cardfrom: ICard, cardto: ICard }
     -> cardfrom is the card that is moved from its original position and cardto is where it's moved to
    */
    try {
        // remove the card from its old position
        if (req.body.cardfrom.columnid === req.body.cardto.columnid) {
            const cards = await Card_1.Card.find({ columnid: req.body.cardfrom.columnid });
            let currentIndex = req.body.cardfrom.order;
            cards.splice(currentIndex, 1);
            // Add the card on it's desired index and reset the order attributes of the cards using reorderCards
            cards.splice(req.body.cardto.order, 0, req.body.cardfrom);
            const reorderedCards = reorderCards(cards);
            // In order to reorder the cards data in the database, we delete the previous cards and insert the newly ordered list of cards
            await Card_1.Card.deleteMany({ columnid: req.body.cardfrom.columnid });
            await Card_1.Card.insertMany(reorderedCards);
            // Send back the reordered cards
            console.log(reorderedCards);
            res.status(200).json({ cards: reorderedCards });
        }
        else {
            // Cardfrom gets removed from it's original column and fetch the new columns cards
            await Card_1.Card.deleteOne({ _id: new mongodb_1.ObjectId(req.body.cardfrom._id) });
            const cards = await Card_1.Card.find({ columnid: req.body.cardto.columnid });
            // Change the cardfrom columnid to match with cardto columnid:
            req.body.cardfrom.columnid = req.body.cardto.columnid;
            // Then the card gets added to it's new required position in the other column (reorder the cards)
            cards.splice(req.body.cardto.order, 0, req.body.cardfrom);
            const reorderedCards = reorderCards(cards);
            // In order to reorder the cards data in the database, we delete the previous cards and insert the newly ordered list of cards
            await Card_1.Card.deleteMany({ columnid: req.body.cardto.columnid });
            await Card_1.Card.insertMany(reorderedCards);
            // Send back the reordered cards and columns for colum refresh:
            const columns = await Column_1.Column.find({ owner: req.user?.username });
            res.status(200).json({ cards: reorderedCards, columns: columns });
        }
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const reorderCards = (cards) => {
    // Function to reset the "order" attributes of cards.
    let order = 0;
    cards.forEach(card => {
        card.order = order;
        order += 1;
    });
    return cards;
};
exports.default = router;
