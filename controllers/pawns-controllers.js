const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Pawn = require('../models/pawn');

const getPawns = async (req, res, next) => {
  let pawns;
  try {
    pawns = await Pawn.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching pawns failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({pawns: pawns.map(pawn => pawn.toObject({ getters: true }))});
};

const add = async (req, res, next) => {
  console.log("add func call");
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

  console.log(req.body);
  console.log(id);
  console.log(principal);

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

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingPawn;

  try {
    existingPawn = await Pawn.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingPawn || existingPawn.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({message: 'Logged in!'});
};

exports.getPawns = getPawns;
exports.add = add;
exports.login = login;
