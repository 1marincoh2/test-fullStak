const axios = require('axios');

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

exports.getPokemons = async (req, res) => {
    try {
      const { limit = 20, page = 1, search } = req.query;
  
      // Verificar si los datos son paginables
      if (isNaN(parseInt(limit)) || isNaN(parseInt(page))) {
        return res.status(400).json({ message: 'Bad Request: Invalid limit or page value' });
      }
  
      // Calculamos el offset para la paginación
      const offset = (page - 1) * limit;
      
      // Construimos la URL de la solicitud a la PokeAPI
      let url = `${POKEAPI_BASE_URL}/pokemon`;
  
      // Si se proporciona un parámetro de búsqueda (nombre o ID)
      if (search) {
        url += `/${search}`;
      } else {
        url += `?offset=${offset}&limit=${limit}`;
      }
  
      // Realizamos la solicitud a la PokeAPI
      const response = await axios.get(url);
  
      if (search) {
        // Si se realizó una búsqueda por nombre o ID
        const pokemon = response.data;
        console.log(pokemon,'search');
        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }
        const abilities =pokemon.abilities;
        const image = pokemon.sprites.other.dream_world.front_default !== null ?pokemon.sprites.other.dream_world.front_default:'https://vignette.wikia.nocookie.net/pokemon-fano/images/6/6f/Poke_Ball.png/revision/latest?cb=20140520015336';
  
        // Devolvemos la respuesta estructurada
        const pokemonsList = [{
            name: pokemon.name,
            abilities,
            image,  
        }]
        res.json({
            pokemonsList,
          totalPages: 1,
          currentPage: 1
        });
      } else {
        // Si se obtuvo una lista de pokémons
        const pokemons = response.data.results;
        const pokemonsList = await Promise.all(
          pokemons.map(async (pokemon) => {
            const pokemonResponse = await axios.get(pokemon.url);
            const abilities = pokemonResponse.data.abilities
            const image = pokemonResponse.data.sprites.other.dream_world.front_default !== null ?pokemonResponse.data.sprites.other.dream_world.front_default:'https://vignette.wikia.nocookie.net/pokemon-fano/images/6/6f/Poke_Ball.png/revision/latest?cb=20140520015336';
  
            return {
              name: pokemon.name,
              abilities,
              image
            };
          })
        );
  
        // Ordenamos alfabéticamente los pokémons
        pokemonsList.sort((a, b) => a.name.localeCompare(b.name));
  
        const totalPokemons = response.data.count;
        const totalPages = Math.ceil(totalPokemons / limit);
    
        // Devolvemos la misma estructura de respuesta para la lista de pokémons
        res.json({ pokemonsList, totalPages, currentPage: parseInt(page) });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  
  