const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const adminAuth = async function (req, res, next) {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({ status: false, message: "login is required" });
        }
        let splitToken = token.split(" ");
        let decodeToken = jwt.decode(splitToken[1]);

        let adminId = req.params.adminId;

        if (!mongoose.isValidObjectId(adminId)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid Admin Id" });
        }
        if (!decodeToken.hasOwnProperty('adminId') && adminId != decodeToken.adminId) {
            return res.status(403).send({ status: false, message: "only admin can do this" });
        }
        next();
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

module.exports = { adminAuth }