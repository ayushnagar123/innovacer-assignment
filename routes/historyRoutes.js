var express = require('express');
var router = express.Router();
var historyController = require('../controllers/historyController.js');

/*
 * GET
 */
router.get('/', historyController.list);

/*
 * GET
 */
router.get('/:id', historyController.show);

/*
 * POST
 */
router.post('/', historyController.create);

module.exports = router;
