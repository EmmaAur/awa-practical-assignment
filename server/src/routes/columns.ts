import {Request, Response, Router} from "express"
import {IColumn, Column} from "../models/Column"
import {IUser, User} from "../models/User"
import {validateToken, CustomRequest} from "../middleware/validateToken"
import {ObjectId} from "mongodb"

const router: Router = Router()

router.get("/columns/fetchdata", validateToken, async (req: CustomRequest, res: Response) => {

    try {
        const columns: IColumn[] = await Column.find({owner: req.user?.username})

        res.status(200).json({columns: columns})

    } catch (error: any) {
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.get("/columns/add", validateToken, async (req: CustomRequest, res: Response) => {
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
    await Column.findOneAndUpdate({_id: new ObjectId(req.body.columnid)}, {$set: {columnname: req.body.newname}})
    let columns: IColumn[] = await Column.find({owner: req.user?.username})
    res.status(200).json({columns: columns})
})


router.delete("/columns/delete", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { columnid: string }
    */
    try {
        await Column.deleteOne({_id: new ObjectId(req.body.columnid)})
        const columns: IColumn[] | null = await Column.find({owner: req.user?.username})
        res.status(200).json({columns: columns})

    } catch (error: any) {
        console.log("Error while deleting a topic:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})



export default router