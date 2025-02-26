/* Week 8 tasks */

import {Request, Response, Router} from "express"
import {IColumn, Column} from "../models/Column"
import {ICard, Card} from "../models/Card"
import {IUser, User} from "../models/User"
import {IComment, Comment} from "../models/Comment"
import {validateToken, CustomRequest} from "../middleware/validateToken"
import {ObjectId} from "mongodb"

const router: Router = Router()

// GET
router.get("/api/columns", validateToken, async (req: CustomRequest, res: Response) => {

    try {
        const columns: IColumn[] = await Column.find({owner: req.user?.username})
        const cards: ICard[] = await Card.find({owner: req.user?.username})

        // columns.map((Column) => (
        //     console.log(Column)
        // ))

        res.status(200).json({columns: columns})

    } catch (error: any) {
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})


// POST
router.get("/api/newcolumn", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const updatedUser: IUser | null = await User.findOneAndUpdate(
            {username: req.user?.username}, 
            {$inc: {columns: 1 }}
        )
        
        const column: IColumn = new Column({
            owner: req.user?.username,
            columnname: "New column " + updatedUser?.columns.toString()
        })
        
        await column.save()
        res.status(200).json({message: "Success"})

    } catch (error: any) {
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.post("/api/renamecolumn", validateToken, async (req: CustomRequest, res: Response) => {
    const foundColumn: IColumn | null = await Column.findOne({Columnname: req.body.Columnname})
    if (!foundColumn) {
        const column: IColumn = new Column({
            owner: req.user?.username,
            Columnname: "New Column"
        })
        await column.save()
        res.status(200).json({name: req.user?.username})
    }
})

// DELETE
router.delete("/api/topic/:id", validateToken, async (req: Request, res: Response) => {
})


export default router