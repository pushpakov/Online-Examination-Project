const express = require('express');
const router = express.Router();
const { createAdmin, loginAdmin } = require('../controller/adminController');
const { createUser, loginUser } = require('../controller/userController');
const { createQues, updateQues } = require('../controller/questionController');
const { userAuth } = require('../middleware/userAuth');
const { adminAuth } = require('../middleware/adminAuth');
const { viewExam, ansQues } = require('../controller/examController');



//admin
router.post('/createAdmin', createAdmin);
router.post('/loginAdmin', loginAdmin);
router.post('/createQues/:adminId', adminAuth, createQues);
router.put('/updateQues/:adminId/:quesId', adminAuth, updateQues);

//user
router.post('/createUser', createUser);
router.post('/loginUser', loginUser);
router.get('/viewExam', userAuth, viewExam);
router.post('/ansQues/:quesId', userAuth, ansQues);



//----------------------------- For invalid end URL -----------------------------//

router.all('/**', function (_, res) {
    return res.status(400).send({ status: false, message: "Invalid http request" });
})

module.exports = router;