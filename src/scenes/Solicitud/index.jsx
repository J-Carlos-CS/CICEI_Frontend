import { Box, Button, Dialog, MenuItem, Stack, TextField, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "Auth/userReducer";
import { getEquipoSolicitud, getGuias, getReactivosSolicitud, getTutor, postSolicitud, postSolicitudEquipo, postSolicitudReactivo } from "services/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import AgregarEquipo from "./agregarEquipo";
import { show_alerta } from "services/functions";
function EquipoTitulo() {
  return (
    <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Typography variant="h3">Equipos Seleccionados</Typography>
    </Box>
  );
}
function reactivoTitulo() {
  return (
    <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Typography variant="h3">Reactivos Seleccionados</Typography>
    </Box>
  );
}
const Solicitud = () => {
  const theme = useTheme();
  const user = useSelector(selectUser);
  const [guias, setGuias] = useState([]);
  const [tutor, setTutor] = useState([]);
  const [solicitud, setSolicitud] = useState({
    solicitante: user.firstName + " " + user.lastName,
    solicitanteid: user.id,
    carera: user.career,
    tutorId: null,
    materia: "",
    fieldId: 0,
    fecha: null,
    hora: null,
  });
  const [modal, setModal] = useState(false);
  const [modalRectivo, setModalReactivo] = useState(false);
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const guia = await getGuias(user.id);
    const tutor = await getTutor(user.id);
    setGuias(guia.data.response);
    setTutor(tutor.data.response);
  };
  const [Equipos, setEquipos] = useState([]);
  const [reactivos, setReactivos] = useState([]);
  const validar = () => {
    if (solicitud.solicitanteid !== 0) {
      if (solicitud.tutorId !== 0) {
        if (solicitud.materia.trim() !== "") {
          if (solicitud.fieldId !== 0) {
            if (solicitud.fecha !== "") {
              if (solicitud.hora !== "") {
                if (Equipos.length > 0) {
                  if (reactivos.length > 0) {
                    postSolicitud(solicitud)
                      .then((result) => {
                        if (result.data.success) {
                          let res = null;
                          if (Equipos.length > 0) {
                            for (let index = 0; index < Equipos.length; index++) {
                              Equipos[index].solicitudId = result.data.response.id;
                              res = postSolicitudEquipo(Equipos[index]);
                              if (res.error) {
                                throw new Error("Error en la solicitud");
                              }
                            }
                          }
                          if (reactivos.length > 0) {
                            for (let index = 0; index < reactivos.length; index++) {
                              reactivos[index].solicitudId = result.data.response.id;
                              res = postSolicitudReactivo(reactivos[index]);
                              if (res.error) {
                                throw new Error("Error en la solicitud");
                              }
                            }
                          }
                          show_alerta("Solicitud Enviada Correctamente", "success");
                        } else {
                          show_alerta("Error al enviar la solicitud", "error");
                        }
                      })
                      .catch((err) => {
                        show_alerta("Error al enviar la solicitud", "error");
                      });
                  } else {
                    show_alerta("Agrega un Reactivo", "warning");
                  }
                } else {
                  show_alerta("Agrega un Equipo", "warning");
                }
              } else {
                show_alerta("Agrega una Hora", "warning");
              }
            } else {
              show_alerta("Agrega una Fecha", "warning");
            }
          } else {
            show_alerta("Agrega una Guia", "warning");
          }
        } else {
          show_alerta("Agrega una Materia", "warning");
        }
      } else {
        show_alerta("Agrega un Tutor", "warning");
      }
    } else {
      show_alerta("Agrega un Solicitante", "warning");
    }
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 2, width: "30ch" },
        }}
        noValidate
        autoComplete="off">
        <div style={{ textAlign: "center" }}>
          <Header title="Nueva Solicitud" />
        </div>
        <div style={{ textAlign: "center" }}>
          <TextField
            id="standard-read-only-input"
            margin="dense"
            fullWidth
            color="secondary"
            label="Nombre del solicitante"
            defaultValue={user.firstName + " " + user.lastName}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="selecTutor"
            select
            label="Tutor"
            color="secondary"
            onChange={(event) => {
              setSolicitud({
                ...solicitud,
                tutorId: event.target.value,
              });
            }}>
            {tutor.map((option) =>
              option.status ? (
                <MenuItem key={option.id} value={option.id}>
                  {option.firstName + " " + option.lastName}
                </MenuItem>
              ) : null
            )}
          </TextField>
        </div>
        <div>
          <TextField
            id="materia"
            label="Materia"
            color="secondary"
            onChange={(e) =>
              setSolicitud({
                ...solicitud,
                materia: e.target.value,
              })
            }
          />
          <TextField
            id="standard-read-only-input"
            margin="dense"
            fullWidth
            color="secondary"
            label="Carrera"
            defaultValue={user.career}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="selectProyecto"
            select
            label="Guia"
            color="secondary"
            onChange={(event) => {
              setSolicitud({
                ...solicitud,
                fieldId: event.target.value,
              });
            }}>
            {guias.map((option) =>
              option.estado ? (
                <MenuItem key={option.id} value={option.id}>
                  {option.titulo}
                </MenuItem>
              ) : null
            )}
          </TextField>
        </div>
        <div style={{ textAlign: "center" }}>
          <TextField
            id="fecha"
            type="Date"
            label="Fecha"
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setSolicitud({
                ...solicitud,
                fecha: e.target.value,
              })
            }
          />
          <TextField
            id="hora"
            type="time"
            label="Hora"
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setSolicitud({
                ...solicitud,
                hora: e.target.value,
              })
            }
          />
        </div>
        <Stack spacing={3}>
          <Button variant="contained" color="secondary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} onClick={() => setModalReactivo(true)}>
            Agregar Reactivo
          </Button>
          <Button variant="contained" color="secondary" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} onClick={() => setModal(true)}>
            Agregar Equipo
          </Button>
        </Stack>

        <div>
          <Box
            mt="40px"
            height="30vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.primary.light,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderTop: "none",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.secondary[200]} !important`,
              },
            }}>
            <DataGrid
              columns={[
                { field: "nombre", flex: 0.5 },
                { field: "cantidad", flex: 0.5 },
              ]}
              rows={reactivos}
              initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
              pageSizeOptions={[10, 25, 50, 100]}
              components={{ Toolbar: reactivoTitulo }}
            />
          </Box>
          <Box
            mt="40px"
            height="30vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.primary.light,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderTop: "none",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.secondary[200]} !important`,
              },
            }}>
            <DataGrid
              columns={[
                { field: "nombre", flex: 0.5 },
                { field: "cantidad", flex: 0.5 },
              ]}
              rows={Equipos}
              initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
              pageSizeOptions={[10, 25, 50, 100]}
              components={{ Toolbar: EquipoTitulo }}
            />
          </Box>
          <br />
          <br />
        </div>
        <Stack spacing={3}>
          <Button variant="contained" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} color="success" onClick={() => validar()}>
            Enviar Solicitud
          </Button>
        </Stack>
      </Box>
      <Dialog open={modal} onClose={() => setModal(false)}>
        <Box>
          <AgregarEquipo Equipos={Equipos} setData={setEquipos} closeModal={setModal} getEquipoSolicitud={getEquipoSolicitud} titulo={"Equipo"} />
        </Box>
      </Dialog>
      <Dialog open={modalRectivo} onClose={() => setModalReactivo(false)}>
        <Box>
          <AgregarEquipo Equipos={reactivos} setData={setReactivos} closeModal={setModalReactivo} getEquipoSolicitud={getReactivosSolicitud} titulo={"Reactivo"} />
        </Box>
      </Dialog>
    </Box>
  );
};

export default Solicitud;
