import React, { useState } from "react";
import { Box, useTheme, IconButton,Button,Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,MenuItem   } from "@mui/material";
import {useGetReactivesQuery,useCreateReactiveMutation,useGetCategorysQuery,useGetProyectsQuery  } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {EditOutlined , 
  DeleteForeverOutlined,
  AddCircle } from "@mui/icons-material";
import { width } from "@mui/system";
import { eventListeners } from "@popperjs/core";
const Reactives = () => {
    
    const theme = useTheme();
    const { data, isLoading } = useGetReactivesQuery();
    const { data: categorysData } = useGetCategorysQuery();
    const { data: proyectsData } = useGetProyectsQuery();
    const [createReactive] = useCreateReactiveMutation();

    const [addReactiveOpen, setAddReactiveOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada
    const [selectedProject, setSelectedProject] = useState(""); // Estado para el proyecto seleccionado
    
  
    const openAddReactive = () => {
      setAddReactiveOpen(true);
    };
  
    const closeAddReactive = () => {
      setAddReactiveOpen(false);
    };
    const handleCategoryChange = (event) => {
      console.log('categaria seleccionado:', event.target.value)
      setSelectedCategory(event.target.value);
      setNuevoReactivo({ ...nuevoReactivo, categoriaId: event.target.value })
    };
  
    const handleProjectChange = (event) => {
      console.log('Proyecto seleccionado:', event.target.value)
      setSelectedProject(event.target.value);
      setNuevoReactivo({ ...nuevoReactivo, proyectoId: event.target.value })
    };
    
    const [nuevoReactivo, setNuevoReactivo] = useState({
      nombre: "",
      cantidad: "",
      unidades: "",
      clasificacion: "",
      estado: true,
      codigo: "",
      observaciones: "",
      marca: "",
      fecha_vencimiento: new Date(),
      categoriaId:null , // Agrega la categoría seleccionada
      proyectoId: null   // Agrega la categoría seleccionada
    });
  
    const guardarNuevoReactivo = async () => {
      try {
        // Llama a la función de mutación para crear el nuevo reactivo
        const nuevoReactivoData = {
          // Los datos del nuevo reactivo que deseas guardar
          nombre: nuevoReactivo.nombre,
          cantidad: nuevoReactivo.cantidad,
          unidades: nuevoReactivo.unidades,
          clasificacion: nuevoReactivo.clasificacion,
          estado: nuevoReactivo.estado,
          codigo: nuevoReactivo.codigo,
          observaciones: nuevoReactivo.observaciones,
          marca: nuevoReactivo.marca,
          fecha_vencimiento: nuevoReactivo.fecha_vencimiento,
          categoriaId: nuevoReactivo.categoriaId, // Agrega la categoría seleccionada
          proyectoId: nuevoReactivo.proyectoId,   // Agrega el proyecto seleccionado
        };
  
        const response = await createReactive(nuevoReactivoData);
        console.log(nuevoReactivoData)
        if (response.error) {
          console.error('Error al crear el reactivo:', response.error);
        } else {
          console.log('Reactivo creado con éxito:', response.data);
          // Una vez guardado, puedes realizar otras acciones si es necesario
        }
      } catch (error) {
        console.error('Error al crear el reactivo:', error);
      } finally {
        // Cierra el modal
        closeAddReactive();
      }
    };
const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.2,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 0.5,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 0.5,
    },
    {
      field: "unidades",
      headerName: "Unidades",
      flex: 0.5,
    },
    {
      field: "marca",
      headerName: "Marca",
      flex: 0.5,
    },
    {
      field: "clasificacion",
      headerName: "Clasificación",
      flex: 0.5,
    },
    {
      field: "fecha_vencimiento",
      headerName: "Fecha de Vencimiento",
      flex: 0.5,
    },
    {
      field: "categoria",
      headerName: "Categoría",
      flex: 0.5,
      valueGetter: (params) => params.row.categoria.categoria,
      
    },
    {
      field: "proyectoId",
      headerName: "Proyecto ",
      flex: 0.5,
      valueGetter: (params) => params.row.proyecto.proyecto,
    },
    {
        field: "acciones",
        headerName: "Acciones",
        flex: 0.5,
        renderCell: (params) => (
        <Box>
            <IconButton
              color="secondary"
              aria-label="Editar"
            >
              <EditOutlined />
            </IconButton>
  
            <IconButton
              color="secondary"
              aria-label="Eliminar"
            >
              <DeleteForeverOutlined/>
            </IconButton>
          </Box>
        ),
      },
  ];
  
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="REACTIVOS" subtitle="Lista de los Reactivos" />
        <Box display="flex" justifyContent="flex-end" mb="1rem">
          <Button
          variant="contained"
          color="secondary"
          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} // Ajustar el tamaño del texto y el espacio interno
          onClick={openAddReactive}
          >
            Agregar Reactivo
          </Button>
        </Box>
        <Box
          mt="40px"
          height="75vh"
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
          }}
        >
          
          <DataGrid
       
            loading={isLoading || !data}
            getRowId={(row) => row.id}
            rows={data || []}
            columns={columns}
            disableRowSelectionOnClick
          />
        </Box>
        
        <Dialog open={addReactiveOpen} onClose={closeAddReactive}>
        <DialogTitle>Agregar Nuevo Reactivo</DialogTitle>
        <DialogContent>
        <form>
      <TextField
        label="Nombre"
        value={nuevoReactivo.nombre}
        onChange={(e) =>
          setNuevoReactivo({ ...nuevoReactivo, nombre: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Cantidad"
        type="number"
        value={nuevoReactivo.cantidad}
        onChange={(e) =>
          setNuevoReactivo({ ...nuevoReactivo, cantidad: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Unidades"
        value={nuevoReactivo.unidades}
        onChange={(e) =>
          setNuevoReactivo({ ...nuevoReactivo, unidades: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Clasificación"
        value={nuevoReactivo.clasificacion}
        onChange={(e) =>
          setNuevoReactivo({ ...nuevoReactivo, clasificacion: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Código"
        value={nuevoReactivo.codigo}
        onChange={(e) =>
          setNuevoReactivo({ ...nuevoReactivo, codigo: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Observaciones"
        multiline
        rows={4}
        value={nuevoReactivo.observaciones}
        onChange={(e) =>
          setNuevoReactivo({ ...nuevoReactivo, observaciones: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Marca"
        value={nuevoReactivo.marca}
        onChange={(e) =>
          setNuevoReactivo({ ...nuevoReactivo, marca: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      
      <Box display= "flex" justifyContent="space-between" mt="1rem" mb="1rem">
        {/* Dropdown para Categoría */}
        <FormControl >
          <InputLabel htmlFor="category-select">Categoría</InputLabel>
          
          <Select
           
            value={selectedCategory}
            onChange={handleCategoryChange}
            inputProps={{
              name: 'category',
              id: 'category-select',
            }}
            style={{ minWidth: '200px' }} // Aumenta el ancho de la caja
          >
            {categorysData && categorysData.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.categoria}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Dropdown para Proyecto */}
        <FormControl>
          <InputLabel htmlFor="proyect-select">Proyecto</InputLabel>
          <Select
            value={selectedProject}
            onChange={handleProjectChange}
            inputProps={{
              name: 'proyect',
              id: 'proyect-select',
            }}
            style={{ minWidth: '200px' }} // Aumenta el ancho de la caja
          >
            {proyectsData && proyectsData.map((proyect) => (
              <MenuItem key={proyect.id} value={proyect.id}>
                {proyect.proyecto}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TextField
        label="Fecha de Vencimiento"
        type="date"
        value={nuevoReactivo.fecha_vencimiento}
        onChange={(e) =>
          setNuevoReactivo({ ...nuevoReactivo, fecha_vencimiento: e.target.value })
        }
        fullWidth
        margin="normal"
      />
    </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddReactive} color="secondary">
            Cancelar
          </Button>
          <Button onClick={guardarNuevoReactivo} color="secondary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reactives