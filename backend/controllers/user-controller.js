const userService = require('../services/user-service')
const { StatusCodes } = require('http-status-codes')

const addAssociation = async (req, res) => {
    const { userId, targetId } = req.body
    const assoc = await userService.createAssociation(userId, targetId)
    return res.status(StatusCodes.CREATED).json(assoc)
}

const removeAssociation = async (req, res) => {
    const { userId, targetId } = req.body
    await userService.removeAssociation(userId, targetId)
    return res.status(StatusCodes.NO_CONTENT).send()
}

const getUsersAssociations = async(req, res) => {
    const {userId} = req.body
    const associations = await userService.getUsersAssociations(userId)

    return res.status(StatusCodes.OK).json(associations)
}

module.exports = { addAssociation, removeAssociation, getUsersAssociations }