const express = require("express");
const pokeMonRouter = express.Router();
const pokeMonModel = require("../Model/pokemon.model");
const userModel = require("../Model/user.model");
const pokemonModel = require("../Model/pokemon.model");
pokeMonRouter.get("/", async (req, res) => {
  try {
    const data = await pokeMonModel.find().lean().exec();
    return res.status(200).json({ pokemons: data });
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
});
// this posting so that can add pokemon to the user who has adopted or inside adoptionArray
pokeMonRouter.post("/", async (req, res) => {
  console.log(req.body.pokemon_id, "kkk");
  // first we will find the user
  let existingUser;
  try {
    existingUser = await userModel.findById(req.body.user_id);
    //  console.log(existingUser,"existinguserr")
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "user not found" });
  }
  let checkTwicePokemon;
  for (var i = 0; i < existingUser.adoptionArray.length; i++) {
    checkTwicePokemon = existingUser.adoptionArray[i].equals(
      req.body.pokemon_id
    );
    if (checkTwicePokemon) {
      return res
        .status(500)
        .json({ message: "only single adoption is allowed" });
    }
  }
  try {
    const pokemon = {
      _id: req.body.pokemon_id,
    };
    console.log("reaching here.......");
    existingUser.adoptionArray.push(pokemon);
    await existingUser.save();
  } catch (err) {
    return console.log(err);
  }
  return res.status(201).json(existingUser);
});
module.exports = pokeMonRouter;
