const express = require('express');
const productController = require('../controllers/productController');
const Router = express.Router();


Router.route('/products')
    .post(productController.insertProduct)
    .get(productController.getAllProducts);
    
Router.route('/products/:id')
    .get(productController.getProductById);

Router.route('/products/:id/save')
    .put(productController.toggleSavedProduct);

Router.route('/users/:userId/saved-products')
    .get(productController.getSavedProducts);

Router.route('/products/with-saved')
    .get(productController.getAllProductsWithSavedFlag);

module.exports = Router;