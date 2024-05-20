import { DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllInvestigadores, getInvesigadores, postInvesigadores } from "services/api";
import { show_alerta } from "services/functions";

const Form = ({ closeModal, tutorId, getProductoTable }) => {
  const [allInvestigadores, setAllInvestigadores] = useState([]);
  const [newInvestigador, setNewInvestigador] = useState({
    tutorId: tutorId,
    investigadorId: 0,
  });
  useEffect(() => {
    getProducto();
  }, []);
  const getProducto = async () => {
    const respuesta = await getAllInvestigadores();
    setAllInvestigadores(respuesta.data.response);
  };
  const validar = () => {
    try {
      closeModal(false);
      if (newInvestigador.investigadorId !== 0) {
        if (newInvestigador.tutorId !== 0) {
          postInvesigadores(newInvestigador)
            .then((res) => {
              if (res.data?.success) {
                show_alerta("Investigador asignado con exito", "success");
                getProductoTable();
              } else {
                show_alerta(res.data.response, "error");
              }
            })
            .catch((err) => {
              show_alerta("Error al asignar el investigador", "error");
            });
        }
      } else {
        show_alerta("Necesita un investigador valido", "error");
      }
    } catch (error) {
      show_alerta(error, "error");
    }
  };
  return (
    <div>
      <DialogTitle color="secondary">Asignar Investigador</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            width: "auto",
            "& .MuiTextField-root": { m: 1, width: "20ch" },
          }}
          noValidate
          autoComplete="off">
          <TextField
            id="selectInvestigador"
            select
            label="Investigador"
            color="secondary"
            onChange={(event) => {
              setNewInvestigador({
                ...newInvestigador,
                investigadorId: event.target.value,
              });
            }}>
            {allInvestigadores.map((option) =>
              option.status ? (
                <MenuItem key={option.id.toString()} value={option.id}>
                  {option.firstName + " " + option.lastName}
                </MenuItem>
              ) : null
            )}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="error" onClick={closeModal}>
          Cancelar
        </Button>
        <Button autoFocus color="secondary" onClick={() => validar()}>
          Guardar
        </Button>
      </DialogActions>
    </div>
  );
};

export default Form;
