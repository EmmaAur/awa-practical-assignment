/*
Sources:
1. Remove item of an array based on its index: https://sentry.io/answers/remove-specific-item-from-array/
*/

import {Request, Response, Router} from "express"
import {IColumn, Column} from "../models/Column"
import {ICard, Card} from "../models/Card"
import {validateToken, CustomRequest} from "../middleware/validateToken"
import {ObjectId} from "mongodb"

const router: Router = Router()

router.post("/cards/fetchcards", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { cardid: string, columnid: string }
    */
    try {
        let cards: ICard[] | null = await Card.find({columnid: req.body.columnid})
        if (!cards) {
            res.status(403).json({error: "Card not found."})
            return
        }
        res.status(200).json({cards: cards})
        return

    } catch (error: any) {
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})


router.post("/cards/add", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { columnid: string }
    */
    try {
        // Add the new card to the cards database
        const card: ICard = new Card({
            title: "New card",
            columnid: req.body.columnid
        })
        await card.save()

        // Update the new cards id to the 
        const column: IColumn | null = await Column.findOne({_id: new ObjectId(req.body.columnid)})
        let updatedCards: string[] | undefined = column?.cards
        

        let newCardId = card._id.toString()

        updatedCards?.push(newCardId)

        await Column.findOneAndUpdate(
            {_id:  new ObjectId(req.body.columnid)}, 
            {$set: {cards: updatedCards }}
        )

        // Send back the updated columns
        const cards: ICard[] = await Card.find({columnid: req.body.columnid})
        res.status(200).json({cards: cards})

    } catch (error: any) {
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})


router.delete("/cards/delete", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { cardid: string, columnid: string }
    */
    console.log("Card to delete: ", req.body.cardid)
    try {
        const column: IColumn | null = await Column.findOne({_id: new ObjectId(req.body.columnid)})
        if (!column) {
            res.status(500).json({error: "Column not found"})
            return
        }
        let cardIndex = column.cards.indexOf(req.body.cardid)
        const newColumnCards = column.cards.splice(cardIndex, 1)
        console.log("newColumnCards in /cards/delete: ", newColumnCards)
        
        await Column.findOneAndUpdate(
            {_id:  new ObjectId(req.body.columnid)}, 
            {$set: {cards: newColumnCards}}
        )
 
        await Card.deleteOne({_id: new ObjectId(req.body.cardid)})

        const cards: ICard[] | null = await Card.find({columnid: req.body.columnid})
        res.status(200).json({cards: cards})

    } catch (error: any) {
        console.log("Error while deleting a topic:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.post("/cards/rename", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { cardid: string, columnid: string, newtitle: string }
    */
    await Card.findOneAndUpdate({_id: new ObjectId(req.body.cardid)}, {$set: {title: req.body.newtitle}})
    let cards: ICard[] = await Card.find({columnid: req.body.columnid})
    res.status(200).json({cards: cards})
})

router.post("/cards/updatecontent", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { columnid: string, cardid: string, newcontent: string }
    */
    try {
        await Card.findOneAndUpdate({_id: new ObjectId(req.body.cardid)}, {$set: {content: req.body.newcontent}})
        let cards: ICard[] = await Card.find({columnid: req.body.columnid})
        res.status(200).json({cards: cards})
    } catch (error: any) { 
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.post("/cards/updatecolor", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { cardid: string, columnid: stirng, newcolor: string }
    */
    try {
        await Card.findOneAndUpdate({_id: new ObjectId(req.body.cardid)}, {$set: {color: req.body.newcolor}})

        let cards: ICard[] = await Card.find({columnid: req.body.columnid})
        res.status(200).json({cards: cards})

    } catch (error: any) { 
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// NOT DONE YET
router.get("/cards/reorder", validateToken, async (req: CustomRequest, res: Response) => {
    /*
    req.body requires:
    { cardid: string, neworder: number }
    */
    try {
        let cards: ICard[] = await Card.find({owner: req.user?.username})
        let orderedCards: ICard[] = []

        cards.forEach(card => {
            let prevcard: ICard = card
        })
        // HERE EDIT THE NEW  CARDS ORDER

        // cards.forEach(card => {
        //     if (card.order > req.body.neworder) {
        //         // EDIT CARD ORDER +1
        //     }
        // });
        res.status(200).json({cards: cards})

    } catch (error: any) { 
        console.log("Error while fecthing data:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})



export default router