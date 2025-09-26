const pool = require('../utils/db')
const { ConflictError, NotFoundError } = require('../errors')
const { DB_DUP_ENTRY } = require('../constants/error-messages')
const { toNodeFields } = require('../utils/field-mapper')

class UserModel {

    addUserToDB = async (email, hashedPassword, roleId, name) => {
        try {
            const user = await pool.query('INSERT INTO users (email, password_hash, role_id, name) VALUES ($1, $2, $3, $4) RETURNING *', [email, hashedPassword, roleId, name])
            if (user.rows.length === 0) {
                throw new Error('User could not be created, try again later')
            }
            return toNodeFields(user.rows[0])
        } catch (err) {
            if (err.code === DB_DUP_ENTRY) {
                throw new ConflictError('email already exists')
            }
            throw err
        }

    }

    getUserFromDBWithID = async (userId) => {
        const user = await pool.query('SELECT * FROM users WHERE user_id = ($1)', [userId])
        if (user.rows.length === 0) {
            throw new NotFoundError('User was not found')
        }
        return toNodeFields(user.rows[0])
    }

    getUserFromDBWithEmail = async (email) => {
        const user = await pool.query('SELECT * FROM users WHERE email = ($1)', [email])
        if (user.rows.length === 0) {
            throw new NotFoundError('User was not found')
        }
        return toNodeFields(user.rows[0])
    }

    getUserRoleByID = async (userId) => {
        const userRole = await pool.query('SELECT role_id FROM users where user_id = ($1)', [userId])
        if (userRole.rows.length === 0) {
            throw new NotFoundError('User was not found')
        }
        
        return toNodeFields(userRole.rows[0])
    }

    addUserAssociationToDB = async (caregiverId, recipientId) => {

        try {
            const association = await pool.query('INSERT INTO user_associations (caregiver_id, care_recipient_id) VALUES ($1, $2) RETURNING *', [caregiverId, recipientId])
            if (association.rows.length === 0) {
                throw new Error('User association could not be created, try again later')
            }
            return toNodeFields(association.rows[0])

        } catch (err) {
            if (err.code === DB_DUP_ENTRY) {
                throw new ConflictError('user association already exists')
            }
            throw err
        }
    }

    removeUserAssociationInDB = async(caregiverId, recipientId) => {
        const association = await pool.query('DELETE FROM user_associations WHERE caregiver_id = ($1) AND care_recipient_id = ($2) RETURNING *', [caregiverId, recipientId])
        if (association.rows.length === 0) {
            throw new NotFoundError('care giver id or recipient id was not found')
        }
        return toNodeFields(association.rows[0])
    }
    
    
    getUsersCareRecipients = async(userId) => {
        // retrieve all care recipients for this user
        const associations = await pool.query('SELECT u.user_id, u.email, u.role_id, u.name FROM users u JOIN user_associations ua on u.user_id = ua.care_recipient_id WHERE ua.caregiver_id = ($1)', [userId])
        const formattedData = []
        for (let association of associations.rows) {
            formattedData.push(toNodeFields(association))
        }
        return formattedData

    }

    getUsersCareGivers = async(userId) => {
        const associations = await pool.query ('SELECT u.user_id, u.email, u.role_id, u.name FROM users u JOIN user_associations ua on u.user_id = ua.caregiver_id WHERE ua.care_recipient_id = ($1)', [userId])
        const formattedData = []
        for (let association of associations.rows) {
            formattedData.push(toNodeFields(association))
        }
        return formattedData
    }

}

module.exports = new UserModel()