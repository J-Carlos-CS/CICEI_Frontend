import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/laboratorio/api/"} ) ,
    reducerPath: "adminApi" ,
    tagTypes: ["User", "Proyects", "Categorys","Reactives","Equipment"],
    endpoints: (build) => ( {
        getUser: build.query({
            query: (id) => `user/${id}`,
            providesTags: ["User"]
            
        
        }),
        getProyects: build.query({
            query: () => `proyectos`,
            providesTags: ["Proyects"]
            
        
        }),
        getCategorys: build.query({
            query: () => `categorias`,
            providesTags: ["Categorys"]
            
        }),
        createReactive: build.mutation({
            query: (nuevoReactivo) => ({
              url: 'reactivos', // La URL para agregar reactivos
              method: 'POST', // Método POST para agregar
              body: nuevoReactivo, // Datos del nuevo reactivo
            }),
            // Define cómo se etiquetará la caché después de agregar un reactivo
            invalidatesTags: ['Reactives'],
        }),
        getReactives: build.query({
            query: () => `reactivos`,
            providesTags: ["Reactivos"]
            
        }),
        deleteReactive: build.mutation({
            
            query: (id) => ({
              url: `reactivos/${id}`, // La URL para eliminar reactivo
              method: 'DELETE', // Método DELETE para eliminar logicamente
             
            }),
            // Define cómo se etiquetará la caché después de agregar un reactivo
            invalidatesTags: ['Reactives'],
        }),
        updateReactive: build.mutation({
            query: (reactiveData) => ({
              url: `reactivos/${reactiveData.id}`,
              method: 'PUT',
              body: reactiveData,
            }),
            invalidatesTags: ['Reactivos'],
          }),
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
export const {useGetUserQuery,
    useGetProyectsQuery, 
    useGetCategorysQuery,
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
    }= api