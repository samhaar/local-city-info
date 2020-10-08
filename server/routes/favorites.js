const express = require('express');
const userFavoritesController = require('../controllers/userFavoritesController');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.get('/',
  sessionController.validateSession,
  userFavoritesController.getFavorites,
  (req, res) => {
    return res.status(200).json(res.locals.favoriteBusinesses);
  },
);

router.post('/',
  sessionController.validateSession,
  userFavoritesController.setFavorite,
  (req, res) => {
    res.sendStatus(200);
  });

router.delete('/',
  sessionController.validateSession,
  userFavoritesController.deleteFavorite,
  (req, res) => {
    res.sendStatus(200);
  });

module.exports = router;
