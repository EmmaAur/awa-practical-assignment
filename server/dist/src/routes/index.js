"use strict";
/* Week 8 tasks */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateToken_1 = require("../middleware/validateToken");
const router = (0, express_1.Router)();
// GET route to "/api/topics" which returns all topics from database.
router.get("/api/topics", async (req, res) => {
    try {
    }
    catch (error) {
        console.log("Error while fecthing topics:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// POST /api/topic posts a new topic into the database
router.post("/api/topic", validateToken_1.validateToken, async (req, res) => {
    try {
    }
    catch (error) {
        console.log("Error while creating a topic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// DELETE /api/topic/:id deletes a topic matching the id
router.delete("/api/topic/:id", async (req, res) => {
});
exports.default = router;
