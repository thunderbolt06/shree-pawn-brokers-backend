const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Changelog = require('../models/changelog');

const getChangelog = async (req, res, next) => {
  let changelogs;
  try {
    changelogs = await Changelog.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching changelogs failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({changelogs: changelogs.map(changelog => changelog.toObject({ getters: true }))});
};
const getLogsByProduct = async (req, res, next) => {
    let changelogs;
    const {product} = req.body;
    try {
      changelogs = await Changelog.find({product: product});
    } catch (err) {
      const error = new HttpError(
        'Fetching changelogs failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if(changelogs) {
      console.log("changelog found");
      console.log(changelogs);
      res.json({changelogs: changelogs.map(changelog => changelog.toObject({ getters: true }))});
    }
    else {
  
      const error = new HttpError(
        'Changelog doesn\'t exist already, please try again.',
        404
      );
      return next(error);
    }
  };
const getOne = async (req, res, next) => {
  let changelog;
  const {time} = req.body;
  try {
    changelog = await Changelog.findOne({time: time});
  } catch (err) {
    const error = new HttpError(
      'Fetching changelogs failed, please try again later.',
      500
    );
    return next(error);
  }

  if(changelog) {
    console.log("changelog found");
    console.log(changelog);
    res.json({changelog});
  }
  else {

    const error = new HttpError(
      'Changelog doesn\'t exist already, please try again.',
      404
    );
    return next(error);
  }
};

const delChangelog = async (req,res, next) => {
  let changelog;
  let {time} = req.body;
  try {
    changelog = await Changelog.findOne({time: time});
  } catch (err) {
    const error = new HttpError(
      'Fetching changelogs failed, please try again later.',
      500
    );
    return next(error);
  }
  if(!changelog) {

    const error = new HttpError(
      'Changelog doesn\'t exist already, please try again.',
      404
    );
    return next(error);
  }

  try {
    await changelog.delete();
  } catch (err) {
    
    const error = new HttpError(
      'Delete failed. please try again',
      401
    );
    return next(error);
  }
  res.json({"yes": "Changelog delete successfully"});

}
const toggleChangelog = async (req, res, next) => {
  console.log("toggling change log");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const {time} = req.body;
  let existingChangelog;
  try {
    existingChangelog = await Changelog.findOne({ time: time})
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  if(!existingChangelog){

    const error = new HttpError(
      'Changelog doesn\'t exist already, please try again.',
      404
    );
    return next(error);
  }
  await existingChangelog.delete();

  let logObj = existingChangelog.toObject({getters:true});
  let newChangelog = new Changelog({time: logObj.time, product: logObj.product,operation:logObj.operation, oldValue: logObj.oldValue, changeValue: logObj.changeValue, crosschecked: !logObj.crosschecked});
  
  
  try {
    console.log("adding new");


    // console.log(`added changelog ${product} of ${quantity}`);
    await newChangelog.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  console.log("toggle successful");
  console.log(!logObj.crosschecked);

  res.status(201).json({changelog: newChangelog.toObject({ getters: true })});

}

const addChangelog = async (req, res, next) => {
  console.log("addChangelog func call");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { time, product, operation, changeValue, oldValue, crosschecked} = req.body;

  // console.log(req.body);
  // console.log(product);
  
  // console.log(`checking changelog ${product} of ${quantity}`);
  
  // console.log(principal);

  let existingChangelog;
  try {
    existingChangelog = await Changelog.findOne({ time: time})
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  
  if (existingChangelog) {
    console.log("deleting existing");
    await existingChangelog.delete();
    // const error = new HttpError(
    //   'Changelog exists already, please login instead.',
    //   422
    // );
    // return next(error);
  }
  
  const createdChangelog = new Changelog({time, product, operation, changeValue, oldValue, crosschecked});

  try {
    console.log("adding new");

    // console.log(`added changelog ${product} of ${quantity}`);
    await createdChangelog.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({changelog: createdChangelog.toObject({ getters: true })});
};

exports.getChangelog = getChangelog;
exports.addChangelog = addChangelog;

exports.getOne = getOne;
exports.getLogsByProduct = getLogsByProduct;
exports.delChangelog = delChangelog;
exports.toggleChangelog = toggleChangelog;

// exports.getTotalPrincipal = getTotalPrincipal;
