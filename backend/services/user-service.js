const { BadRequestError } = require('../errors')
const userModel = require('../models/user-model')
const { CAREGIVER_ROLE } = require('../constants/constants')
class UserService {

    // To create an association I need to add the 2 user Id's into our user assocation table
    // How can I determine which role the Id's have
    // It has to be 1 care giver to 1 caregiver recipient
    // Should I return an object with both user details?

    createAssociation = async (userId, targetUserId) => {
        if (!userId || !targetUserId) {
            throw new BadRequestError('User Id or target user id was not provided')
        }
        const { roleId: userRoleId } = await userModel.getUserRoleByID(userId)
        const { roleId: targetRoleId } = await userModel.getUserRoleByID(targetUserId)

        if (userRoleId == targetRoleId) {
            throw new BadRequestError('You cannot create an association with users with the same role')
        }
        let caregiverId, recipientId
        if (userRoleId == 1) { // user is a caregiver
            caregiverId = userId
            recipientId = targetUserId
        } else { // user is a care recipient
            caregiverId = targetUserId
            recipientId = userId
        }

        const res = await userModel.addUserAssociationToDB(caregiverId, recipientId)
        return res
    }

    removeAssociation = async (userId, targetUserId) => {
        if (!userId || !targetUserId) {
            throw new BadRequestError('User Id or target user id was not provided')
        }
        const { roleId: userRoleId } = await userModel.getUserRoleByID(userId)

        let caregiverId, recipientId
        if (userRoleId === CAREGIVER_ROLE) { // user is a caregiver
            caregiverId = userId
            recipientId = targetUserId
        } else { // user is a care recipient
            caregiverId = targetUserId
            recipientId = userId
        }
        const res = await userModel.removeUserAssociationInDB(caregiverId, recipientId)
        return res
    }

    getUsersAssociations = async (userId) => {
        const { roleId: userRoleId } = await userModel.getUserRoleByID(userId)

        if (userRoleId === CAREGIVER_ROLE) { // user is a caregiver
            return await userModel.getUsersCareRecipients(userId)
        } else { // user is a care recipient
            return await userModel.getUsersCareGivers(userId)
        }
    }

    getUserInfo = async (userId) => {
        const user = await userModel.getUserFromDBWithID(userId)
        return user
    }
}

module.exports = new UserService()