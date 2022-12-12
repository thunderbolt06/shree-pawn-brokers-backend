const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Stock = require('../models/stock');

const getStocks = async (req, res, next) => {
  let stocks;
  try {
    stocks = await Stock.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching stocks failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({stocks: stocks.map(stock => stock.toObject({ getters: true }))});
};
const getOne = async (req, res, next) => {
  let stock;
  const {product} = req.body;
  try {
    stock = await Stock.findOne({product: product});
  } catch (err) {
    const error = new HttpError(
      'Fetching stocks failed, please try again later.',
      500
    );
    return next(error);
  }

  if(stock) {
    console.log("stock found");
    console.log(stock);
    res.json({stock});
  }
  else {

    const error = new HttpError(
      'Stock doesn\'t exist already, please try again.',
      404
    );
    return next(error);
  }
};

const delStock = async (req,res, next) => {
  let stock;
  let {product} = req.body;
  try {
    stock = await Stock.findOne({product: product});
  } catch (err) {
    const error = new HttpError(
      'Fetching stocks failed, please try again later.',
      500
    );
    return next(error);
  }
  if(!stock) {

    const error = new HttpError(
      'Stock doesn\'t exist already, please try again.',
      404
    );
    return next(error);
  }

  try {
    await stock.delete();
  } catch (err) {
    
    const error = new HttpError(
      'Delete failed. please try again',
      401
    );
    return next(error);
  }
  res.json({"yes": "Stock delete successfully"});

}
const getTotalPrincipal = async (req, res, next) => {
  let total;
  console.log("get total principal");
  try {
    total = await Stock.aggregate([
      {
        $group: {
          // Each `_id` must be unique, so if there are multiple
          // documents with the same age, MongoDB will increment `count`.
          _id: '1',
          count: { $sum: '$principal' }
        }
      }
    ]);
  } catch (err) {
    const error = new HttpError(
      'Fetching stocks failed, please try again later.',
      500
    );
    return next(error);
  }

  console.log("total");
  console.log(total);
  res.json({"total": total[0].count});
}

const addStock = async (req, res, next) => {
  console.log("addStock func call");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { product, quantity} = req.body;

  // console.log(req.body);
  // console.log(product);
  
  console.log(`checking stock ${product} of ${quantity}`);
  
  // console.log(principal);

  let existingStock
  try {
    existingStock = await Stock.findOne({ product: product})
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  
  if (existingStock) {
    console.log("deleting existing");
    await existingStock.delete();
    // const error = new HttpError(
    //   'Stock exists already, please login instead.',
    //   422
    // );
    // return next(error);
  }
  
  const createdStock = new Stock({product, quantity});

  try {
    console.log("adding new");

    console.log(`added stock ${product} of ${quantity}`);
    await createdStock.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({stock: createdStock.toObject({ getters: true })});
};

exports.getStocks = getStocks;
exports.addStock = addStock;

exports.getOne = getOne;
exports.delStock = delStock;
exports.getTotalPrincipal = getTotalPrincipal;
