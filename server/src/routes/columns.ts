import {Request, Response, Router} from "express"
import {IColumn, Column} from "../models/Column"
import {ICard, Card} from "../models/Card"
import {IUser, User} from "../models/User"
import {validateToken, CustomRequest} from "../middleware/validateToken"
import {ObjectId} from "mongodb"

const router: Router = Router()

router.get("/columns/fetchdata", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        // fetches the columns and sends them to the frontend
        const columns: IColumn[] = await Column.find({owner: req.user?.username})
        res.status(200).json({columns: columns})

    } catch (error: any) {
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.get("/columns/add", validateToken, async (req: CustomRequest, res: Response) => {
    try {
        // Update user data
        const updatedUser: IUser | null = await User.findOneAndUpdate(
            {username: req.user?.username}, 
            {$inc: {columns: 1 }}
        )
        
        // Create new column and save it in the database
        const column: IColumn = new Column({
            owner: req.user?.username,
            columnname: "New column " + updatedUser?.columns.toString()
        })
        await column.save()

        // Send back the updated list of columns
        const columns: IColumn[] | null = await Column.find({owner: req.user?.username})
        res.status(200).json({columns: columns})

    } catch (error: any) {
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.post("/columns/rename", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { columnid: string, newname: string }
    */
    try {
        // Find the column based on columnid and update the new name to the database
        await Column.findOneAndUpdate({_id: new ObjectId(req.body.columnid)}, {$set: {columnname: req.body.newname}})
        let columns: IColumn[] = await Column.find({owner: req.user?.username})

        // send back the updated column list
        res.status(200).json({columns: columns})

    } catch (error: any) {
        console.log("Error while deleting a topic:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})


router.delete("/columns/delete", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { columnid: string }
    */
    try {
        // Delete the column based on the column id. Also delete all cards associated with the same column id
        await Column.deleteOne({_id: new ObjectId(req.body.columnid)})
        await Card.deleteMany({columnid: req.body.columnid})

        // Send back the updated column list
        const columns: IColumn[] | null = await Column.find({owner: req.user?.username})
        res.status(200).json({columns: columns})

    } catch (error: any) {
        console.log("Error while deleting a topic:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})



export default router