import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const EquipmentService = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/laboratorio/api/"} ) ,
    reducerPath: "adminApi" ,
    tagTypes: ["User", "Proyects", "Categorys","Reactives","Equipment"],
    endpoints: (build) => ( {
        getEquipment: build.query({
            query: () => `equipos`,
            providesTags: ["Equipos"]
        }),
        createEquipment: build.mutation({
            query: (newEquipment) => ({
              url: 'equipos', // La URL para agregar reactivos
              method: 'POST', // Método POST para agregar
              body: newEquipment, // Datos del nuevo reactivo
            }),
            // Define cómo se etiquetará la caché después de agregar un equipo
            invalidatesTags: ['Equipment'],
        }),
        updateEquipment: build.mutation({
            query: (equipmentData) => ({
              url: `equipos/${equipmentData.id}`, // La URL para agregar Equipos
              method: 'PUT', // Método PUT para editar
              body: equipmentData, // Datos del Equipo
            }),
          
            invalidatesTags: ['Equipment'],
        }),
        deleteEquipment: build.mutation({
            
            query: (id) => ({
              url: `equipos/${id}`, // La URL para eliminar reactivo
              method: 'DELETE', // Método DELETE para eliminar logicamente
             
            }),
            
            invalidatesTags: ['Equipment'],
        }),
        
    }
   
    )
    
})
export const {useGetUserQuery, useCreateUserMutation, useLoginUserMutation,
    useGetProjectsQuery, 
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    /*Categories */
    useGetCategorysQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    /*Reactives*/ 
    useGetReactivesQuery,
    useCreateReactiveMutation,
    useDeleteReactiveMutation,
    useUpdateReactiveMutation,
    /* Equipment*/
    useGetEquipmentQuery,
    useCreateEquipmentMutation,
    useUpdateEquipmentMutation,
    useDeleteEquipmentMutation
    }= EquipmentService