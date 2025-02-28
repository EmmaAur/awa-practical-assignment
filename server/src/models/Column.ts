import mongoose, {Document, Schema} from "mongoose"
import {ObjectId} from "mongodb"

const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm'

interface IColumn extends Document {
    owner: string,
    columnname: string,
    createdAt: Date,
    _id: ObjectId
}

let columnSchema: Schema = new Schema({
    owner: {type: String, required: true},
    columnname: {type: String, required: true},
    createdAt: {type: Date, required: true, default: new Date()}
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("column", columnSchema)


export{IColumn, Column}