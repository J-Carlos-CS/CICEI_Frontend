import React, { useState } from "react";
import { Box, useTheme, IconButton,Button,Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,MenuItem,
   } from "@mui/material";

import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetCategorysQuery  } from "services/categoryService";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {EditOutlined , 
  DeleteForeverOutlined } from "@mui/icons-material";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Categorys
  = () => {
  const theme = useTheme();

  const [createAlertOpen, setCreateAlertOpen] = useState(false);
  const [updateAlertOpen, setUpdateAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success'); // Puedes cambiar 'success' a 'error' u otro valor según necesites
  const [alertMessage, setAlertMessage] = useState('');
  
  
  const { data, isLoading,refetch } = useGetCategorysQuery();

  const [deleteCategory] = useDeleteCategoryMutation()
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  
    
  
    const openAddCategory = () => {
      setAddCategoryOpen(true);
    };
  
    const closeAddCategory = () => {
      setAddCategoryOpen(false);
    };

    const handleEditCategory = (selectedCategory) => {
      console.log(selectedCategory)
      setSelectedCategory(selectedCategory);
      openEditCategory(selectedCategory); // Abre el diálogo de edición
    };
    const openEditCategory = (selectedCategory) => {
      populateEditForm(selectedCategory); // Llena el formulario de edición con los datos del categoria seleccionado
      setEditCategoryOpen(true); // Abre el diálogo de edición
    };
    const closeEditCategory = () => {
      setEditCategoryOpen(false);
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
      setCreateAlertOpen(false);
    };
    
   

      const [newCategory, setNewCategory] = useState({
        categoria: "",
        estado: true,
      });
    
    const saveNewCategory = async () => {
      try {
        const newCategoryData = {
          categoria: newCategory.categoria,
         

        };
        
        // Llama a la función de mutación para crear el nuevo categoria
        const response = await createCategory(newCategoryData);
        
        if (response.error) {
          console.error('Error al crear el categoria:', response.error);
        } else {
          console.log('categoria creado con éxito:', response.data);
          handleCreateAlertOpen();
            setAlertSeverity('success');
            setAlertMessage('categoria creado con éxito.');
            refetch()
   
        }
      } catch (error) {
        console.error('Error al crear el categoria:', error);
      } finally {
        // Cierra el modal
        closeAddCategory();
      }
    };
    const [editCategory, setEditCategory] = useState({
      
      categoria: "",
      
      estado: true,

    });
    const populateEditForm = (selectedCategory) => {
      if (selectedCategory) {
        setEditCategory({
          id: selectedCategory.id,
          categoria: selectedCategory.categoria,
        });
      }
    };
    const handleDeleteCategory = async (id) => {
      try {
        // Muestra una confirmación antes de eliminar
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este categoria?");
    
        if (confirmed) {
          console.log("categoria A ELIMINAR",id)
          // Realiza una mutación para cambiar el estado del categoria a false
          const response = await deleteCategory(id);
    
          if (response.error) {
            console.error('Error al eliminar el categoria:', response.error);
          } else {
            console.log('categoria eliminado con éxito:', response.data);
            handleDeleteAlertOpen();
            setAlertSeverity('success');
            setAlertMessage('categoria eliminado con éxito.');
            refetch()
          
          }
        }
      } catch (error) {
        console.error('Error al eliminar el categoria:', error);
      }
    };
    const saveEditedCategory = async () => {
      try {
        
        const editedCategoryData = {
          // Los datos del nuevo categoria que deseas guardar
          id: editCategory.id,
          categoria: editCategory.categoria,
        
        };
        // Llama a la función de mutación para crear el nuevo categoria
        console.log("id save edited",)
        const response = await updateCategory(editedCategoryData);
        
        console.log(editedCategoryData)
        if (response.error) {
          console.error('Error al actualizar el categoria:', response.error);
        } else {
          console.log('categoria actualizado con éxito:', response.data);
          handleUpdateAlertOpen();
          setAlertSeverity('success');
          setAlertMessage('categoria actualizado con éxito.');
          refetch()
        }
      } catch (error) {
        console.error('Error al actualizar el categoria:', error);
      } finally {
        // Cierra el modal
        closeEditCategory();
      }
    };
  const columns = [
    
    {
      field: "categoria",
      headerName: "Categoria",
      flex: 0.5,
    },
   
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
      renderCell: (params) => (
      <Box>
          <IconButton
            color="secondary"
            onClick={()=>handleEditCategory(params.row)}
            aria-label="Editar"
          >
            <EditOutlined />
          </IconButton>

          <IconButton
            color="secondary"
            onClick={()=>handleDeleteCategory(params.row.id)}
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
      <Header title="CATEGORIAS" subtitle="Lista de las Categorias" />
      <Box display="flex" justifyContent="flex-end" mb="1rem">
          <Button
          variant="contained"
          color="secondary"
          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} // Ajustar el tamaño del texto y el espacio interno
          onClick={openAddCategory}
          >
            Agregar categoria
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
        />
      </Box>
      {/*Dialog Agregar categoria*/ }  
      <Dialog open={addCategoryOpen} onClose={closeAddCategory}>
        <DialogTitle>Agregar Nuevo categoria</DialogTitle>
          <DialogContent>
          <form>
          <TextField
          label="Nombre"
          value={newCategory.categoria}
          onChange={(e) =>
            setNewCategory({ ...newCategory, categoria: e.target.value })
          }
          fullWidth
          margin="normal"
        />
      
        
       </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAddCategory} color="secondary">
              Cancelar
            </Button>
            <Button onClick={saveNewCategory} color="secondary">
              Guardar
            </Button>
          </DialogActions>
      </Dialog>
      {/*Dialog Editar categoria*/ }  
      <Dialog open={editCategoryOpen} onClose={closeEditCategory}>
        <DialogTitle>Editar categoria</DialogTitle>
          <DialogContent>
          <form>
          <TextField
          label="Nombre"
          value={editCategory.categoria}
          onChange={(e) =>
            setEditCategory({ ...editCategory, categoria: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        
        </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditCategory} color="secondary">
              Cancelar
            </Button>
            
            <Button onClick={saveEditedCategory} color="secondary">
              Guardar
    
            </Button>
            
          </DialogActions>
          </Dialog>
          <Snackbar
                open={createAlertOpen}
                autoHideDuration={4000} // Controla cuánto tiempo se muestra la alerta (en milisegundos)
                onClose={handleCreateAlertClose} // Puedes usar handleDeleteAlertClose para la alerta de eliminación
                >
              <Alert severity={alertSeverity} onClose={handleCreateAlertClose}>
                {alertMessage}
                </Alert>
      </Snackbar> 
      <Snackbar
                open={updateAlertOpen}
                autoHideDuration={4000} // Controla cuánto tiempo se muestra la alerta (en milisegundos)
                onClose={handleUpdateAlertClose} // Puedes usar handleDeleteAlertClose para la alerta de eliminación
                >
              <Alert severity={alertSeverity} onClose={handleUpdateAlertClose}>
                {alertMessage}
                </Alert>
      </Snackbar> 
      <Snackbar
                open={deleteAlertOpen}
                autoHideDuration={4000} // Controla cuánto tiempo se muestra la alerta (en milisegundos)
                onClose={handleDeleteAlertClose} // Puedes usar handleDeleteAlertClose para la alerta de eliminación
                >
              <Alert severity={alertSeverity} onClose={handleDeleteAlertClose}>
                {alertMessage}
                </Alert>
      </Snackbar> 
    </Box>
  );
};

export default Categorys
