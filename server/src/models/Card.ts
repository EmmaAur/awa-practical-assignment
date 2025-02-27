import mongoose, {Document, Schema} from "mongoose"
import {ObjectId} from "mongodb"

interface ICard extends Document {
    title: string,
    content: string,
    color: string,
    columnid: string,
    createdAt: Date,
    _id: ObjectId
}

let cardSchema: Schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true, default: "This is a new card."},
    color: {type: String, required: true, default: "#A9D2D5"},
    columnid: {type: String, required: true},
    createdAt: {type: Date, required: true, default: new Date()},
})

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", cardSchema)


export{ICard, Card}