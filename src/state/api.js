import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/laboratorio/api/"} ) ,
    reducerPath: "adminApi" ,
    tagTypes: ["User", "Proyects", "Categorys"],
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
        getReactives: build.query({
            query: () => `reactivos`,
            providesTags: ["Reactivos"]
            
        
        })
    }
   
    )
    
})

export const {useGetUserQuery,useGetProyectsQuery, useGetCategorysQuery}= api