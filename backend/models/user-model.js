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

    addUserAssociationToDB = async (userId, recipientId) => {

        try {

            const association = await pool.query('INSERT INTO users_associations (caregiver_id, caregiver_recipient_id) VALUES ($1, $2) RETURNING *', [userId, recipientId])
            if (association.rows.length === 0) {
                throw new Error('User association could not be created, try again later')
            }
            return association

        } catch (err) {
            if (err.code === DB_DUP_ENTRY) {
                throw new ConflictError('user association already exists')
            }
            throw err
        }


    }

    // getUsersCaregiverRecipient = async() => {

    // }

}

module.exports = new UserModel()