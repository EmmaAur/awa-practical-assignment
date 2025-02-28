import {Request, Response, Router} from "express"
import {validateToken, CustomRequest} from "../middleware/validateToken"
import {IComment, Comment} from "../models/Comment"
import {ObjectId} from "mongodb"

const router: Router = Router()

router.post("/comments/fetchdata", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { cardid: string }
    */
    try {
        // fetch the comments
        const comments: IComment[] | null = await Comment.find({cardId: req.body.cardid})
        if (!comments) {
            res.status(500).json({error: "No comments not found."})
            return
        }
        res.status(200).json({comments: comments})
        return

    } catch (error: any) {
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})


router.post("/comments/add", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { content: string, cardid: string }
    */
    try {
        // Add the new comment to the database
        const comment: IComment = new Comment({
            content: req.body.content,
            owner: req.user?.username,
            cardId: req.body.cardid,
        })
        await comment.save()

        // Send back the updated comments
        const comments: IComment[] = await Comment.find({cardId: req.body.cardid})
        res.status(200).json({comments: comments})

    } catch (error: any) {
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})


export default router