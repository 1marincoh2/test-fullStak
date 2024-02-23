// backend/controllers/pokemonController.js
const axios = require('axios');

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

exports.getPokemons = async (req, res) => {
  try {
    console.log(req.query,'query')
    const { limit = 20, page = 1, search } = req.query;


       // Verificar si los datos son paginables
       if (isNaN(parseInt(limit)) || isNaN(parseInt(page))) {
        return res.status(400).json({ message: 'Bad Request: Invalid limit or page value' });
      }
  

    // Calculamos el offset para la paginación
    const offset = (page - 1) * limit;
    
    // Construimos la URL de la solicitud a la PokeAPI
    let url = `${POKEAPI_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;

    // Agregamos el parámetro de búsqueda si está presente
    if (search) {
      url = `${POKEAPI_BASE_URL}/pokemon/${search}`;
    }

    // Realizamos la solicitud a la PokeAPI
    const response = await axios.get(url);

    // Obtenemos la lista de pokemons desde la respuesta
    const pokemons = response.data.results;
    const pokemonsList = await Promise.all(
        pokemons.map(async (pokemon) => {
          const pokemonResponse = await axios.get(pokemon.url);
          return {
            name: pokemon.name,
            abilities: pokemonResponse.data.abilities,
            image:pokemonResponse.data.sprites.other.dream_world.front_default  
          };
        })
      );
  
    // Ordenamos alfabéticamente los pokemons
    pokemonsList.sort((a, b) => a.name.localeCompare(b.name));

    const totalPokemons = response.data.count;
    const totalPages = Math.ceil(totalPokemons / limit);
  
   // Devolvemos la lista de pokemons ordenada como respuesta
    res.json({pokemonsList,totalPages, currentPage: parseInt(page)});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
