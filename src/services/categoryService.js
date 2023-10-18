import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const CategoryService = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/laboratorio/api/"} ) ,
    reducerPath: "adminApi" ,
    tagTypes: ["User", "Proyects", "Categorys","Reactives","Equipment"],
    endpoints: (build) => ( {
        

          //Categorias
        getCategorys: build.query({
            query: () => `categorias`,
            providesTags: ["Categorys"]
            
        }),
        createCategory: build.mutation({
          query: (newCategory) => ({
            url: 'categorias', // La URL para agregar categorias
            method: 'POST', // Método POST para agregar
            body: newCategory, // Datos de la nueva catego
          }),
          // Define cómo se etiquetará la caché después de agregar una categoria
          invalidatesTags: ['Categorys'],
        }),
        updateCategory: build.mutation({
          query: (categoryData) => ({
            url: `categorias/${categoryData.id}`, // La URL para agregar categorias
            method: 'PUT', // Método PUT para agregar
            body: categoryData, // Datos de la categroia
          }),
          // Define cómo se etiquetará la caché después de agregar una categoria
          invalidatesTags: ['Categorys'],
        }),
        deleteCategory: build.mutation({
          query: (id) => ({
            url: `categorias/${id}`, // La URL para agregar categorias
            method: 'DELETE', // Método PUT para eliminar
            
          }),
          // Define cómo se etiquetará la caché después de agregar una categoria
          invalidatesTags: ['Categorys'],
        }),
       
        
    }
   
    )
    
})
export const {
    useGetCategorysQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    }= CategoryService