const express = require('express')
const router = express.Router()

const { addAssociation, removeAssociation, getUsersAssociations } = require('../controllers/user-controller')

router.route('/associations').get(getUsersAssociations).post(addAssociation).delete(removeAssociation)
// router.route('/associations').delete(removeAssociation)

module.exports = router