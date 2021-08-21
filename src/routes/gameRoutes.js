const router = require('express').Router()
const gameController = require('../controllers/gameController')
const { auth } = require("../utils/authMiddleware");

router.route('/signup').post(gameController.showOne);



module.exports = router;