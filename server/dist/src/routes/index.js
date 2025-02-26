"use strict";
/* Week 8 tasks */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Column_1 = require("../models/Column");
const Card_1 = require("../models/Card");
const User_1 = require("../models/User");
const validateToken_1 = require("../middleware/validateToken");
const router = (0, express_1.Router)();
// GET
router.get("/api/columns", validateToken_1.validateToken, async (req, res) => {
    try {
        const columns = await Column_1.Column.find({ owner: req.user?.username });
        const cards = await Card_1.Card.find({ owner: req.user?.username });
        // columns.map((Column) => (
        //     console.log(Column)
        // ))
        res.status(200).json({ columns: columns });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// POST
router.get("/api/newcolumn", validateToken_1.validateToken, async (req, res) => {
    try {
        const updatedUser = await User_1.User.findOneAndUpdate({ username: req.user?.username }, { $inc: { columns: 1 } });
        const column = new Column_1.Column({
            owner: req.user?.username,
            columnname: "New column " + updatedUser?.columns.toString()
        });
        await column.save();
        res.status(200).json({ message: "Success" });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/api/renamecolumn", validateToken_1.validateToken, async (req, res) => {
    const foundColumn = await Column_1.Column.findOne({ Columnname: req.body.Columnname });
    if (!foundColumn) {
        const column = new Column_1.Column({
            owner: req.user?.username,
            Columnname: "New Column"
        });
        await column.save();
        res.status(200).json({ name: req.user?.username });
    }
});
// DELETE
router.delete("/api/topic/:id", validateToken_1.validateToken, async (req, res) => {
});
exports.default = router;
