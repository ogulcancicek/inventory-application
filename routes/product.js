const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/product');

router.get('', product_controller.product_list);

router.get('/create', product_controller.product_create_get);

router.post('/create', product_controller.product_create_post);

router.get('/delete/:id', product_controller.product_delete_get);

router.post('/delete/:id', product_controller.product_delete_post);

router.get('/update/:id', product_controller.product_update_get);

router.post('/update/:id', product_controller.product_update_post);

router.get('/:id', product_controller.product_detail);

module.exports = router;