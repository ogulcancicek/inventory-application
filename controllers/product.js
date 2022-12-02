const Product = require('../models/product');
const Category = require('../models/category');
const async = require('async');

const {body, validationResult} = require('express-validator');

exports.product_list = (req, res, next) => {
    Product.find()
           .exec( function (err, products) {
                if (err) return next(err);

                res.render('product_main', {
                    title: 'Products',
                    products: products,
                });
            });
};

exports.product_detail = (req, res, next) => {
    Product.findById(req.params.id)
            .populate('category')
            .exec(function(err, product) {
                if (err) return next(err);

                if (product == null) {
                    const err = new Error('No product found.');
                    err.status = 404;
                    return next(err);
                }

                res.render('product_detail', {
                    title: `Product: ${product.name}`,
                    product: product,
                    category: product.category[0],
                });
            });
}

exports.product_create_get = (req, res, next) => {
    Category.find()
        .exec( function(err, categories) {
            if (err) return next(err);

            res.render('product_form', {
                title: 'Create New Product',
                category_list: categories,
            })
        })
}

exports.product_create_post = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 64 })
        .escape()
        .withMessage('Name must be specified')
        .isAlphanumeric()
        .withMessage('Name has non-alphanumeric characters'),
    body('description')
        .trim()
        .isLength({ min: 16, max: 240 })
        .escape()
        .withMessage('Product description must be specified.'),
    body('quantity')
        .trim()
        .escape(),
    body('price')
        .trim()
        .escape(),
    body('category', 'Category must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            Category.find().exec( (err, categories) => {
                if (err) return next(err);

                res.render('product_form', {
                    title: 'Create new product',
                    category_list: categories,
                    name: req.body.name,
                    description: req.body.description,
                    imgUrl: req.body.imgUrl,
                });
            });
        };

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            img_url: req.body.imgUrl,
            quantity: req.body.quantity,
            price: req.body.price,
            category: req.body.category,
        });

        product.save( (err) => {
            if (err) return next(err);

            res.redirect(product.url);
        });
    }
];

exports.product_delete_get = (req, res, next) => {
    Product.findById(req.params.id).exec( (err, product) => {
        if (err) return next(err);

        if (product == null) {
            const err = new Error('Product not found.');
            err.status = 404;
            return next(err);
        }

        res.render('product_delete', {
            title: 'Delete Product',
            product: product,
        })
    })
}

exports.product_delete_post = (req, res, next) => {
    Product.findById(req.params.id).exec((err, product) => {
        if (err) return next(err);

        Product.findByIdAndRemove(req.params.id, (err) => {
            if (err) return next(err);

            res.redirect('/products');
        })
    })
}

exports.product_update_get = (req, res, next) => {
    async.parallel(
        {
            product(callback) {
                Product.findById(req.params.id).exec(callback);
            },
            categories(callback) {
                Category.find().exec(callback);
            }
        },
        (err, results) => {
            if (err) return next(err);

            if (results.product == null) {
                const err = new Error('Product not found.');
                err.status = 404;
                return next(err);
            }

            res.render('product_form', {
                title: `Update Product: ${results.product.name}`,
                product: results.product,
                category_list: results.categories,
            });
        }
    );
};

exports.product_update_post = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 64 })
        .escape()
        .withMessage('Name must be specified'),
    body('description', 'Product description must be specified.')
        .trim()
        .isLength({ min: 16, max: 240 })
        .escape(),
    body('quantity', 'Quantity must be specified.')
        .trim()
        .escape(),
    body('price', 'Price must be specified.')
        .trim()
        .escape(),
    body('category', 'Category must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const newProduct = new Product({
            _id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            img_url: req.body.imgUrl,
            quantity: req.body.quantity,
            price: req.body.price,
            category: req.body.category,
        });

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    product(callback) {
                        Product.findById(req.params.id).exec(callback);
                    },
                    categories(callback) {
                        Category.find().exec(callback);
                    },
                },
                (err, results) => {
                    if (err) return next(err);

                    if (results.product == null) {
                        const err = new Error('Product not found.');
                        err.status = 404;
                        return next(err);
                    }

                    res.render('product_form', {
                        title: `Update Product: ${results.product.name}`,
                        product: results.product,
                        category_list: results.categories,
                    });
                }
            );
        };

        Product.findByIdAndUpdate(req.params.id, newProduct, {}, (err, theProduct) => {
            if (err) return next(err);

            res.redirect(theProduct.url);
        })
    }
    
]