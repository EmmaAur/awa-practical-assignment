/* Copied from week 8 tasks */

import mongoose, {Document, Schema} from "mongoose"

interface IUser extends Document {
    email: string,
    password: string,
    username: string
}

let userSchema: Schema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    username: {type: String, required: true}
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema)


export{IUser, User}