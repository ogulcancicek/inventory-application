const Category = require('../models/category');
const Product = require('../models/product');
const async = require('async');

const { body, validationResult } = require('express-validator');

exports.category_list = (req, res, next) => {
    Category.find()
            .exec(function(err, list_categories) {
                if (err) return next(err);

                // Successful, so render
                res.render('category_main', {
                    title: 'Categories',
                    category_list: list_categories,
                });
            });
};

exports.category_detail = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.params.id).exec(callback);
            },
            products(callback) {
                Product.find({ category: req.params.id }, 'name img_url price').exec(callback);
            },
        },
        (err, results) => {
            if (err) return next(err); // Error in API usage

            if (results.category == null) {
                // No result
                const err = new Error('Category not found');
                err.status = 404;
                return next(err);
            }

            // Successful, so render
            res.render('category_detail', {
                title: `Category: ${results.category.name}`,
                category: results.category,
                products: results.products,
            });
        }
    );
};

exports.category_create_get = (req, res, next) => {
    res.render('category_form', { title: 'Create Category' });
};

exports.category_create_post = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 24 })
        .escape()
        .withMessage('Name must be specified.')
        .isAlphanumeric()
        .withMessage('Name has non-alphanumeric characters.'),
    
    // Process request after validation and sanitization.
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.redirect('category_form', {
                title: 'Craete Category',
                category: req.body,
                errors: errors.array(),
            });
            return;
        }

        const category = new Category({ name: req.body.name });

        category.save( (err) => {
            if (err) return next(err);

            res.redirect(category.url);
        })
    }
];


exports.category_delete_get = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.params.id).exec(callback);
            },
            products(callback) {
                Product.find({ category: req.params.id }).exec(callback);
            }
        },
        (err, results) => {
            if (err) return next(err);

            if (results.category == null) {
                const err = new Error('Category not found.');
                err.status = 404;
                return next(err);
            }

            res.render('category_delete', {
                title: 'Delete Category',
                category: results.category,
                products: results.products,
            });
        }
    )
};

exports.category_delete_post = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.params.id).exec(callback);
            },
            products(callback) {
                Product.find({ category: req.params.id }).exec(callback);
            }
        },
        (err, results) => {
            if (err) return next(err);

            if (results.products.length > 0) {
                // Category has products. Render in same way as GET route.
                res.render('category_delete', {
                    title: 'Delete Category',
                    category: results.category,
                    products: results.products,
                });
                return;
            }

            Category.findByIdAndRemove(req.params.id, (err) => {
                if (err) return next(err);

                // success - go to category list.
                res.redirect('/category');
            });
        }
    );
};

exports.category_update_get = (req, res, next) => {
    Category.findById(req.params.id).exec( (err, category) => {
        if (err) return next(err);

        if (category == null) {
            const err = new Error('Category not found.');
            err.status = 404;
            return next(err);
        }

        res.render('category_form', {
            title: `Update Category: ${category.name}`,
            category,
        });
    });
}

exports.category_update_post = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 24 })
        .escape()
        .withMessage('Name must be specified.')
        .isAlphanumeric()
        .withMessage('Name has non-alphanumeric characters.'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: `Update Category: ${category.name}`,
                category: req.body,
                errors: errors.array(),
            });
            return;
        }

        const newCategory = new Category({
            _id: req.params.id,
            name: req.body.name,
        });

        Category.findByIdAndUpdate(req.params.id, newCategory,  {}, (err, thecategory) => {
            if (err) return next(err);

            res.redirect(thecategory.url);
        });
    }
]