const express = require('express');
const router = express.Router();
const pokemonController = require('../controller/pokemonController');

router.get('/pokemons', pokemonController.getPokemons);

module.exports = router;
