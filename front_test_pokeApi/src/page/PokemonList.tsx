import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import CircularProgress from "@mui/material/CircularProgress";

import url from "../service/apiService";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PokemonList = () => {
  interface Ability {
    name: string;
    url: string;
  }

  interface AbilityData {
    ability: Ability;
    is_hidden: boolean;
    slot: number;
  }

  interface Pokemon {
    name: string;
    abilities: AbilityData[];
    image: string;
  }

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPageOptions] = useState([10, 20, 40, 50, 100, 200]);
  const [selectedPerPage, setSelectedPerPage] = useState(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const [generatingPDF, setGeneratingPDF] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePerPageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedPerPage(event.target.value as number);
    setCurrentPage(1);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== "") {
      getPokemons();
      setSearchClicked(true);
    }
  };

  const getPokemons = async () => {
    setLoading(true);

    const response = await url
      .get(
        `pokemons?limit=${selectedPerPage}&page=${currentPage}&search=${searchTerm}`
      )
      .then((response) => response)
      .catch((error) => {
        console.error("Error fetching pokemons:", error);
      });

    setLoading(false);

    console.log(response?.data?.pokemonsList, "response");
    const pokemon = response?.data?.pokemonsList || [];
    setPokemons(pokemon);

    const totalPagesHeader = response?.data?.totalPages;
    setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 0);
  };

  const generatePDF = async () => {
    setGeneratingPDF(true); // Cambiar el estado a true antes de comenzar la generación del PDF

    const fetchSvgAsSvgString = async (url: string) => {
      try {
        const response = await fetch(url);
        let svgText = await response.text();
        svgText = svgText.replace(/<\?xml.*\?>/g, "");
        svgText = svgText.replace(/^[^<]+/, "");
        svgText = `${svgText}`;

        return svgText;
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    };
    const updatedPokemons = await Promise.all(
      pokemons.map(async (pokemon) => {
        const svgString = await fetchSvgAsSvgString(pokemon.image);

        return { ...pokemon, image: svgString };
      })
    );

    const docDefinition = {
      content: [
        { text: "Lista de Pokemons", style: "title", alignment: "center" },
        { text: "\n\n" },
        {
          style: "tableExample",
          table: {
            widths: ["auto", "auto", "*"],
            body: [
              [
                { text: "Nombre", style: "tableHeader", alignment: "center" },
                { text: "Imagen", style: "tableHeader", alignment: "center" },
                { text: "Habilidad", style: "tableHeader", alignment: "center" },
              ],

              ...updatedPokemons.map((pokemon) => {
                return [
                  { text: pokemon.name, style: "subheader" },
                  { svg: pokemon.image, width: 83 },
                  {
                    ul: pokemon.abilities.map((abilityData) => (
                      `- Ability: ${abilityData.ability.name}, Hidden: ${
                        abilityData.is_hidden ? "Yes" : "No"
                      }`
                    )),
                  },
                ];
              }),
            ],
          },
        },
      ],
      styles: {
        title: {
          fontSize: 25,
          bold: true,
          alignment: "center",
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 18,
          color: "black",
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("lista_pokemons.pdf");
    setGeneratingPDF(false);
  };

  useEffect(() => {
    if (searchTerm === "" && searchClicked === true) {
      getPokemons();
      setSearchClicked(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    getPokemons();
  }, [currentPage]);

  useEffect(() => {
    getPokemons();
  }, [currentPage, selectedPerPage]);

  return (
    <Container maxWidth="lg">

    <Grid container spacing={2}>
    <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4">Lista de Pokemons</Typography>
        
          <Box sx={{ display: "flex" }}>
            <TextField
              placeholder="buscar..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchClick}
              style={{ marginLeft: "10px" }} // Ajusta el espaciado entre el TextField y el botón
            >
              <SearchIcon />
            </Button>
            <Button
            variant="contained"
            color="primary"
            onClick={generatePDF}
            style={{ marginLeft: "10px" ,width:'50%'}} // Ajusta el espaciado entre el TextField y el botón

          >
            {generatingPDF ? (
              <CircularProgress
                size={25}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: -12,
                  marginLeft: -12,
                  color: "white",
                }}
              />
            ) : (
              "Descargar PDF"
            )}
          </Button>
          </Box>
        </Box>
     
        {loading && <LinearProgress />}
      </Grid>

 
      <Grid item xs={12}>
        {loading && (
          <Grid container spacing={2}>
            {Array.from(Array(selectedPerPage)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    width: 345,
                    height: "100%",
                    marginRight: 0.5,
                    my: 5,
                  }}
                >
                  <Skeleton variant="rectangular" width={345} height={130} />
                  <Box sx={{ pr: 2, pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Mostrar la lista de Pokémon cuando no está cargando */}
        {!loading && (
          <>
            {pokemons.length === 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  sx={{
                    maxWidth: 345,
                    height: '100%',
                    border: '2px solid green',
                    marginTop: '20px', // Ajusta el margen según sea necesario
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={pokemons[0].name}
                    height="130"
                    sx={{ objectFit: "contain", marginTop: "10px" }}
                    src={pokemons[0].image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {pokemons[0].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <ul>
                        {pokemons[0].abilities.map((abilityData, abilityIndex) => (
                          <li key={abilityIndex}>
                            Ability: {abilityData.ability.name}, Hidden:{" "}
                            {abilityData.is_hidden ? "Yes" : "No"}
                          </li>
                        ))}
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}

            {pokemons.length > 1 && (
              <Grid container spacing={2}>
                {pokemons.map((pokemon, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        maxWidth: 345,
                        height: "100%",
                        border: "2px solid green",
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt={pokemon.name}
                        height="130"
                        sx={{ objectFit: "contain", marginTop: "10px" }}
                        src={pokemon.image}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {pokemon.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <ul>
                            {pokemon.abilities.map(
                              (abilityData, abilityIndex) => (
                                <li key={abilityIndex}>
                                  Ability: {abilityData.ability.name}, Hidden:{" "}
                                  {abilityData.is_hidden ? "Yes" : "No"}
                                </li>
                              )
                            )}
                          </ul>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Grid>

    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        bgcolor: "background.paper",
        p: 2,
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
      />
      {pokemons.length !== 1 ? (
        <Select
          value={selectedPerPage}
          onChange={handlePerPageChange}
          variant="outlined"
          sx={{ ml: 2 }}
        >
          {perPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ) : null}
    </Box>

</Container>

  );
};

export default PokemonList;
