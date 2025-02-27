"use strict";
/*
Sources:
1. Remove item of an array based on its index: https://sentry.io/answers/remove-specific-item-from-array/
*/
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Column_1 = require("../models/Column");
const Card_1 = require("../models/Card");
const validateToken_1 = require("../middleware/validateToken");
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
router.post("/cards/fetchcards", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { cardid: string, columnid: string }
    */
    try {
        let cards = await Card_1.Card.find({ columnid: req.body.columnid });
        if (!cards) {
            res.status(403).json({ error: "Card not found." });
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
        // Add the new card to the cards database
        const card = new Card_1.Card({
            title: "New card",
            columnid: req.body.columnid
        });
        await card.save();
        // Update the new cards id to the 
        const column = await Column_1.Column.findOne({ _id: new mongodb_1.ObjectId(req.body.columnid) });
        let updatedCards = column?.cards;
        let newCardId = card._id.toString();
        updatedCards?.push(newCardId);
        await Column_1.Column.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.columnid) }, { $set: { cards: updatedCards } });
        // Send back the updated columns
        const cards = await Card_1.Card.find({ columnid: req.body.columnid });
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
    console.log("Card to delete: ", req.body.cardid);
    try {
        const column = await Column_1.Column.findOne({ _id: new mongodb_1.ObjectId(req.body.columnid) });
        if (!column) {
            res.status(500).json({ error: "Column not found" });
            return;
        }
        let cardIndex = column.cards.indexOf(req.body.cardid);
        const newColumnCards = column.cards.splice(cardIndex, 1);
        console.log("newColumnCards in /cards/delete: ", newColumnCards);
        await Column_1.Column.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.columnid) }, { $set: { cards: newColumnCards } });
        await Card_1.Card.deleteOne({ _id: new mongodb_1.ObjectId(req.body.cardid) });
        const cards = await Card_1.Card.find({ columnid: req.body.columnid });
        res.status(200).json({ cards: cards });
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
        await Card_1.Card.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.cardid) }, { $set: { color: req.body.newcolor } });
        let cards = await Card_1.Card.find({ columnid: req.body.columnid });
        res.status(200).json({ cards: cards });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// NOT DONE YET
router.get("/cards/reorder", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { cardid: string, neworder: number }
    */
    try {
        let cards = await Card_1.Card.find({ owner: req.user?.username });
        let orderedCards = [];
        cards.forEach(card => {
            let prevcard = card;
        });
        // HERE EDIT THE NEW  CARDS ORDER
        // cards.forEach(card => {
        //     if (card.order > req.body.neworder) {
        //         // EDIT CARD ORDER +1
        //     }
        // });
        res.status(200).json({ cards: cards });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
