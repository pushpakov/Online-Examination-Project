const jwt = require('jsonwebtoken');

let userAuth = async function (req, res, next) {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({ status: false, message: "login is required" });
        }
        let splitToken = token.split(" ");

        //----------------------------- Token Verification -----------------------------//
        jwt.verify(splitToken[1], "doneByStudent", (error, _) => {
            if (error) {   
                const message =
                    error.message === "jwt expired" ? "Token is expired, Please login again" : "Token is invalid, Please recheck your Token"
                return res.status(401).send({ status: false, message });
            }
            next();
        })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports = { userAuth }