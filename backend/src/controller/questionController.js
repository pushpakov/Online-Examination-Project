const quesModel = require('../model/questionModel');
const upload = require('../.aws/config');
const { isValid, isValidBody, isValidObjectId } = require('../validation/validator');



const createQues = async function (req, res) {
    try {
        let files = req.files;
        let data = req.body;

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Please Enter Data" });

        let { question, option1, option2, option3, option4, answer } = data;

        if (!isValid(question)) return res.status(400).send({ status: false, message: "Please Enter question" });
        if (!isValid(option1)) return res.status(400).send({ status: false, message: "Please Enter option1" });
        if (!isValid(option2)) return res.status(400).send({ status: false, message: "Please Enter option2" });
        if (!isValid(option3)) return res.status(400).send({ status: false, message: "Please Enter option3" });
        if (!isValid(option4)) return res.status(400).send({ status: false, message: "Please Enter option4" });
        if (!isValid(answer)) return res.status(400).send({ status: false, message: "Please Enter answer" });

        let arr = (files.map(x => x.fieldname));

        if (arr.includes("quesImage")) {
            let index = arr.indexOf("quesImage");
            let uploadedFileURL = await upload.uploadFile(files[index]);
            data.quesImage = uploadedFileURL;
        }
        if (arr.includes("quesVideo")) {
            let index = arr.indexOf("quesVideo");
            let uploadedFileURL = await upload.uploadFile(files[index]);
            data.quesVideo = uploadedFileURL;
        }

        let quesCreated = await quesModel.create(data);
        return res.status(201).send({ status: true, message: "question created successfully", data: quesCreated });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}





const updateQues = async function (req, res) {
    try {
        let quesId = req.params.quesId;
        if (!isValidObjectId(quesId)) return res.status(400).send({ status: false, message: "Please Enter Valid question Id" });

        let findQues = await quesModel.findOne({ _id: quesId })
        if (!findQues) return res.status(404).send({ status: false, message: "question not found" });

        let files = req.files;
        let data = req.body;

        if (!isValidBody(data)) {
            if (!isValidBody(files)) {
                return res.status(400).send({ status: false, message: "Please Enter Data" });
            }
        }

        let arr = (files.map(x => x.fieldname));

        if (arr.includes("quesImage")) {
            let index = arr.indexOf("quesImage");
            let uploadedFileURL = await upload.uploadFile(files[index]);
            data.quesImage = uploadedFileURL;
        }
        if (arr.includes("quesVideo")) {
            let index = arr.indexOf("quesVideo");
            let uploadedFileURL = await upload.uploadFile(files[index]);
            data.quesVideo = uploadedFileURL;
        }

        let updateQue = await quesModel.findOneAndUpdate({ _id: quesId }, data, { new: true });
        return res.status(200).send({ status: true, message: "Question updated", data: updateQue });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};




module.exports = { createQues, updateQues }