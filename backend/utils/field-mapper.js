const fieldMapping = {
    roleId: 'role_id',
    hashedPassword: 'password_hash',
    userId: 'user_id'

}

const toDbFields = (nodeObject) => {
    const dbObject = {}
    for (const [nodeField, nodeValue] of nodeObject) {
        if (nodeField in fieldMapping) {
            dbObject[fieldMapping[nodeField]] = nodeValue
        } else {
            dbObject[nodeField] = nodeValue
        }
    }
    return dbObject
}

const toNodeFields = (dbObject) => {
    console.log(dbObject)
    const nodeObject = {}
    const reverseMapping = {}

    for (const [fieldName, fieldValue] of Object.entries(fieldMapping)) {
        reverseMapping[fieldValue] = fieldName
    }

    for (const [dbField, dbValue] of Object.entries(dbObject)) {
        if (dbField in reverseMapping) {
            nodeObject[reverseMapping[dbField]] = dbValue
        } else {
            nodeObject[dbField] = dbValue
        }
    }
    return nodeObject

}

module.exports = { toDbFields, toNodeFields }