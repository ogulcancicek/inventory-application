const express = require('express');
const router = express.Router();

const category_controller = require('../controllers/category');

router.get('', category_controller.category_list);

router.get('/create', category_controller.category_create_get);

router.post('/create', category_controller.category_create_post);

router.get('/delete/:id', category_controller.category_delete_get);

router.post('/delete/:id', category_controller.category_delete_post);

router.get('/update/:id', category_controller.category_update_get);

router.post('/update/:id', category_controller.category_update_post);

router.get('/:id', category_controller.category_detail);

module.exports = router;