import mongoose, {Document, Schema} from "mongoose"


interface IComment extends Document {
    message: string,
    username: string,
    cardId: string,
    createdAt: Date
}

let CommentSchema: Schema = new Schema({
    message: {type: String, required: true},
    username: {type: String, required: true},
    cardId: {type: String, required: true},
    createdAt: {type: Date, required: true, default: new Date()}
})

const Comment: mongoose.Model<IComment> = mongoose.model<IComment>("Comment", CommentSchema)


export{IComment, Comment}