import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const UserService = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/laboratorio/api/"} ) ,
    reducerPath: "adminApi" ,
    tagTypes: ["User", "Proyects", "Categorys","Reactives","Equipment"],
    endpoints: (build) => ( {
        //Users
        getUser: build.query({
          query: (id) => `user/${id}`,
          providesTags: ['User'],
        }),
    
        createUser: build.mutation({
          query: (user) => ({
            url: 'user',
            method: 'POST',
            body: user,
          }),
          invalidatesTags: ['User'],
        }),
    
        loginUser: build.mutation({
          query: (userCredentials) => ({
            url: 'login',
            method: 'POST',
            body: userCredentials,
          }),
        }),
        
    }
    )
    
})
export const {useGetUserQuery, useCreateUserMutation, useLoginUserMutation,
    }= UserService