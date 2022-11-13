const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/product');

router.get('', product_controller.product_list);

router.get('/:id', product_controller.product_detail);

module.exports = router;