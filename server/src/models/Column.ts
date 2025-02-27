/*
Sources:
1. How to add an array to the mongodb schema: https://stackoverflow.com/questions/41013039/mongoose-schema-how-to-add-an-array
*/

import mongoose, {Document, Schema} from "mongoose"
import {ObjectId} from "mongodb"


interface IColumn extends Document {
    owner: string,
    columnname: string,
    cards: [ string ],
    createdAt: Date,
    _id: ObjectId
}

let columnSchema: Schema = new Schema({
    owner: {type: String, required: true},
    columnname: {type: String, required: true},
    cards: [{type: String, required: true, default: []}],
    createdAt: {type: Date, required: true, default: new Date()}
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("column", columnSchema)


export{IColumn, Column}