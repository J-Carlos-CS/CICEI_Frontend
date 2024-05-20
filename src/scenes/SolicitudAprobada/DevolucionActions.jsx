import { Check, Save } from "@mui/icons-material";
import { Box, CircularProgress, Fab } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { postEnviarMateriales } from "services/api";
import { show_alerta } from "services/functions";

const DevolucionActions = ({ params, rowId, setRowId }) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    if (params.row.codigo !== "") {
      if (params.row.comentario !== "") {
        if (params.row.estado !== "") {
          postEnviarMateriales(params.row)
            .then((result) => {
              if (result.data.success) {
                alert("Solicitud Enviada");
                setSuccess(true);
                setRowId(null);
              } else {
                alert(result.data.response);
                setSuccess(false);
                setRowId(null);
              }
            })
            .catch((err) => {
              alert(err.message);
            });
        } else {
          alert("El campo estado no puede estar vacio");
        }
      } else {
        alert("El campo comentario no puede estar vacio");
      }
    } else {
      alert("El campo codigo no puede estar vacio");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (rowId === params.id && success) setSuccess(false);
  }, [rowId]);
  return (
    <Box
      sx={{
        m: 1,
        position: "relative",
      }}>
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            "&:hover": { bgcolor: green[700] },
          }}>
          <Check />
        </Fab>
      ) : (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
          }}
          onClick={handleSubmit}>
          <Save />
        </Fab>
      )}
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default DevolucionActions;
