const authService = require('../services/auth-service')
const { StatusCodes } = require('http-status-codes')

/**
 * Registers a new user into users table. Returns bearer token and user data
 * @param {*} req 
 * @param {*} res 
 * @returns An object that holds a bearer token and user details
 */
const register = async (req, res) => {
    const { email, password, name, roleId } = req.body
    const token = await authService.register(email, password, name, roleId)
    return res.status(StatusCodes.CREATED).json(token)
}

/**
 * Logs in registered user by fetching bearer token and user data
 * @param {*} req 
 * @param {*} res 
 * @returns An object that holds a bearer token and user details
 */
const login = async (req, res) => {
    const { email, password } = req.body
    const token = await authService.login(email, password)
    return res.status(StatusCodes.OK).json(token)
}

module.exports = { register, login }