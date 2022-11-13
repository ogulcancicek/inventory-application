const Product = require('../models/product');
const Category = require('../models/category');
const async = require('async');

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