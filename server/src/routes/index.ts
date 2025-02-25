/* Week 8 tasks */

import {Request, Response, Router} from "express"
import {body, Result, ValidationError, validationResult} from "express-validator"
import {validateToken} from "../middleware/validateToken"
import {ObjectId} from "mongodb"
import jwt, {JwtPayload} from "jsonwebtoken"

const router: Router = Router()

// GET route to "/api/topics" which returns all topics from database.
router.get("/api/topics", async (req: Request, res: Response) => {
    try {
    } catch (error: any) {
        console.log("Error while fecthing topics:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// POST /api/topic posts a new topic into the database
router.post("/api/topic", validateToken, async (req: Request, res: Response) => {
    try {
    } catch(error: any) {
        console.log("Error while creating a topic:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// DELETE /api/topic/:id deletes a topic matching the id
router.delete("/api/topic/:id", async (req: Request, res: Response) => {
})

export default router