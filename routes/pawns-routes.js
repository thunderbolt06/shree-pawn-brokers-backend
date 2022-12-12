const express = require('express');
const { check } = require('express-validator');

const pawnsController = require('../controllers/pawns-controllers');

const router = express.Router();

router.get('/getall', pawnsController.getPawns);
router.get('/gettotalprincipal', pawnsController.getTotalPrincipal);
router.post('/getone', pawnsController.getOne);

router.post(
  '/add',pawnsController.addPawn
);


router.post(
  '/del',pawnsController.delPawn
);


// router.post('/login', pawnsController.login);

module.exports = router;
