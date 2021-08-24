const router = require('express').Router()
const gameController = require('../controllers/gameController')
const { auth } = require("../utils/authMiddleware");

router.route('/game/:gameId').get(gameController.showOne);
router.route('/score/roundScore').post(gameController.addScore);



module.exports = router;