const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const TmpOrder = require('../models/tmpCart');
const Product = require('../models/product');

router.get('/', (req, res) => {
    TmpOrder.find().populate('products')
    .exec()
    .then(tmpOrder => {
      // return console.log(tmpOrder[0].products[0].id) /* get one data from products
      res.status(200).json({
        status : 200,
        message : 'Get data cart has been successfully',
        data: tmpOrder
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
})
router.get('/:id', (req, res) => {
    const id = req.params.id
    TmpOrder.findById(id).populate('products')
      .exec()
      .then(tmpOrder => {
        res.status(200).json({
          data: tmpOrder
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  })
router.get('/users/:id', (req, res) => {
  const id = req.params.id
  TmpOrder.findOne({userId: id}).populate('products')
    .exec()
    .then(tmpOrder => {
        Product.findById(tmpOrder.product)
        .exec()
        .then(result =>{
          tmpOrder.tmp_no_order = result
          res.status(200).json({
            data: tmpOrder,
            value: result
          })
        })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
})
router.post('/', (req, res) => {
    const tmpCart = new TmpOrder({
    _id: new mongoose.Types.ObjectId(),
    userId: req.body.userId,
    products: req.body.products,
    quantity: req.body.quantity,
    totalAmount: req.body.totalAmount
    });
    tmpCart
    .save()
    .then(result => {
      res.status(201).json({
        message: "success to insert data",
        created: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});
router.patch("/:id", (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.field] = ops.value;
    }
    TmpOrder.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    TmpOrder.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
module.exports = router;
