import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import xlsx from "json-as-xlsx";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import EditIcon from "@mui/icons-material/Edit";

import url from "../service/apiService";

const PokemonCoach = () => {
  interface coachsPOkemon {
    _id: string;
    name: string;
    last_name: string;
    phone_number: number;
    gym_medals: number;
  }

  interface coachPOkemon {
    id: number;
    name: string;
    last_name: string;
    phone_number: number;
    gym_medals: number;
  }

  const [coachs, setCoachs] = useState<coachsPOkemon[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [coach, setCoach] = useState({
    id: 0,
    name: "",
    last_name: "",
    phone_number: 0,
    gym_medals: 0,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    resetData();
  };
  const getCoach = async () => {
    const response = await url
      .get("coach")
      .then((response) => response)
      .catch((error) => {
        console.error(error);
      });
    const coachsData = response?.data || [];
    setCoachs(coachsData);
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(4, "Nombre debe tener al menos 4 letras")
      .required("Nombre es requerido"),
    last_name: yup.string().required("Apellido es requerido"),
    phone_number: yup
      .string()
      .matches(/^\d{10}$/, "Número de teléfono debe tener 10 dígitos")
      .required("Número de teléfono es requerido"),
    gym_medals: yup
      .number()
      .typeError("Medallas de gimnasio debe ser un número")
      .required("Medallas de gimnasio es requerido"),
  });
  const formik = useFormik({
    initialValues: coach,
    validationSchema: validationSchema,
    onSubmit: (values, action) => {
      if (values.id === 0) {
        saveCoach(values);
      } else {
        updateCoach(values);
      }

      action.resetForm({
        values: {
          id: 0,
          name: "",
          last_name: "",
          phone_number: 0,
          gym_medals: 0,
        },
      });
    },
  });

  const saveCoach = (data: coachPOkemon) => {
    setLoading(true);
    const datoenviar = {
      name: data.name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      gym_medals: data.gym_medals,
    };
    url
      .post("coach", datoenviar)
      .then(() => {
        getCoach();
      })
      .catch((error) => {
        console.error(error);
      });

    setLoading(false);
    handleClose();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCoach = (data: any) => {
    setLoading(true);
    url.put("coach/" + data.id, data).then((reponse) => {
      setCoachs((prevState) => {
        const copyPrev = [...prevState];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const index = copyPrev.findIndex((edit) => edit._id === data.id);
        if (index > -1) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          copyPrev.splice(index, 1, reponse.data);
        }

        return copyPrev;
      });
    });

    handleClose();
    setLoading(false);
  };

  const editar = (data) => {
    const edit = {
      id: data._id,
      last_name: data.last_name,
      name: data.name,
      phone_number: data.phone_number,
      gym_medals: data.gym_medals,
    };

    setCoach(edit);
    formik.setFieldValue("id", edit.id);
    formik.setFieldValue("name", edit.name);
    formik.setFieldValue("last_name", edit.last_name);
    formik.setFieldValue("phone_number", edit.phone_number);
    formik.setFieldValue("gym_medals", edit.gym_medals);

    handleClickOpen();
  };

  const deleteCoach = (data: string) => {
    setLoading(true);
    url
      .delete("coach/" + data)
      .then(() => {
        setCoachs((prevState) => {
          const grupPrev = [...prevState];
          const next1 = grupPrev.findIndex((copy) => copy._id === data);
          if (next1 > -1) {
            grupPrev.splice(next1, 1);
          }
          return grupPrev;
        });
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(false);
  };
  const resetData = () => {
    setCoach({
      id: 0,
      name: "",
      last_name: "",
      phone_number: 0,
      gym_medals: 0,
    });
  };
  const downloadFile = () => {
    let data = [
      {
        sheet: "lista Entrenadores",
        columns: [
          { label: "Nombre", value: "name" }, // Top level data
          { label: "Apellido", value: "last_name" }, // Custom format
          { label: "Telefono", value:'phone_number' }, // Run functions

          { label: "Medallas", value: "gym_medals" }, // Run functions
        ],
        content: [
          ...coachs.map((pokemon) => {
            return [
              { name: `${pokemon.name}`, last_name:`${pokemon.last_name}`, phone_number:`${pokemon.phone_number}`,gym_medals:`${pokemon.gym_medals}`},
            ];
          }),
        ],
      },
    ];
    let settings = {
      fileName: "MySpreadsheet",
    };
    xlsx(data, settings);
  };

  useEffect(() => {
    getCoach();
  }, []);

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Lista de Entrenadores</Typography>

        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Agregar
        </Button>
        <IconButton
            onClick={downloadFile}
            color="secondary"
            aria-label="add an alarm"
          >
            Excel<InsertDriveFileIcon/>
          </IconButton>
      </Box>

      {loading && <LinearProgress />}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          id="customized-dialog-title"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {coach.name === "" ? "Agregar usuarios" : "Editando usuarios"}
          <IconButton
            onClick={handleClose}
            color="secondary"
            aria-label="add an alarm"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <TextField
                required
                value={formik.values.name}
                name="name"
                onChange={formik.handleChange}
                id="name"
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="dense"
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                id="last_name"
                required
                value={formik.values.last_name}
                name="last_name"
                onChange={formik.handleChange}
                label="Apellido"
                variant="outlined"
                fullWidth
                margin="dense"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.last_name && Boolean(formik.errors.last_name)
                }
                helperText={formik.touched.last_name && formik.errors.last_name}
              />

              <TextField
                id="phone_number"
                required
                value={formik.values.phone_number}
                name="phone_number"
                onChange={formik.handleChange}
                variant="outlined"
                label="Telefono"
                fullWidth
                margin="dense"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phone_number &&
                  Boolean(formik.errors.phone_number)
                }
                helperText={
                  formik.touched.phone_number && formik.errors.phone_number
                }
              />
              <TextField
                id="gym_medals"
                required
                value={formik.values.gym_medals}
                name="gym_medals"
                onChange={formik.handleChange}
                label="Medallas"
                variant="outlined"
                fullWidth
                margin="dense"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.gym_medals && Boolean(formik.errors.gym_medals)
                }
                helperText={
                  formik.touched.gym_medals && formik.errors.gym_medals
                }
              />
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => formik.handleSubmit()}
          >
            {coach.name === "" ? "Agregar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper} sx={{ mt: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Medallas</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coachs.map((coach) => (
              <TableRow key={coach._id}>
                <TableCell>{coach.name}</TableCell>
                <TableCell>{coach.last_name}</TableCell>
                <TableCell>{coach.phone_number}</TableCell>
                <TableCell>{coach.gym_medals}</TableCell>
                <TableCell align="right">
                  {/* } */}
                  <IconButton onClick={() => editar(coach)} aria-label="delete">
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => deleteCoach(coach._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default PokemonCoach;
