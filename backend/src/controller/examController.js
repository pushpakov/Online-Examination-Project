const quesModel = require('../model/questionModel');
const { isValid, isValidObjectId } = require('../validation/validator');



const viewExam = async function (_, res) {
    try {
        let questions = await quesModel.aggregate([{ $sample: { size: 10 } }]);

        let ques = [];
        for (let i = 0; i < questions.length; i++) {
            ques.push({
                id: questions[i]._id,
                question: questions[i].question,
                option1: questions[i].option1,
                option2: questions[i].option2,
                option3: questions[i].option3,
                option4: questions[i].option4,
                quesImage: questions[i].quesImage,
                quesVideo: questions[i].quesVideo,
                equation: questions[i].equation
            });
        }
        return res.status(200).send({ status: true, message: "questions list", data: ques });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

const ansQues = async function (req, res) {
    try {
        let quesId = req.params.quesId;
        let yourAnswer = req.body.yourAnswer;

        let key = ["option1", "option2", "option3", "option4"];

        if (!isValidObjectId(quesId)) return res.status(400).send({ status: false, message: "Please Enter Valid question Id" });
        if (!isValid(yourAnswer)) return res.status(400).send({ status: false, message: "Please Enter Your Answer" });

        let findQues = await quesModel.findOne({ _id: quesId });
        if (!findQues) return res.status(404).send({ status: false, message: "question not found" });

        if (key.includes(yourAnswer)) {
            if (findQues.answer != findQues[yourAnswer]) {
                return res.status(200).send({ status: true, message: "your answer is not correct", yourAnswer: yourAnswer, correctAnswer: findQues.answer });
            }
        } else if (findQues.answer != yourAnswer) {
            return res.status(200).send({ status: true, message: "your answer is not correct", yourAnswer: yourAnswer, correctAnswer: findQues.answer });
        }
        return res.status(200).send({ status: true, message: "Congrats....!!! your answer is correct", yourAnswer: yourAnswer, correctAnswer: findQues.answer });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

module.exports = { viewExam, ansQues }