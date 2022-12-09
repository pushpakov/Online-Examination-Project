const mongoose = require('mongoose');

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidBody = function (value) {
    if (Object.keys(value).length == 0) return false;
    return true;
}

const isValidEmail = function (value) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) return false;
    return true;
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};

module.exports = { isValid, isValidBody, isValidObjectId, isValidEmail }