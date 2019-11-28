var express = require('express');
var router = express.Router();
var visitorController = require('../controllers/visitorController.js');

/*
 * GET
 */
router.get('/', visitorController.list);

/*
 * GET
 */
router.get('/:id', visitorController.show);

/*
 * POST
 */
router.post('/', visitorController.create);

/*
 * PUT
 */
router.put('/:id', visitorController.update);

/*
 * DELETE
 */
router.get('/delete/:name', visitorController.remove);

module.exports = router;
