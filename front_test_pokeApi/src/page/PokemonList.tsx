import React, { useState, useEffect,useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";


import url from "../service/apiService";

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
  const componentRef = useRef(null);

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPageOptions] = useState([10, 20, 40, 50, 100, 200]); // Opciones de cantidad por página
  const [selectedPerPage, setSelectedPerPage] = useState(20); // Cantidad seleccionada por página
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPerPage(event.target.value as number);
    setCurrentPage(1); // Reinicia la página al cambiar la cantidad por página
  };

  const getPokemos = async () => {
    setLoading(true); // Mostrar indicador de progreso

    const response = await url
      .get(
        `pokemons?limit=${selectedPerPage}&page=${currentPage}&search=${searchTerm}`
      )
      .then((response) => response)
      .catch((error) => {
        console.error("Error fetching pokemons:", error);
      });

    setLoading(false); // Ocultar indicador de progreso

    console.log(response?.data?.pokemonsList, "response");
    const pokemon = response?.data?.pokemonsList || [];
    setPokemons(pokemon);

    const totalPagesHeader = response?.data?.totalPages;
    setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 0);
  };

  useEffect(() => {
    getPokemos();
  }, [currentPage, searchTerm, selectedPerPage]); // Se ejecutará cada vez que currentPage, searchTerm o selectedPerPage cambien

  useEffect(() => {
    // Si searchTerm está vacío, recargar la vista
    if (searchTerm === "") {
      getPokemos();
    }
  }, [searchTerm]); // Se ejecutará cuando searchTerm cambie

  // const handleDownloadPDF = () => {
  //   const imgWidth = 100; // Ajusta el ancho de la imagen según tu preferencia
  //   const imgHeight = 40; // Ajusta el alto de la imagen según tu preferencia
  
  //   // Set up the table
  //   const columns = ["Nombre", "Imagen", "Habilidades"];
  //   const rows = pokemons.map(({ name, image, abilities }) => [
  //     name,
  //     image, // Cambiando a solo la URL de la imagen
  //     abilities.map(({ ability }) => ability.name).join(", "),
  //   ]);
  
  //   // Add a new page for the table
  //   const pdf = new jsPDF();
  //   pdf.autoTable({
  //     head: [columns],
  //     body: rows,
  //     columnStyles: {
  //       1: { // La columna de las imágenes
  //         cellWidth: imgWidth,
  //         valign: 'middle',
  //         halign: 'center',
  //         // Utilizamos una función de renderizado personalizada para insertar la imagen
  //         render: (cellData) => {
  //           const img = new Image();
  //           img.src = cellData.row.raw[1]; // Obtenemos la URL de la imagen
  //           pdf.addImage(img, 'JPEG', cellData.cell.x, cellData.cell.y, imgWidth, imgHeight);
  //         }
  //       }
  //     }
  //   });
  
  //   // Save the PDF
  //   pdf.save("pokemon_list.pdf");
  // };
  
  const handleDownloadPDF = () => {
    const imgWidth = 100; // Ajusta el ancho de la imagen según tu preferencia
    const imgHeight = 40; // Ajusta el alto de la imagen según tu preferencia
  
    // Set up the table
    const columns = ["Nombre", "Imagen", "Habilidades"];
    const rows = pokemons.map(({ name, image, abilities }) => [
      name,
      { image: image, width: imgWidth, height: imgHeight }, // Renderiza la imagen
      abilities.map(({ ability }) => ability.name).join(", "),
    ]);
  
    // Add a new page for the table
    const pdf = new jsPDF();
    pdf.autoTable({
      head: [columns],
      body: rows,
      columnStyles: {
        1: { // La columna de las imágenes
          cellWidth: imgWidth,
          valign: 'middle',
          halign: 'center',
          // Utilizamos una función de renderizado personalizada para insertar la imagen
          render: (cell) => {
            const img = new Image();
            img.src = cell.row.raw[1].image; // Accedemos a la URL de la imagen correctamente
            pdf.addImage(img, 'JPEG', cell.cell.x, cell.cell.y, imgWidth, imgHeight);
          }
        }
      }
    });
  
    // Save the PDF
    pdf.save("pokemon_list.pdf");
  };
  
  
  return (
    <Container maxWidth="lg">
      {loading && <LinearProgress />} {/* Indicador de progreso */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
          Descargar PDF
        </Button>
      </Box>
      <div ref={componentRef}>
      <Grid container spacing={2}>
        {/* Sección del título y campo de búsqueda */}
        <Grid item xs={12}>
     

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4">Lista de Pokemons</Typography>
            <TextField
              placeholder="buscar..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>

        {/* Sección de los cards de Pokémon */}
        <Grid item xs={12}>
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
                    sx={{ objectFit: "fill", marginTop: "10px" }}
                    image={pokemon.image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {pokemon.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <ul>
                        {pokemon.abilities.map((abilityData, abilityIndex) => (
                          <li key={abilityIndex}>
                            Ability: {abilityData.ability.name}, Hidden:{" "}
                            {abilityData.is_hidden ? "Yes" : "No"}
                          </li>
                        ))}
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {/* Esqueleto para los Pokemons */}
            {loading &&
              Array.from(Array(selectedPerPage)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ width: 345, height: "100%", marginRight: 0.5, my: 5 }}>
                    <Skeleton variant="rectangular" width={345} height={130} />
                    <Box sx={{ pr: 2, pt: 0.5 }}>
                      <Skeleton />
                      <Skeleton width="60%" />
                    </Box>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
      
      {/* Sección de paginación y Select de cantidad por página */}
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
        <Select
          value={selectedPerPage}
          onChange={handlePerPageChange}
          variant="outlined"
          sx={{ ml: 2 }}
        >
          {perPageOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </Box>
      </div >
    </Container>
  );
};

export default PokemonList;
