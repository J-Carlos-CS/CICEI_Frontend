import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const ReactiveService = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/laboratorio/api/"} ) ,
    reducerPath: "adminApi" ,
    tagTypes: ["User", "Proyects", "Categorys","Reactives","Equipment"],
    endpoints: (build) => ( {
        
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
        
    }
   
    )
    
})
export const {

    useGetReactivesQuery,
    useCreateReactiveMutation,
    useDeleteReactiveMutation,
    useUpdateReactiveMutation,
    }= ReactiveService