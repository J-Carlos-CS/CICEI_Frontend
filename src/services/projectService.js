import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const ProjectService = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/laboratorio/api/"} ) ,
    reducerPath: "adminApi" ,
    tagTypes: ["User", "Proyects", "Categorys","Reactives","Equipment"],
    
    endpoints: (build) => ( {
       
        //Projects
        getProjects: build.query({
            query: () => `proyectos`,
            providesTags: ["Proyects"]
            
        }),

        createProject: build.mutation({
          query: (newProyect) => ({
            // La URL para agregar proyectos
            url: 'proyectos', 
            // Método POST para agregar
            method: 'POST', 
            // Datos del nuevo project
            body: newProyect, 
          }),
          // Define cómo se etiquetará la caché después de agregar una proyecto
          invalidatesTags: ['Proyects'],
        }),
        
        updateProject: build.mutation({
          query: (projectData) => ({
            url: `proyectos/${projectData.id}`, // La URL para agregar categorias
            method: 'PUT', // Método PUT para agregar
            body: projectData, // Datos de la categroia
          }),
          // Define cómo se etiquetará la caché después de agregar una categoria
          invalidatesTags: ['Categorys'],
        }),

        deleteProject: build.mutation({
          query: (id) => ({
            url: `proyectos/${id}`, // La URL para eliminar proyectos
            method: 'DELETE', // Método PUT para eliminar
            
          }),
          // Define cómo se etiquetará la caché después de agregar una proyecto
          invalidatesTags: ['Categorys'],
        }),
      }
    
    )})
export const {
    useGetProjectsQuery, 
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    }= ProjectService