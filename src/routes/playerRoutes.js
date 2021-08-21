const router = require('express').Router()
const playerController = require('../controllers/playerController')
const { auth } = require("../utils/authMiddleware");

router.route('/signup').post(playerController.signup);

router.route('/signin').post(playerController.signin);

module.exports = router;