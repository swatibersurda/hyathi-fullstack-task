const express = require("express");
const userModel = require("../Model/user.model");
const pokemonModel = require("../Model/pokemon.model");
const app = express();
const bcryptjs = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const register = async (req, res) => {
  // first find if user is not already register.
  const existingUser = await userModel
    .findOne({ email: req.body.email })
    .lean()
    .exec();
  if (existingUser) {
    return res
      .status(500)
      .json({ message: "user is already register go login..." });
  }
  // hash password and store then whole user.
  // providing salt along it.
  const hashPassword = bcryptjs.hashSync(req.body.password, 10);
  try {
    const data = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      adoptionArray: [],
    });
    await data.save();
    return res
      .status(201)
      .json({ message: "user registred sucessfully...", data });
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
};
const login = async (req, res) => {
  // need to check if user is registred otherwise he/she can not login.
  const existingUser = await userModel
    .findOne({ email: req.body.email })
    .lean()
    .exec();
  if (!existingUser) {
    return res
      .status(500)
      .json({ message: "user is not registred login first" });
  }
  // comapare password.
  const checkPassword = bcryptjs.compareSync(
    req.body.password,
    existingUser.password
  );
  // means credentials enter are wrongg....
  if (!checkPassword) {
    return res
      .status(401)
      .json({ message: "email or password wrong enter correct credentials.." });
  }
  try {
    const token = jsonWebToken.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "14hrs" }
    );
    return res
      .status(201)
      .json({ message: "loggedin sucessfully", user: existingUser, token });
  } catch (err) {
    return res.status(500).json({ message: "internal server error..." });
  }
};

const getAllUser = async (req, res) => {
  try {
    const data = await userModel.find().lean().exec();
    return res.status(200).json({ message: "geted all data", data });
  } catch (err) {
    return res.status(500).json({ meassage: "internal server error..." });
  }
};
// this for geting indivisual user so that can show all adopted pokemon on feeding page.
const getUserById = async (req, res) => {
  try {
    console.log(req.params.id);
    const data = await userModel
      .findById(req.params.id)
      .populate("adoptionArray.pokemon");
    return res.status(200).json({ message: "geted id data", data });
  } catch (err) {
    return res.status(500).json({ meassage: "internal server error..." });
  }
};

const adoptionPokemon = async (req, res) => {
  console.log(req.body, "kkk");
  // first we will find the user
  let existingUser;
  try {
    existingUser = await userModel.findById(req.body.user_id);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "user not found" });
  }

  console.log(existingUser, "ggggg");
  let checkTwicePokemon;
  for (var i = 0; i < existingUser.adoptionArray.length; i++) {

    console.log(existingUser.adoptionArray[i].pokemon._id,"pppppppppppppp..........................");
    checkTwicePokemon = existingUser.adoptionArray[i].pokemon._id.equals(
      req.body.pokemon_id
    );
    console.log(checkTwicePokemon, "checkkkkknnh.");
    if (checkTwicePokemon) {
      return res
        .status(500)
        .json({ message: "simlar pokemon can be adopted once" });
    }
  }
  // else means not adopted once
  try {
    const pokemon = {
      // _id: req.body.pokemon_id,

      healthStatus: 1,
      pokemon: req.body.pokemon_id,
    };
    console.log("reaching here.......");

    existingUser.adoptionArray.push(pokemon);
    await existingUser.save();
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json(existingUser);
};

const feedPokemon = async (req, res) => {
  console.log(req.body, "i am bodyyy....");
  //need to find that user and then need to find the pokemon id
  // so that its healthStatus can be increment.
  // console.log(req.body,"i am req and bodyy...")

  // const tDB = await userModel.findOneAndUpdate(
  //   {
  //     _id:new  mongoose.Types.ObjectId(req.body.user_id),
  //   },
  //   { $set: { "adoptionArray.$.heathStatus": 2 } },
  //   { returnOriginal: false }
  // );
  let x = new mongoose.Types.ObjectId(req.body.pokemon_id);
  let y = new mongoose.Types.ObjectId(req.body.user_id);
  console.log(x, "i am pokemon idd...");

  // console.log(x,"sgsbvvbsvv....")

  // var xyyy=await userModel.updateOne(
  //   { "_id": x}
  //   ,
  //   { $set: { "adoptionArray[1].$.ex":23 } }
  // );

  // return res.status(200).json({xyyy})

  let existingUser;
  try {
    existingUser = await userModel.findById(req.body.user_id);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "user not found" });
  }
  console.log(existingUser,"existinguser...")
  // let pokeMonCheck=existingUser.adoptionArray.some(item=>item===req.body.pokemon_id);
  // console.log(pokeMonCheck,"founddd...")

  // need to find the pokemonfrom
  // the adoptionArray so that can update its healthStatus.
  let foundPokemonForFeeding;
  let found;
  for (var i = 0; i < existingUser.adoptionArray.length; i++) {
    found = existingUser.adoptionArray[i].equals(req.body.pokemon_id);
    // means found the pokemon whose healthStatus need to update.
    if (found) {
      foundPokemonForFeeding = i;
      break;
    }
  }

  // var test = await userModel
  //   .findByIdAndUpdate(
  //     // finding sub document
  //     { _id: req.body.user_id, "existingUser.adoptionArray[i].pokemon.bread":"Cosme" },
  //     {inc:{"existingUser.adoptionArray[i].$.healthStatus": 12 } },
  //     { upsert: true}
  //   )
  //   .populate("adoptionArray.pokemon");
  // console.log(test, "tttetett");
  // return res.status(201).json({ test });
  // var xyyy=await userModel.updateOne({_id:existingUser._id,"adoptionArray":req.body.pokemon_id},
  // {$set:{"existingUser.adoptionArray.$ age":1}},{ upsert: true })
  // await existingUser.save()
  var test = await userModel
    .findByIdAndUpdate(
      // finding sub document
      { _id: req.body.user_id, "existingUser.adoptionArray.pokemon":x},{inc:{"existingUser.adoptionArray.$ healthStatus":1}},{ upsert: true })
      await test.save()
      console.log(test,"jjgdfdfdf")
      return res.json({test})
};
module.exports = {
  register,
  login,
  getAllUser,
  getUserById,
  adoptionPokemon,
  feedPokemon,
};
