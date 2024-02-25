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
} from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useFormik } from "formik";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const formik = useFormik({
    initialValues: coach,
    onSubmit: (values, action) => {
      console.log(values);
      if (values.id === 0) {
        saveCoach(values);

        console.log("yo estoy agregando");
      } else {
        updateCoach(values);
        console.log("yo me estoy actualizando");
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

    resetData();

    handleClose();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCoach = (data: any) => {
    
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
    resetData();
    handleClose();
  };

  const editar = (data) => {
    const edit = {
      id: data._id,
      last_name: data.last_name,
      name: data.name,
      phone_number: data.phone_number,
      gym_medals:data.gym_medals
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
  };
  const resetData = () => {
    setCoach({
        id:0,      name: "",
      last_name: "",
      phone_number: 0,
      gym_medals: 0,
    });
  };

  useEffect(() => {
    getCoach();
  }, []);

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Agregar
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title">
          {coach.name === "" ? "Agregar usuarios" : "Editando usuarios"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Columna 1 */}
            <Grid item xs={6}>
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
              />
            </Grid>
            {/* Columna 2 */}
            <Grid item xs={6}>
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Button
          variant="contained"
          color="primary"
          onClick={() => formik.handleSubmit()}
        >
          {coach.name === "" ? "Agregar" : "Editar"}
        </Button>
      </Dialog>

      <TableContainer component={Paper}>
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
