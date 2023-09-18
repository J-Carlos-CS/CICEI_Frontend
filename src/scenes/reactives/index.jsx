import React, { useState } from "react";
import { Box, useTheme, IconButton,Button,Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,MenuItem   } from "@mui/material";
import {useGetReactivesQuery,useCreateReactiveMutation,useGetCategorysQuery,useGetProyectsQuery,useDeleteReactiveMutation, useUpdateReactiveMutation  } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {EditOutlined , 
  DeleteForeverOutlined,
  AddCircle } from "@mui/icons-material";
import { width } from "@mui/system";
import { eventListeners } from "@popperjs/core";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DataGridCustomToolBar from "components/DataGridCustomToolBar"
const Reactives = () => {
    
    const theme = useTheme();
    const [updateAlertOpen, setUpdateAlertOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [createAlertOpen, setCreateAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success'); // Puedes cambiar 'success' a 'error' u otro valor según necesites
    const [alertMessage, setAlertMessage] = useState('');

    const { data: reactives, isLoading,refetch } = useGetReactivesQuery();
    const { data: categorysData } = useGetCategorysQuery();
    const { data: proyectsData } = useGetProyectsQuery();

    const [deleteReactive,] = useDeleteReactiveMutation()
    const [createReactive] = useCreateReactiveMutation();
    const [updateReactive] = useUpdateReactiveMutation();

    const [addReactiveOpen, setAddReactiveOpen] = useState(false);
    const [editReactiveOpen, setEditReactiveOpen] = useState(false);

    const [selectedReactive, setSelectedReactive] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada
    const [selectedProject, setSelectedProject] = useState(""); // Estado para el proyecto seleccionado
    
  
    const openAddReactive = () => {
      setAddReactiveOpen(true);
    };
  
    const closeAddReactive = () => {
      setAddReactiveOpen(false);
    };

    const handleEditReactive = (selectedReactive) => {
      console.log(selectedReactive)
      setSelectedReactive(selectedReactive);
      openEditReactive(selectedReactive); // Abre el diálogo de edición
    };
    const openEditReactive = (selectedReactive) => {
      populateEditForm(selectedReactive); // Llena el formulario de edición con los datos del reactivo seleccionado
      setEditReactiveOpen(true); // Abre el diálogo de edición
    };
    const closeEditReactive = () => {
      setEditReactiveOpen(false);
    };
    const handleUpdateAlertOpen = () => {
      setUpdateAlertOpen(true);
    };
    
    const handleUpdateAlertClose = () => {
      setUpdateAlertOpen(false);
    };
    
    const handleDeleteAlertOpen = () => {
      setDeleteAlertOpen(true);
    };
    const handleCreateAlertOpen = () => {
      setCreateAlertOpen(true);
    };
    
    const handleDeleteAlertClose = () => {
      setDeleteAlertOpen(false);
    };
    const handleCategoryChange = (event) => {
      console.log('categaria seleccionado:', event.target.value)
      setSelectedCategory(event.target.value);
      setNewReactive({ ...newReactive, categoriaId: event.target.value })
    };
    const handleCategoryEditChange = (event) => {
      console.log('categaria seleccionado:', event.target.value)
      setSelectedCategory(event.target.value);
      setEditReactive({ ...editReactive, categoriaId: event.target.value })
    };
    const handleProjectChange = (event) => {
      console.log('Proyecto seleccionado:', event.target.value)
      setSelectedProject(event.target.value);
      setNewReactive({ ...newReactive, proyectoId: event.target.value })
    };
    const handleProjectEditChange = (event) => {
      console.log('Proyecto seleccionado:', event.target.value)
      setSelectedProject(event.target.value);
      setEditReactive({ ...editReactive, proyectoId: event.target.value })
    };
    
    const [newReactive, setNewReactive] = useState({
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
    const saveNewReactive = async () => {
      try {
        
        const nuevoReactivoData = {
          // Los datos del nuevo reactivo que deseas guardar
          nombre: newReactive.nombre,
          cantidad: newReactive.cantidad,
          unidades: newReactive.unidades,
          clasificacion: newReactive.clasificacion,
          estado: newReactive.estado,
          codigo: newReactive.codigo,
          observaciones: newReactive.observaciones,
          marca: newReactive.marca,
          fecha_vencimiento: newReactive.fecha_vencimiento,
          categoriaId: newReactive.categoriaId, // Agrega la categoría seleccionada
          proyectoId: newReactive.proyectoId,   // Agrega el proyecto seleccionado
        };
        // Llama a la función de mutación para crear el nuevo reactivo
        const response = await createReactive(nuevoReactivoData);
        console.log(nuevoReactivoData)
        if (response.error) {
          console.error('Error al crear el reactivo:', response.error);
        } else {
          console.log('Reactivo creado con éxito:', response.data);
          handleCreateAlertOpen();
          setAlertSeverity('success');
          setAlertMessage('Reactivo Creado con éxito.');
          refetch()
          refetch()
        }
      } catch (error) {
        console.error('Error al crear el reactivo:', error);
      } finally {
        // Cierra el modal
        closeAddReactive();
      }
    };
    const [editReactive, setEditReactive] = useState({
      id: null,
      nombre: "",
      cantidad: "",
      unidades: "",
      clasificacion: "",
      estado: true,
      codigo: "",
      observaciones: "",
      marca: "",
      fecha_vencimiento: new Date(),
      categoriaId: null,
      proyectoId: null,
    });
    const populateEditForm = (selectedReactive) => {
      if (selectedReactive) {
        setEditReactive({
          id: selectedReactive.id,
          nombre: selectedReactive.nombre,
          cantidad: selectedReactive.cantidad,
          unidades: selectedReactive.unidades,
          clasificacion: selectedReactive.clasificacion,
          estado: selectedReactive.estado,
          codigo: selectedReactive.codigo,
          observaciones: selectedReactive.observaciones,
          marca: selectedReactive.marca,
          fecha_vencimiento: selectedReactive.fecha_vencimiento,
          categoriaId: selectedReactive.categoriaId,
          proyectoId: selectedReactive.proyectoId,
        });
      }
    };
    
    const handleDeleteReactive = async (id) => {
      try {
        // Muestra una confirmación antes de eliminar
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este reactivo?");
    
        if (confirmed) {
          console.log("REACTIVO A ELIMINAR",id)
          // Realiza una mutación para cambiar el estado del reactivo a false
          const response = await deleteReactive(id);
    
          if (response.error) {
            console.error('Error al eliminar el reactivo:', response.error);
          } else {
            console.log('Reactivo eliminado con éxito:', response.data);
            handleDeleteAlertOpen();
            setAlertSeverity('success');
            setAlertMessage('Reactivo eliminado con éxito.');
            refetch()
          
          }
        }
      } catch (error) {
        console.error('Error al eliminar el reactivo:', error);
      }
    };
    const saveEditedReactive = async () => {
      try {
        
        const editedReactiveData = {
          // Los datos del nuevo reactivo que deseas guardar
          id: editReactive.id,
          nombre: editReactive.nombre,
          cantidad: editReactive.cantidad,
          unidades: editReactive.unidades,
          clasificacion: editReactive.clasificacion,
          codigo: editReactive.codigo,
          observaciones: editReactive.observaciones,
          marca: editReactive.marca,
          fecha_vencimiento: editReactive.fecha_vencimiento,
          categoriaId: editReactive.categoriaId, // Agrega la categoría seleccionada
          proyectoId: editReactive.proyectoId,   // Agrega el proyecto seleccionado
        };
        // Llama a la función de mutación para crear el nuevo reactivo
        console.log("id save edited",)
        const response = await updateReactive(editedReactiveData);
        
        console.log(editedReactiveData)
        if (response.error) {
          console.error('Error al actualizar el reactivo:', response.error);
        } else {
          console.log('Reactivo actualizado con éxito:', response.data);
          handleUpdateAlertOpen();
          setAlertSeverity('success');
          setAlertMessage('Reactivo actualizado con éxito.');
          refetch()
        }
      } catch (error) {
        console.error('Error al actualizar el reactivo:', error);
      } finally {
        // Cierra el modal
        closeEditReactive();
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
      flex: 0.7,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 0.3,
    },
    {
      field: "unidades",
      headerName: "Unidades",
      flex: 0.3,
    },
    {
      field: "codigo",
      headerName: "Codigo",
      flex: 0.3,
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
      field: "observaciones",
      headerName: "Obsevaciónes",
      flex: 1,
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
              onClick={()=>handleEditReactive(params.row)}
            >
              <EditOutlined />
            </IconButton>
       
            <IconButton
              color="secondary"
              onClick={()=>handleDeleteReactive(params.row.id)}
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
       
            loading={isLoading || !reactives}
            getRowId={(row) => row.id}
            rows={reactives || []}
            columns={columns}
            disableRowSelectionOnClick
            components={{Toolbar: DataGridCustomToolBar}}
          />
        </Box>
      {/*Dialog Agregar Reactivo*/ }  
      <Dialog open={addReactiveOpen} onClose={closeAddReactive}>
        <DialogTitle>Agregar Nuevo Reactivo</DialogTitle>
          <DialogContent>
          <form>
          <TextField
          label="Nombre"
          value={newReactive.nombre}
          onChange={(e) =>
            setNewReactive({ ...newReactive, nombre: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cantidad"
          type="number"
          value={newReactive.cantidad}
          onChange={(e) =>
            setNewReactive({ ...newReactive, cantidad: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unidades"
          value={newReactive.unidades}
          onChange={(e) =>
            setNewReactive({ ...newReactive, unidades: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Clasificación"
          value={newReactive.clasificacion}
          onChange={(e) =>
            setNewReactive({ ...newReactive, clasificacion: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Código"
          value={newReactive.codigo}
          onChange={(e) =>
            setNewReactive({ ...newReactive, codigo: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Observaciones"
          multiline
          rows={4}
          value={newReactive.observaciones}
          onChange={(e) =>
            setNewReactive({ ...newReactive, observaciones: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Marca"
          value={newReactive.marca}
          onChange={(e) =>
            setNewReactive({ ...newReactive, marca: e.target.value })
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
          value={newReactive.fecha_vencimiento}
          onChange={(e) =>
            setNewReactive({ ...newReactive, fecha_vencimiento: e.target.value })
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
            <Button onClick={saveNewReactive} color="secondary">
              Guardar
            </Button>
          </DialogActions>
      </Dialog>
       {/*Dialog Editar Reactivo*/ }  
      <Dialog open={editReactiveOpen} onClose={closeEditReactive}>
        <DialogTitle>Editar Reactivo</DialogTitle>
          <DialogContent>
          <form>
          <TextField
          label="Nombre"
          value={editReactive.nombre}
          onChange={(e) =>
            setEditReactive({ ...editReactive, nombre: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cantidad"
          type="number"
          value={editReactive.cantidad}
          onChange={(e) =>
            setEditReactive({ ...editReactive, cantidad: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unidades"
          value={editReactive.unidades}
          onChange={(e) =>
            setEditReactive({ ...editReactive, unidades: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Clasificación"
          value={editReactive.clasificacion}
          onChange={(e) =>
            setEditReactive({ ...editReactive, clasificacion: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Código"
          value={editReactive.codigo}
          onChange={(e) =>
            setEditReactive({ ...editReactive, codigo: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Observaciones"
          multiline
          rows={4}
          value={editReactive.observaciones}
          onChange={(e) =>
            setEditReactive({ ...editReactive, observaciones: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Marca"
          value={editReactive.marca}
          onChange={(e) =>
            setEditReactive({ ...editReactive, marca: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        
        <Box display= "flex" justifyContent="space-between" mt="1rem" mb="1rem">
          {/* Dropdown para Categoría */}
          <FormControl >
            <InputLabel htmlFor="category-select">Categoría</InputLabel>
            
            <Select
            
              value={editReactive.categoriaId}
              onChange={handleCategoryEditChange}
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
                value={editReactive.proyectoId}
                onChange={handleProjectEditChange}
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
          value={editReactive.fecha_vencimiento}
          onChange={(e) =>
            setEditReactive({ ...editReactive, fecha_vencimiento: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditReactive} color="secondary">
              Cancelar
            </Button>
            <Button onClick={saveEditedReactive} color="secondary">
              Guardar
    
            </Button>
          </DialogActions>
      </Dialog>
      <Snackbar
                open={updateAlertOpen || deleteAlertOpen|| createAlertOpen}
                autoHideDuration={4000} // Controla cuánto tiempo se muestra la alerta (en milisegundos)
                onClose={handleUpdateAlertClose||handleCreateAlertOpen} // Puedes usar handleDeleteAlertClose para la alerta de eliminación
                >
              <Alert severity={alertSeverity} onClose={handleUpdateAlertClose}>
                {alertMessage}
                </Alert>
            </Snackbar> 
    </Box>
    
  );
};

export default Reactives