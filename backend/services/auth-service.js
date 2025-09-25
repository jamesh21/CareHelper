const userModel = require('../models/user-model')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require('../errors')

class AuthService {
    register = async (email, password, name, roleId) => {
        if (!email || !name || !password == null || !roleId) {
            throw new BadRequestError('Email, name, password, or role Id was not provided')
        }
        if (password.length < 8) {
            throw new BadRequestError('Password must be atleast 8 characters long')
        }
        const salt = await bcrypt.genSalt(10);
        // hash password
        const hashedPassword = await bcrypt.hash(password, salt)

        // add fields to db
        const user = await userModel.addUserToDB(email, hashedPassword, roleId, name)

        return this.buildAuthResponse(user)
    }

    login = async (email, password) => {
        if (!email || !password == null) {
            throw new BadRequestError('Email or password was not provided')
        }
        const user = await userModel.getUserFromDBWithEmail(email)
        const passwordMatch = await this.comparePassword(password, user.hashedPassword)
        
        if (!passwordMatch) {
            throw new UnauthenticatedError('Incorrect Password')
        }

        return this.buildAuthResponse(user)
    } 

    /**
     * Helper function for building auth response.
     * @param {*} user 
     * @returns An object that holds a bearer token and user details
     */
    buildAuthResponse = (user) => {
        const token = this.createJWT(user.email, user.name, user.userId, user.roleId)
        return {
            user:
            {
                name: user.name,
                email: user.email,
                userId: user.userId,
                roleId: user.roleId
            },
            token
        }
    }

    /**
     * Helper function for creating a new token given user information.
     * @param {*} email 
     * @param {*} name 
     * @param {*} userId 
     * @param {*} roleId 
     * @returns JWT bearer token
     */
    createJWT = (email, name, userId, roleId) => {
        const token = jwt.sign(
            {
                email, name, userId, roleId
            }, process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_LIFETIME
            })
        return token
    }

    /**
     * Compares candidate password with hashed password and returns a boolean representing if it has matched. 
     * @param {*} candidatePassword 
     * @param {*} dbPass 
     * @returns Boolean representing if password is correct
     */
    comparePassword = async (candidatePassword, dbPass) => {
        const isMatch = await bcrypt.compare(candidatePassword, dbPass);
        return isMatch;
    }
}

module.exports = new AuthService()