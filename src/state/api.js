import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/laboratorio/api/"} ) ,
    reducerPath: "adminApi" ,
    tagTypes: ["User", "Proyects", "Categorys","Reactives"],
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
        getEquipment: build.query({
            query: () => `equipos`,
            providesTags: ["Equipos"]
        })
        
    }
   
    )
    
})

export const {useGetUserQuery,useGetProyectsQuery, useGetCategorysQuery, useGetReactivesQuery,useCreateReactiveMutation,useGetEquipmentQuery}= api