import mongoose, {Document, Schema} from "mongoose"


interface IComment extends Document {
    content: string,
    owner: string,
    cardId: string,
    lastEdited: Date,
    createdAt: Date
}

let CommentSchema: Schema = new Schema({
    content: {type: String, required: true},
    owner: {type: String, required: true},
    cardId: {type: String, required: true},
    lastEdited: {type: Date, required: true, default: new Date()},
    createdAt: {type: Date, required: true, default: new Date()}
})

const Comment: mongoose.Model<IComment> = mongoose.model<IComment>("Comment", CommentSchema)


export{IComment, Comment}