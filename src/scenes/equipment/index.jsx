import React, { useState } from "react";
import { Box, useTheme, IconButton,Button,Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,MenuItem   } from "@mui/material";
import {useGetEquipmentQuery,
  useCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
  useGetProyectsQuery,
  useGetCategorysQuery  } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {EditOutlined , 
  DeleteForeverOutlined,
   } from "@mui/icons-material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DataGridCustomToolBar from "components/DataGridCustomToolBar"

const Equipment = () => {
  const theme = useTheme();
  const [createAlertOpen, setCreateAlertOpen] = useState(false);
  const [updateAlertOpen, setUpdateAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success'); // Puedes cambiar 'success' a 'error' u otro valor según necesites
  const [alertMessage, setAlertMessage] = useState('');

  const { data, isLoading,refetch } = useGetEquipmentQuery();
  const { data: categorysData } = useGetCategorysQuery();
  const { data: proyectsData } = useGetProyectsQuery();

  const [deleteEquipment] = useDeleteEquipmentMutation()
  const [createEquipment] = useCreateEquipmentMutation();
  const [updateEquipment] = useUpdateEquipmentMutation();

  const [addEquipmentOpen, setAddEquipmentOpen] = useState(false);
  const [editEquipmentOpen, setEditEquipmentOpen] = useState(false);

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada
  const [selectedProject, setSelectedProject] = useState(""); // Estado para el proyecto seleccionado
    
  
    const openAddEquipment = () => {
      setAddEquipmentOpen(true);
    };
  
    const closeAddEquipment = () => {
      setAddEquipmentOpen(false);
    };

    const handleEditEquipment = (selectedEquipment) => {
      console.log(selectedEquipment)
      setSelectedEquipment(selectedEquipment);
      openEditEquipment(selectedEquipment); // Abre el diálogo de edición
    };
    const openEditEquipment = (selectedEquipment) => {
      populateEditForm(selectedEquipment); // Llena el formulario de edición con los datos del Equipo seleccionado
      setEditEquipmentOpen(true); // Abre el diálogo de edición
    };
    const closeEditEquipment = () => {
      setEditEquipmentOpen(false);
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
    const handleDeleteAlertClose = () => {
      setDeleteAlertOpen(false);
    };
    const handleCreateAlertOpen = () => {
      setCreateAlertOpen(true);
    };
    const handleCreateAlertClose = () => {
      setDeleteAlertOpen(false);
    };
    const handleCategoryChange = (event) => {
      console.log('categaria seleccionado:', event.target.value)
      setSelectedCategory(event.target.value);
      setNewEquipment({ ...newEquipment, categoriaId: event.target.value })
    };
    const handleCategoryEditChange = (event) => {
      console.log('categaria seleccionado:', event.target.value)
      setSelectedCategory(event.target.value);
      setEditEquipment({ ...editEquipment, categoriaId: event.target.value })
    };
    const handleProjectChange = (event) => {
      console.log('Proyecto seleccionado:', event.target.value)
      setSelectedProject(event.target.value);
      setNewEquipment({ ...newEquipment, proyectoId: event.target.value })
    };
    const handleProjectEditChange = (event) => {
      console.log('Proyecto seleccionado:', event.target.value)
      setSelectedProject(event.target.value);
      setEditEquipment({ ...editEquipment, proyectoId: event.target.value })
    };
      const [newEquipment, setNewEquipment] = useState({
        nombre: "",
        cantidad: 0,
        estado: true,
        unidad: "",
      });
    
    const saveNewEquipment = async () => {
      try {
        const nuevoEquipoData = {
          nombre: newEquipment.nombre,
          cantidad: newEquipment.cantidad,
          estado: newEquipment.estado,
          unidad: newEquipment.unidad,
          categoriaId: newEquipment.categoriaId, // Agrega la categoría seleccionada
          proyectoId: newEquipment.proyectoId,   // Agrega el proyecto seleccionado
        };
        
        // Llama a la función de mutación para crear el nuevo equipo
        const response = await createEquipment(nuevoEquipoData);
        
        if (response.error) {
          console.error('Error al crear el equipo:', response.error);
        } else {
          console.log('Equipo creado con éxito:', response.data);
          handleCreateAlertOpen();
            setAlertSeverity('success');
            setAlertMessage('Equipo creado con éxito.');
            refetch()
          refetch();
        }
      } catch (error) {
        console.error('Error al crear el equipo:', error);
      } finally {
        // Cierra el modal
        closeAddEquipment();
      }
    };
    const [editEquipment, setEditEquipment] = useState({
      id: null,
      nombre: "",
      cantidad: "",
      unidad: "",
      estado: true,
      categoriaId: null,
      proyectoId: null,
    });
    const populateEditForm = (selectedEquipment) => {
      if (selectedEquipment) {
        setEditEquipment({
          id: selectedEquipment.id,
          nombre: selectedEquipment.nombre,
          cantidad: selectedEquipment.cantidad,
          unidad: selectedEquipment.unidades,
          estado: selectedEquipment.estado,
          categoriaId: selectedEquipment.categoriaId,
          proyectoId: selectedEquipment.proyectoId,
        });
      }
    };
    const handleDeleteEquipment = async (id) => {
      try {
        // Muestra una confirmación antes de eliminar
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este Equipo?");
    
        if (confirmed) {
          console.log("Equipo A ELIMINAR",id)
          // Realiza una mutación para cambiar el estado del Equipo a false
          const response = await deleteEquipment(id);
    
          if (response.error) {
            console.error('Error al eliminar el Equipo:', response.error);
          } else {
            console.log('Equipo eliminado con éxito:', response.data);
            handleDeleteAlertOpen();
            setAlertSeverity('success');
            setAlertMessage('Equipo eliminado con éxito.');
            refetch()
          
          }
        }
      } catch (error) {
        console.error('Error al eliminar el Equipo:', error);
      }
    };
    const saveEditedEquipment = async () => {
      try {
        
        const editedEquipmentData = {
          // Los datos del nuevo Equipo que deseas guardar
          id: editEquipment.id,
          nombre: editEquipment.nombre,
          cantidad: editEquipment.cantidad,
          unidad: editEquipment.unidades,
          categoriaId: editEquipment.categoriaId, // Agrega la categoría seleccionada
          proyectoId: editEquipment.proyectoId,   // Agrega el proyecto seleccionado
        };
        // Llama a la función de mutación para crear el nuevo Equipo
        console.log("id save edited",)
        const response = await updateEquipment(editedEquipmentData);
        
        console.log(editedEquipmentData)
        if (response.error) {
          console.error('Error al actualizar el Equipo:', response.error);
        } else {
          console.log('Equipo actualizado con éxito:', response.data);
          handleUpdateAlertOpen();
          setAlertSeverity('success');
          setAlertMessage('Equipo actualizado con éxito.');
          refetch()
        }
      } catch (error) {
        console.error('Error al actualizar el Equipo:', error);
      } finally {
        // Cierra el modal
        closeEditEquipment();
      }
    };
    const columns = [
      {
        field: "id",
        headerName: "ID",
        flex: 0.5,
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
        field: "unidad",
        headerName: "Unidad",
        flex: 0.5,
      },
      {
        field: "categoriaId",
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
              onClick={()=>handleEditEquipment(params.row)}
              aria-label="Editar"
            >
              <EditOutlined />
            </IconButton>
  
            <IconButton
              color="secondary"
              onClick={()=>handleDeleteEquipment(params.row.id)}
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
        <Header title="EQUIPO" subtitle="Lista de los equipos" />
        <Box display="flex" justifyContent="flex-end" mb="1rem">
          <Button
          variant="contained"
          color="secondary"
          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} // Ajustar el tamaño del texto y el espacio interno
          onClick={openAddEquipment}
          >
            Agregar Equipo
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
            components={{Toolbar: DataGridCustomToolBar}}
          />
        </Box>
        
      {/*Dialog Agregar Equipo*/ }  
      <Dialog open={addEquipmentOpen} onClose={closeAddEquipment}>
        <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
          <DialogContent>
          <form>
          <TextField
          label="Nombre"
          value={newEquipment.nombre}
          onChange={(e) =>
            setNewEquipment({ ...newEquipment, nombre: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cantidad"
          type="number"
          value={newEquipment.cantidad}
          onChange={(e) =>
            setNewEquipment({ ...newEquipment, cantidad: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unidad"
          value={newEquipment.unidad}
          onChange={(e) =>
            setNewEquipment({ ...newEquipment, unidad: e.target.value })
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
        </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAddEquipment} color="secondary">
              Cancelar
            </Button>
            <Button onClick={saveNewEquipment} color="secondary">
              Guardar
            </Button>
          </DialogActions>
      </Dialog>
       {/*Dialog Editar Equipo*/ }  
       <Dialog open={editEquipmentOpen} onClose={closeEditEquipment}>
        <DialogTitle>Editar Equipo</DialogTitle>
          <DialogContent>
          <form>
          <TextField
          label="Nombre"
          value={editEquipment.nombre}
          onChange={(e) =>
            setEditEquipment({ ...editEquipment, nombre: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cantidad"
          type="number"
          value={editEquipment.cantidad}
          onChange={(e) =>
            setEditEquipment({ ...editEquipment, cantidad: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unidad"
          value={editEquipment.unidad}
          onChange={(e) =>
            setEditEquipment({ ...editEquipment, unidad: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        
        
        <Box display= "flex" justifyContent="space-between" mt="1rem" mb="1rem">
          {/* Dropdown para Categoría */}
          <FormControl >
            <InputLabel htmlFor="category-select">Categoría</InputLabel>
            
            <Select
            
              value={editEquipment.categoriaId}
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
                value={editEquipment.proyectoId}
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

        </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditEquipment} color="secondary">
              Cancelar
            </Button>
            
            <Button onClick={saveEditedEquipment} color="secondary">
              Guardar
    
            </Button>
            
          </DialogActions>
          </Dialog>
      <Snackbar
                open={updateAlertOpen || deleteAlertOpen|| createAlertOpen}
                autoHideDuration={4000} // Controla cuánto tiempo se muestra la alerta (en milisegundos)
                onClose={handleUpdateAlertClose||handleCreateAlertClose} // Puedes usar handleDeleteAlertClose para la alerta de eliminación
                >
              <Alert severity={alertSeverity} onClose={handleUpdateAlertClose}>
                {alertMessage}
                </Alert>
      </Snackbar> 
    </Box>
    
  );
};

export default Equipment