import mongoose, {Document, Schema} from "mongoose"
import {ObjectId} from "mongodb"

interface ICard extends Document {
    title: string,
    content: string,
    owner: string,
    color: string,
    columnid: string,
    order: number,
    lastEdited: Date,
    createdAt: Date,
    _id: ObjectId
}

let cardSchema: Schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true, default: "This is a new card."},
    owner: {type: String, required: true},
    color: {type: String, required: true, default: "#A9D2D5"},
    columnid: {type: String, required: true},
    order: {type: Number, required: true},
    lastEdited: {type: Date, required: true, default: new Date()},
    createdAt: {type: Date, required: true, default: new Date()}
})

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", cardSchema)


export{ICard, Card}