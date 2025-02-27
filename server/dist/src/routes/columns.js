"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Column_1 = require("../models/Column");
const User_1 = require("../models/User");
const validateToken_1 = require("../middleware/validateToken");
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
router.get("/columns/fetchdata", validateToken_1.validateToken, async (req, res) => {
    try {
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
        const updatedUser = await User_1.User.findOneAndUpdate({ username: req.user?.username }, { $inc: { columns: 1 } });
        const column = new Column_1.Column({
            owner: req.user?.username,
            columnname: "New column " + updatedUser?.columns.toString()
        });
        await column.save();
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
    await Column_1.Column.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.body.columnid) }, { $set: { columnname: req.body.newname } });
    let columns = await Column_1.Column.find({ owner: req.user?.username });
    res.status(200).json({ columns: columns });
});
router.delete("/columns/delete", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { columnid: string }
    */
    try {
        await Column_1.Column.deleteOne({ _id: new mongodb_1.ObjectId(req.body.columnid) });
        const columns = await Column_1.Column.find({ owner: req.user?.username });
        res.status(200).json({ columns: columns });
    }
    catch (error) {
        console.log("Error while deleting a topic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
