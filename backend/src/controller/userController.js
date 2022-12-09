const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isValid, isValidBody, isValidEmail } = require('../validation/validator');




const createUser = async function (req, res) {
    try {
        let data = req.body;
        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Please Enter Data" });

        let { name, email, password } = data;

        if (!isValid(name)) return res.status(400).send({ status: false, message: "Please Enter Name" });

        if (!isValid(email)) return res.status(400).send({ status: false, message: "Please Enter Email" });
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Email should be valid" });

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Please Enter Password" });
        if (password.length < 8 || password.length > 15) return res.status(400).send({ status: false, message: "password length should be in the range of 8 to 15 only", });

        //----------------------------- Checking Duplicate Email -----------------------------//
        const checkEmail = await userModel.findOne({ email: email });
        if (checkEmail) return res.status(409).send({ status: false, message: "Email is already register" });

        //-----------Bcrypting Password -----------//
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        let userCreated = await userModel.create(data);
        return res.status(201).send({ status: true, message: "User created successfully", data: userCreated });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}





const loginUser = async function (req, res) {
    try {
        const data = req.body;
        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Please Enter Login Credentials", });

        const { email, password } = data;
        if (!isValid(email)) return res.status(400).send({ status: false, message: "Please Enter Email" });
        if (!isValid(password)) return res.status(400).send({ status: false, message: "Please Enter Password" });

        //----------------------------- Checking Credential -----------------------------//
        const findUser = await userModel.findOne({ email: email });
        if (findUser) {
            const validPassword = await bcrypt.compare(password, findUser.password);
            if (!validPassword) {
                return res.status(401).send({ status: false, message: "Invalid Password Credential" });
            }
        }
        else {
            return res.status(401).send({ status: false, message: "Invalid email Credential" });
        }

        let token = jwt.sign({
            userId: findUser._id.toString(),
            project: "onlineExam",
            type:"user"
        }, "doneByStudent");

        res.setHeader("Authorization", token);
        return res.status(200).send({ status: true, message: "User login successfull", token: token, data: findUser });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};




module.exports = { createUser, loginUser }