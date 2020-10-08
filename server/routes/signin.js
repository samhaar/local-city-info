const express = require('express');
const oAuthController = require('../controllers/oAuthController');
const userFavoritesController = require('../controllers/userFavoritesController');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.post('/',
  oAuthController.verifyToken,
  userFavoritesController.addUser,
  sessionController.setJWT,
  (req, res) => {
    res.status(200).json({authorized: res.locals.oAuth});
  });

module.exports = router;