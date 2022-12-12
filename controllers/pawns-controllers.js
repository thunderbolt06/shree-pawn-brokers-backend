const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Pawn = require('../models/pawn');

const getPawns = async (req, res, next) => {
  let pawns;
  try {
    pawns = await Pawn.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching pawns failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({pawns: pawns.map(pawn => pawn.toObject({ getters: true }))});
};
const getOne = async (req, res, next) => {
  let pawn;
  const {id} = req.body;
  try {
    pawn = await Pawn.findOne({id: id});
  } catch (err) {
    const error = new HttpError(
      'Fetching pawns failed, please try again later.',
      500
    );
    return next(error);
  }

  if(pawn) {
    console.log("pawn found");
    console.log(pawn);
    res.json({pawn});
  }
  else {

    const error = new HttpError(
      'Pawn doesn\'t exist already, please try again.',
      404
    );
    return next(error);
  }
};

const delPawn = async (req,res, next) => {
  let pawn;
  let {id} = req.body;
  try {
    pawn = await Pawn.findOne({id: id});
  } catch (err) {
    const error = new HttpError(
      'Fetching pawns failed, please try again later.',
      500
    );
    return next(error);
  }
  if(!pawn) {

    const error = new HttpError(
      'Pawn doesn\'t exist already, please try again.',
      404
    );
    return next(error);
  }

  try {
    await pawn.delete();
  } catch (err) {
    
    const error = new HttpError(
      'Delete failed. please try again',
      401
    );
    return next(error);
  }
  res.json({"yes": "Pawn delete successfully"});

}
const getTotalPrincipal = async (req, res, next) => {
  let total;
  console.log("get total principal");
  try {
    total = await Pawn.aggregate([
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
      'Fetching pawns failed, please try again later.',
      500
    );
    return next(error);
  }

  console.log("total");
  console.log(total);
  res.json({"total": total[0].count});
}

const addPawn = async (req, res, next) => {
  console.log("addPawn func call");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { id,
    principal,
    insertDate,
    weight } = req.body;

  // console.log(req.body);
  // console.log(id);
  // console.log(principal);

  let existingPawn
  try {
    existingPawn = await Pawn.findOne({ id: id })
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  
  if (existingPawn) {
    await existingPawn.delete();
    // const error = new HttpError(
    //   'Pawn exists already, please login instead.',
    //   422
    // );
    // return next(error);
  }
  
  const createdPawn = new Pawn({
    id,
principal,
insertDate,
weight
  });

  try {
    await createdPawn.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({pawn: createdPawn.toObject({ getters: true })});
};

exports.getPawns = getPawns;
exports.addPawn = addPawn;

exports.getOne = getOne;
exports.delPawn = delPawn;
exports.getTotalPrincipal = getTotalPrincipal;
