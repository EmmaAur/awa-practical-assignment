"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Column_1 = require("../models/Column");
const Card_1 = require("../models/Card");
const User_1 = require("../models/User");
const validateToken_1 = require("../middleware/validateToken");
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
router.get("/columns/fetchdata", validateToken_1.validateToken, async (req, res) => {
    try {
        // fetches the columns and sends them to the frontend
        const columns = await Column_1.Column.find({ owner: req.user?.username });
        res.status(200).json({ columns: columns });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get("/columns/add", validateToken_1.validateToken, async (req, res) => {
    try {
        // Update user data
        const updatedUser = await User_1.User.findOneAndUpdate({ username: req.user?.username }, { $inc: { columns: 1 } });
        // Create new column and save it in the database
        const column = new Column_1.Column({
            owner: req.user?.username,
            columnname: "New column " + updatedUser?.columns.toString()
        });
        await column.save();
        // Send back the updated list of columns
        const columns = await Column_1.Column.find({ owner: req.user?.username });
        res.status(200).json({ columns: columns });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/columns/rename", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { columnid: string, newname: string }
    */
    try {
        // Find the column based on columnid and update the new name to the database
        await Column_1.Column.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.columnid) }, { $set: { columnname: req.body.newname } });
        let columns = await Column_1.Column.find({ owner: req.user?.username });
        // send back the updated column list
        res.status(200).json({ columns: columns });
    }
    catch (error) {
        console.log("Error while deleting a topic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.delete("/columns/delete", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { columnid: string }
    */
    try {
        // Delete the column based on the column id. Also delete all cards associated with the same column id
        await Column_1.Column.deleteOne({ _id: new mongodb_1.ObjectId(req.body.columnid) });
        await Card_1.Card.deleteMany({ columnid: req.body.columnid });
        // Send back the updated column list
        const columns = await Column_1.Column.find({ owner: req.user?.username });
        res.status(200).json({ columns: columns });
    }
    catch (error) {
        console.log("Error while deleting a topic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
