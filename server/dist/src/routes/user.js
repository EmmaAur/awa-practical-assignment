"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inputValidator_1 = require("../validators/inputValidator");
const router = (0, express_1.Router)();
router.post("/user/register", inputValidator_1.registerValidation, async (req, res) => {
    // Check if the register input meets the validation requirements
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        // Check that the username or email are not in use already
        const foundUser = await User_1.User.findOne({ username: req.body.username });
        const foundEmail = await User_1.User.findOne({ email: req.body.email });
        if (!foundUser && !foundEmail) {
            // Hashing the password
            const salt = bcrypt_1.default.genSaltSync(10);
            const hash = bcrypt_1.default.hashSync(req.body.password, salt);
            // add the new user to the database
            const newUser = {
                email: req.body.email,
                password: hash,
                username: req.body.username
            };
            await User_1.User.create(newUser);
            res.status(200).json();
        }
        else {
            res.status(403).json({ message: "Username or email already in use." });
        }
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
router.post("/user/login", inputValidator_1.loginValidation, async (req, res) => {
    // Check if the login input meets the validation requirements
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        // Look for the user in the database based on their email
        const foundUser = await User_1.User.findOne({ email: req.body.email });
        if (!foundUser) {
            res.status(403).json({ success: false, message: "Login faied." });
            return;
        }
        // Create a jwt for authorization
        if (bcrypt_1.default.compareSync(req.body.password, foundUser.password)) {
            const jwtPayload = {
                _id: foundUser._id,
                username: foundUser.username
            };
            // send the jwt token to the user's browser
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET /*, {expiresIn: "15m"}*/);
            res.status(200).json({ success: true, token: token });
            return;
        }
        else {
            res.status(401).json({ message: "Login failed." });
            return;
        }
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
exports.default = router;
