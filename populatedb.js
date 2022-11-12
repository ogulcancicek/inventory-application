#! /usr/bin/env node

console.log('This script populates some test categories, and products to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Product = require('./models/product');
var Category = require('./models/category');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var products = []

function categoryCreate(name, cb) {
  categorydetail = {name:name}
  
  var category = new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function productCreate(name, description, img_url, quantity, price, category, cb) {
  productdetail = { 
    name: name,
    description: description,
    img_url: img_url,
    quantity: quantity,
    price: price,
    category: category,
  }
  if (category != false) productdetail.category = category
    
  var product = new Product(productdetail);    
  product.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Product: ' + product);
    products.push(product)
    cb(null, product)
  }  );
}


function createCategory(cb) {
    async.series([
        function(callback) {
          categoryCreate('Processor', callback);
        },
        function(callback) {
          categoryCreate('Memory', callback)
        },
        function(callback) {
          categoryCreate('Motherboard', callback)
        },
        function(callback) {
          categoryCreate('VideoCard', callback)
        },
        ],
        // optional callback
        cb);
}


function createProduct(cb) {
  async.series([
      function(callback) {
        productCreate('AMD Ryzen 5 5600X',
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam auctor mattis arcu, semper gravida risus vehicula vel. Mauris faucibus leo sapien, sed venenatis mauris congue eget. Mauris laoreet nec neque sed sollicitudin.',
                      'https://www.amd.com/system/files/2020-09/616656-amd-ryzen-5-5000-series-PIB-fan-1260x709.png',
                      12,
                      299.00,
                      categories[0],
                      callback,);
      },
      function(callback) {
        productCreate('AMD Ryzen 7 5800X',
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam auctor mattis arcu, semper gravida risus vehicula vel. Mauris faucibus leo sapien, sed venenatis mauris congue eget. Mauris laoreet nec neque sed sollicitudin.',
                      'https://www.amd.com/system/files/2020-09/616656-amd-ryzen-7-5000-series-PIB-1260x709_0.png',
                      12,
                      449.00,
                      categories[0],
                      callback,);
      },
      function(callback) {
        productCreate('Kingston HyperX Fury DDR4 16GB',
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam auctor mattis arcu, semper gravida risus vehicula vel. Mauris faucibus leo sapien, sed venenatis mauris congue eget. Mauris laoreet nec neque sed sollicitudin.',
                      'https://bilendenal.com/materials/images/products/products/1/1305/2665/kingston-hyperx-fury-8gb-ddr4-2400mhz-cl15-performans-rami-hx424c15fb28-s10-p5-1200x800-i2665.jpg',
                      12,
                      36.99,
                      categories[1],
                      callback);
      },
      function(callback) {
        productCreate('Asus ROG STRIX B450-F Gaming',
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam auctor mattis arcu, semper gravida risus vehicula vel. Mauris faucibus leo sapien, sed venenatis mauris congue eget. Mauris laoreet nec neque sed sollicitudin.',
                      'https://dlcdnwebimgs.asus.com/gain/6BDDB156-FB29-4D59-A48D-5D386A90D579/w717/h525',
                      12,
                      112.93,
                      categories[2],
                      callback,);
      },
      function(callback) {
        productCreate('NVIDIA GeForce RTX 3090',
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam auctor mattis arcu, semper gravida risus vehicula vel. Mauris faucibus leo sapien, sed venenatis mauris congue eget. Mauris laoreet nec neque sed sollicitudin.',
                      'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png',
                      12,
                      1499.99,
                      categories[3],
                      callback,);
      },
      ],
      // optional callback
      cb);
}



async.series([
  createCategory,
  createProduct,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Products: '+ products);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




