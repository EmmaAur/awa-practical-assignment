"use strict";
/*
Sources:
1. How to do this at all:
-> https://www.youtube.com/watch?v=TVZpk9L0V2k
-> https://stackoverflow.com/questions/55772477/how-to-implement-validation-in-a-separate-file-using-express-validator
1. custom validation: https://express-validator.github.io/docs/api/validation-chain/#custom
2. Check if string contains numbers: https://stackabuse.com/bytes/check-if-a-string-contains-numbers-in-javascript/
3. Special characters copied from Wiktor Stribizew's answer: https://stackoverflow.com/questions/32311081/check-for-special-characters-in-string
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
// Check if the string has at least one upper case character
function checkUpper(str) {
    let upper = false;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == str[i].toUpperCase()) {
            upper = true;
        }
    }
    return upper;
}
// Check if the string has at least one lower case character
function checkLower(str) {
    let lower = false;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == str[i].toLowerCase()) {
            lower = true;
        }
    }
    return lower;
}
// checks the password for password requirements
exports.registerValidation = [
    (0, express_validator_1.body)("password").isLength({ min: 8 }).custom(password => {
        if (!checkUpper(password)) {
            throw new Error("Password has to contain at least one upper case letter.");
        }
        return true;
    }).custom(password => {
        if (!checkLower(password)) {
            throw new Error("Password has to contain at least one lower case letter.");
        }
        return true;
    }).custom(password => {
        if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) { // source 3
            throw new Error("Password has to contain at least one special character.");
        }
        return true;
    }).escape(),
    (0, express_validator_1.check)("username").trim().isLength({ min: 3, max: 25 }).escape(),
    (0, express_validator_1.check)("email").trim().escape().isEmail()
];
// Validates the login input
exports.loginValidation = [
    (0, express_validator_1.check)("email").trim().escape().isEmail(),
    (0, express_validator_1.check)("password").escape()
];
