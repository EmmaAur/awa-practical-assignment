"use strict";
/* Week 8 tasks */
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
router.post("/api/user/register/", inputValidator_1.registerValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const foundUser = await User_1.User.findOne({ email: req.body.email });
        if (!foundUser) {
            // Hashing the password
            const salt = bcrypt_1.default.genSaltSync(10);
            const hash = bcrypt_1.default.hashSync(req.body.password, salt);
            const newUser = {
                password: hash,
                username: req.body.username
            };
            await User_1.User.create(newUser);
            res.status(200).json(newUser);
            return;
        }
        else {
            res.status(403).json({ message: "Email already in use." });
        }
    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
router.post("/api/user/login", inputValidator_1.loginValidation, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const foundUser = await User_1.User.findOne({ email: req.body.email });
        if (!foundUser) {
            res.status(404).json({ success: false, message: "Login faied." });
            return;
        }
        if (bcrypt_1.default.compareSync(req.body.password, foundUser.password)) {
            const jwtPayload = {
                _id: foundUser._id,
                username: foundUser.username,
                isAdmin: foundUser.isAdmin
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "2m" });
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
