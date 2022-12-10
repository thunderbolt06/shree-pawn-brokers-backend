const express = require('express');
const { check } = require('express-validator');

const pawnsController = require('../controllers/pawns-controllers');

const router = express.Router();

// router.get('/', pawnsController.getpawns);

router.post(
  '/add',pawnsController.add
);

// router.post('/login', pawnsController.login);

module.exports = router;
