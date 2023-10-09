import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,Dialog
} from "@mui/material";
import Header from "components/Header";
import { useGetProjectsQuery,useCreateProjectMutation,useUpdateProjectMutation,useDeleteProjectMutation } from "state/api";
import {EditOutlined , 
  DeleteForeverOutlined,
   } from "@mui/icons-material";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Proyect = ({
  id,
  proyecto,
  descripcion,
  onEditClick,
  onDeleteClick
  
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
    {Project}
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
      <IconButton
              color="secondary"
              onClick={()=>onEditClick({ id, proyecto, descripcion })}
              aria-label="Editar"
            >
              <EditOutlined />
            </IconButton>
  
            <IconButton
              color="secondary"
              onClick={()=>onDeleteClick(id)}
              aria-label="Eliminar"
            >
              <DeleteForeverOutlined/>
            </IconButton>
      </CardActions>
  
    </Card>
  );
};


const Proyects = () => {
  
  const [deleteProject] = useDeleteProjectMutation()
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  
  const { data, isLoading,refetch } = useGetProjectsQuery();

  const [createAlertOpen, setCreateAlertOpen] = useState(false);
  const [updateAlertOpen, setUpdateAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success'); // Puedes cambiar 'success' a 'error' u otro valor según necesites
  const [alertMessage, setAlertMessage] = useState('');
  
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [selectedProject, setselectedProject] = useState(null);
  const openAddProject = () => {
    setAddProjectOpen(true);
  };

  const closeAddProject = () => {
    setAddProjectOpen(false);
  };

  const handleEditProject = (selectedProject) => {
    console.log(selectedProject)
    setselectedProject(selectedProject);
    openEditProject(selectedProject); // Abre el diálogo de edición
  };
  
  const openEditProject = (selectedProject) => {
    populateEditForm(selectedProject); // Llena el formulario de edición con los datos del proyecto seleccionado
    setEditProjectOpen(true); // Abre el diálogo de edición
  };
  const closeEditProject = () => {
    setEditProjectOpen(false);
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
  
 

    const [newProject, setNewProject] = useState({
      proyecto: "",
      estado: true,
    });
  
  const saveNewProject = async () => {
    try {
      const newProjectData = {
        proyecto: newProject.proyecto,
    

      };
      
      // Llama a la función de mutación para crear el nuevo proyecto
      const response = await createProject(newProjectData);
      
      if (response.error) {
        console.error('Error al crear el proyecto:', response.error);
      } else {
        console.log('proyecto creado con éxito:', response.data);
        handleCreateAlertOpen();
          setAlertSeverity('success');
          setAlertMessage('proyecto creado con éxito.');
          refetch()
        refetch();
      }
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
    } finally {
      // Cierra el modal
      closeAddProject();
    }
  };
  const [editProject, setEditProject] = useState({


    proyecto: "",
    estado: true,

  });
  const populateEditForm = (selectedProject) => {
    if (selectedProject) {
      setEditProject({
        id: selectedProject.id,
        proyecto: selectedProject.proyecto,
      });
    }
  };
  const handleDeleteProject = async (id) => {
    try {
      console.log("proyecto A ELIMINAR",id)
      // Muestra una confirmación antes de eliminar
      const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este proyecto?");
  
      if (confirmed) {
        console.log("proyecto A ELIMINAR",id)
        // Realiza una mutación para cambiar el estado del proyecto a false
        const response = await deleteProject(id);
  
        if (response.error) {
          console.error('Error al eliminar el proyecto:', response.error);
        } else {
          console.log('proyecto eliminado con éxito:', response.data);
          handleDeleteAlertOpen();
          setAlertSeverity('success');
          setAlertMessage('proyecto eliminado con éxito.');
          refetch()
        
        }
      }
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
    }
  };
  const saveEditedProject = async () => {
    try {
      
      const editedProjectData = {
        // Los datos del nuevo proyecto que deseas guardar
        id: editProject.id,
        proyecto: editProject.proyecto,
      
      };
      // Llama a la función de mutación para crear el nuevo proyecto
      console.log("id save edited",)
      const response = await updateProject(editedProjectData);
      
      console.log(editedProjectData)
      if (response.error) {
        console.error('Error al actualizar el proyecto:', response.error);
      } else {
        console.log('proyecto actualizado con éxito:', response.data);
        handleUpdateAlertOpen();
        setAlertSeverity('success');
        setAlertMessage('proyecto actualizado con éxito.');
        refetch()
      }
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
    } finally {
      // Cierra el modal
      closeEditProject();
    }
  };
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  console.log("data",data)
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PROYECTOS" subtitle="Lista de los Proyectos" />
      <Box display="flex" justifyContent="flex-end" mb="1rem">
          <Button
          variant="contained"
          color="secondary"
          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }} // Ajustar el tamaño del texto y el espacio interno
          onClick={openAddProject}
          >
            Agregar proyecto
          </Button>
        </Box>
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
                onEditClick={handleEditProject}
                onDeleteClick={handleDeleteProject}
              />
            )
          )}{/*Dialog Agregar proyecto*/ }  
      <Dialog open={addProjectOpen} onClose={closeAddProject}>
        <DialogTitle>Agregar Nuevo proyecto</DialogTitle>
          <DialogContent>
          <form>
          <TextField
          label="Nombre"
          value={newProject.proyecto}
          onChange={(e) =>
            setNewProject({ ...newProject, proyecto: e.target.value })
          }
          fullWidth
          margin="normal"
        />
      
        
       </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAddProject} color="secondary">
              Cancelar
            </Button>
            <Button onClick={saveNewProject} color="secondary">
              Guardar
            </Button>
          </DialogActions>
      </Dialog>
      {/*Dialog Editar proyecto*/ }  
      <Dialog open={editProjectOpen} onClose={closeEditProject}>
        <DialogTitle>Editar proyecto</DialogTitle>
          <DialogContent>
          <form>
          <TextField
          label="Nombre"
          value={editProject.proyecto}
          onChange={(e) =>
            setEditProject({ ...editProject, proyecto: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        
        </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditProject} color="secondary">
              Cancelar
            </Button>
            
            <Button onClick={saveEditedProject} color="secondary">
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
      ) : (
        <>Loading...</>
      )}
      
    </Box>
  );
};

export default Proyects;
