/* Week 8 tasks */

import {Request, Response, Router} from "express"
import {body, Result, ValidationError, validationResult} from "express-validator"
import {IUser, User} from "../models/User"
import bcrypt from "bcrypt"
import jwt, {JwtPayload} from "jsonwebtoken"
import {registerValidation, loginValidation} from "../validators/inputValidator"

const router: Router = Router()

router.post("/api/user/register/", registerValidation, async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        res.status(400).json({errors: errors.array()})
        return
    }
    try {
        const foundUser: IUser | null = await User.findOne({email: req.body.email})
        if (!foundUser) {
            // Hashing the password
            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)
            
            const newUser = {
                password: hash,
                username: req.body.username
            }

            await User.create(newUser)
            res.status(200).json(newUser)
            return
        } else {
            res.status(403).json({message: "Email already in use."})
        }
    } catch (error: any) {
        console.error("Error during registration:", error)
        res.status(500).json({error: "Internal Server Error"})
        return
    }
})


router.post("/api/user/login", loginValidation, async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        res.status(400).json({errors: errors.array()})
        return
    }

    try {
        const foundUser: IUser | null = await User.findOne({email: req.body.email})
        if (!foundUser) {
            res.status(404).json({success: false, message: "Login faied."})
            return
        } 
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
            const jwtPayload: JwtPayload = {
                _id: foundUser._id,
                username: foundUser.username,
                isAdmin: foundUser.isAdmin
            }
            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "2m"})
            res.status(200).json({success: true, token: token})
            return
        } else {
            res.status(401).json({message: "Login failed."})
            return
        }
    } catch (error: any) {
        console.error("Error during login:", error)
            res.status(500).json({error: "Internal Server Error"})
            return
    }
})

export default router