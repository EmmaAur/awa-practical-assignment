"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateToken_1 = require("../middleware/validateToken");
const Comment_1 = require("../models/Comment");
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
router.post("/comments/fetchdata", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { cardid: string }
    */
    try {
        // fetch the comments
        const comments = await Comment_1.Comment.find({ cardId: req.body.cardid });
        if (!comments) {
            res.status(500).json({ error: "No comments not found." });
            return;
        }
        // Send comments to frontend
        res.status(200).json({ comments: comments });
        return;
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/comments/add", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { content: string, cardid: string }
    */
    try {
        // Add the new comment to the database
        const comment = new Comment_1.Comment({
            content: req.body.content,
            owner: req.user?.username,
            cardId: req.body.cardid,
        });
        await comment.save();
        // Send back the updated comments
        const comments = await Comment_1.Comment.find({ cardId: req.body.cardid });
        res.status(200).json({ comments: comments });
    }
    catch (error) {
        console.log("Error while fecthing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.delete("/comments/delete", validateToken_1.validateToken, async (req, res) => {
    /*
    req.body requires:
    { commentid: string }
    */
    try {
        // Delete the comment
        await Comment_1.Comment.deleteOne({ _id: new mongodb_1.ObjectId(req.body.commentid) });
        // Send the remaining comments back to the frontend
        const comments = await Comment_1.Comment.find({ owner: req.user?.username });
        res.status(200).json({ comments: comments });
    }
    catch (error) {
        console.log("Error while deleting a topic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
