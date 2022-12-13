const express = require('express');
const { check } = require('express-validator');

const changelogController = require('../controllers/changelog-controllers');

const router = express.Router();

router.get('/getall', changelogController.getChangelog);
router.post('/getone', changelogController.getOne);

router.post('/getLogsByProduct', changelogController.getLogsByProduct);
router.post(
  '/add',changelogController.addChangelog
);

router.post(
  '/toggle',changelogController.toggleChangelog
);

router.post(
  '/del',changelogController.delChangelog
);



module.exports = router;
