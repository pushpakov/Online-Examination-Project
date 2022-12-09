const adminModel = require('../model/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isValid, isValidBody, isValidEmail } = require('../validation/validator');



const createAdmin = async function (req, res) {
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
        const checkEmail = await adminModel.findOne({ email: email });
        if (checkEmail) return res.status(409).send({ status: false, message: "Email is already register" });

        //-----------Bcrypting Password -----------//
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        let adminCreated = await adminModel.create(data);
        return res.status(201).send({ status: true, message: "Admin created successfully", data: adminCreated });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}






const loginAdmin = async function (req, res) {
    try {
        const data = req.body;
        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Please Enter Login Credentials", });

        const { email, password } = data;
        if (!isValid(email)) return res.status(400).send({ status: false, message: "Please Enter Email" });
        if (!isValid(password)) return res.status(400).send({ status: false, message: "Please Enter Password" });


        //----------------------------- Checking Credential -----------------------------//
        const findAdmin = await adminModel.findOne({ email: email })
        if (findAdmin) {
            const validPassword = await bcrypt.compare(password, findAdmin.password);
            if (!validPassword) {
                return res.status(401).send({ status: false, message: "Invalid Password Credential" });
            }
        }
        else {
            return res.status(401).send({ status: false, message: "Invalid email Credential" });
        }

        let token = jwt.sign({
            adminId: findAdmin._id.toString(),
            project: "onlineExam",
            type: "admin"
        }, "doneByAdmin");

        res.setHeader("Authorization", token);
        return res.status(200).send({ status: true, message: "Admin login successfull", token: token});
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};




module.exports = { createAdmin, loginAdmin }