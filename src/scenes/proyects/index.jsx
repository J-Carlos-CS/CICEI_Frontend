import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useGetProyectsQuery } from "state/api";

const Proyect = ({
  id,
  proyecto,
  descripcion,
  
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
  {/* <Typography
    sx={{ fontSize: 14 }}
    color={theme.palette.secondary[700]}
    gutterBottom
  >
    {category}
  </Typography> */}
  <Typography variant="h5" component="div">
    {proyecto}
  </Typography> 
  {/* <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
    ${Number(price).toFixed(2)}
  </Typography> */}
 

  {/* <Typography variant="body2">{descripcion}</Typography> */}
</CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Mas Información
        </Button>
      </CardActions>
  
    </Card>
  );
};


const Proyects = () => {
  const { data, isLoading } = useGetProyectsQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  console.log("data",data)
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PROYECTOS" subtitle="Lista de los Proyectos" />
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"//Genera 4 columnas con fraccion 1 como maximo
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },//Apuntamos al div imediato y prar mobile genera 4
          }}
        >
         {data.map(
            ({
              id,
              proyecto,
              descripcion,
            }) => (
              <Proyect
                key={id}
                id={id}
                proyecto={proyecto}
                descripcion={descripcion}
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Proyects;
