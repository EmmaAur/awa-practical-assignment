/* 
Sources:
1. How to do this at all: 
-> https://www.youtube.com/watch?v=TVZpk9L0V2k
-> https://stackoverflow.com/questions/55772477/how-to-implement-validation-in-a-separate-file-using-express-validator
1. custom validation: https://express-validator.github.io/docs/api/validation-chain/#custom
2. Check if string contains numbers: https://stackabuse.com/bytes/check-if-a-string-contains-numbers-in-javascript/
3. Special characters copied from Wiktor Stribizew's answer: https://stackoverflow.com/questions/32311081/check-for-special-characters-in-string
*/

import {body, check} from "express-validator"

// Check if the string has at least one upper case character
function checkUpper(str: string) {
    let upper: boolean = false
    for (let i = 0; i < str.length; i++) {
        if (str[i] == str[i].toUpperCase()) {
            upper = true
        }
    }
    return upper
}

// Check if the string has at least one lower case character
function checkLower(str: string) {
    let lower: boolean = false
    for (let i = 0; i < str.length; i++) {
        if (str[i] == str[i].toLowerCase()) {
            lower = true
        }
    }
    return lower
}

// checks the password for password requirements
export const registerValidation = [
    body("password").isLength({min: 8}).custom(password => {
        if (!checkUpper(password)) {
            throw new Error("Password has to contain at least one upper case letter.")
        } return true
    }).custom(password => {
        if (!checkLower(password)) {
            throw new Error("Password has to contain at least one lower case letter.")
        } return true
    }).custom(password => {
        if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) { // source 3
            throw new Error("Password has to contain at least one special character.")
        } return true
    }).escape(),
    check("username").trim().isLength({min: 3, max: 25}).escape(),
    check("email").trim().escape().isEmail()
]

// Validates the login input
export const loginValidation = [
    check("email").trim().escape().isEmail(),
    check("password").escape()
]
