const express = require('express');
const { check } = require('express-validator');

const stockController = require('../controllers/stock-controllers');

const router = express.Router();

router.get('/getall', stockController.getStocks);
router.get('/gettotalprincipal', stockController.getTotalPrincipal);
router.post('/getone', stockController.getOne);

router.post(
  '/add',stockController.addStock
);


router.post(
  '/del',stockController.delStock
);
router.get(
    '/downloadstocks',stockController.downloadStocks
  );



module.exports = router;
