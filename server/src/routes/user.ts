import {Request, Response, Router} from "express"
import {body, Result, ValidationError, validationResult} from "express-validator"
import {IUser, User} from "../models/User"
import bcrypt from "bcrypt"
import jwt, {JwtPayload} from "jsonwebtoken"
import {registerValidation, loginValidation} from "../validators/inputValidator"

const router: Router = Router()

router.post("/user/register", registerValidation, async (req: Request, res: Response) => {
    // Check if the register input meets the validation requirements
    const errors: Result<ValidationError> = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        res.status(400).json({errors: errors.array()})
        return
    }
    try {
        // Check that the username or email are not in use already
        const foundUser: IUser | null = await User.findOne({username: req.body.username})
        const foundEmail: IUser | null = await User.findOne({email: req.body.email})
        if (!foundUser && !foundEmail) {
            
            // Hashing the password
            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)

            // add the new user to the database
            const newUser = {
                email: req.body.email,
                password: hash,
                username: req.body.username
            }
            await User.create(newUser)
            res.status(200).json()

        } else {
            res.status(403).json({message: "Username or email already in use."})
        }
    } catch (error: any) {
        console.error("Error during registration:", error)
        res.status(500).json({error: "Internal Server Error"})
        return
    }
})


router.post("/user/login", loginValidation, async (req: Request, res: Response) => {
    // Check if the login input meets the validation requirements
    const errors: Result<ValidationError> = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        res.status(400).json({errors: errors.array()})
        return
    }

    try {
        // Look for the user in the database based on their email
        const foundUser: IUser | null = await User.findOne({email: req.body.email})
        if (!foundUser) {
            res.status(403).json({success: false, message: "Login faied."})
            return
        } 

        // Create a jwt for authorization
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
            const jwtPayload: JwtPayload = {
                _id: foundUser._id,
                username: foundUser.username
            }

            // send the jwt token to the user's browser
            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string/*, {expiresIn: "15m"}*/)
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