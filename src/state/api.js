import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://146.190.144.202:9000/laboratorio/api" }),

  reducerPath: "adminApi",
  tagTypes: ["User", "Proyects", "Categorys", "Reactives", "Equipment"],
  endpoints: (build) => ({
    //Users
    getUser: build.query({
      query: (id) => `user/${id}`,
      providesTags: ["User"],
    }),

    createUser: build.mutation({
      query: (user) => ({
        url: "user",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),

    loginUser: build.mutation({
      query: (userCredentials) => ({
        url: "login",
        method: "POST",
        body: userCredentials,
      }),
    }),

    //Projects
    getProjects: build.query({
      query: () => `proyectos`,
      providesTags: ["Proyects"],
    }),

    createProject: build.mutation({
      query: (newProyect) => ({
        // La URL para agregar proyectos
        url: "proyectos",
        // Método POST para agregar
        method: "POST",
        // Datos del nuevo project
        body: newProyect,
      }),
      // Define cómo se etiquetará la caché después de agregar una proyecto
      invalidatesTags: ["Proyects"],
    }),

    updateProject: build.mutation({
      query: (projectData) => ({
        url: `proyectos/${projectData.id}`, // La URL para agregar categorias
        method: "PUT", // Método PUT para agregar
        body: projectData, // Datos de la categroia
      }),
      // Define cómo se etiquetará la caché después de agregar una categoria
      invalidatesTags: ["Categorys"],
    }),

    deleteProject: build.mutation({
      query: (id) => ({
        url: `proyectos/${id}`, // La URL para eliminar proyectos
        method: "DELETE", // Método PUT para eliminar
      }),
      // Define cómo se etiquetará la caché después de agregar una proyecto
      invalidatesTags: ["Categorys"],
    }),

    //Categorias
    getCategorys: build.query({
      query: () => `categorias`,
      providesTags: ["Categorys"],
    }),
    createCategory: build.mutation({
      query: (newCategory) => ({
        url: "categorias", // La URL para agregar categorias
        method: "POST", // Método POST para agregar
        body: newCategory, // Datos de la nueva catego
      }),
      // Define cómo se etiquetará la caché después de agregar una categoria
      invalidatesTags: ["Categorys"],
    }),
    updateCategory: build.mutation({
      query: (categoryData) => ({
        url: `categorias/${categoryData.id}`, // La URL para agregar categorias
        method: "PUT", // Método PUT para agregar
        body: categoryData, // Datos de la categroia
      }),
      // Define cómo se etiquetará la caché después de agregar una categoria
      invalidatesTags: ["Categorys"],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `categorias/${id}`, // La URL para agregar categorias
        method: "DELETE", // Método PUT para eliminar
      }),
      // Define cómo se etiquetará la caché después de agregar una categoria
      invalidatesTags: ["Categorys"],
    }),
    createReactive: build.mutation({
      query: (nuevoReactivo) => ({
        url: "reactivos", // La URL para agregar reactivos
        method: "POST", // Método POST para agregar
        body: nuevoReactivo, // Datos del nuevo reactivo
      }),
      // Define cómo se etiquetará la caché después de agregar un reactivo
      invalidatesTags: ["Reactives"],
    }),
    getReactives: build.query({
      query: () => `reactivos`,
      providesTags: ["Reactivos"],
    }),
    deleteReactive: build.mutation({
      query: (id) => ({
        url: `reactivos/${id}`, // La URL para eliminar reactivo
        method: "DELETE", // Método DELETE para eliminar logicamente
      }),
      // Define cómo se etiquetará la caché después de agregar un reactivo
      invalidatesTags: ["Reactives"],
    }),
    updateReactive: build.mutation({
      query: (reactiveData) => ({
        url: `reactivos/${reactiveData.id}`,
        method: "PUT",
        body: reactiveData,
      }),
      invalidatesTags: ["Reactivos"],
    }),
    getEquipment: build.query({
      query: () => `equipos`,
      providesTags: ["Equipos"],
    }),
    createEquipment: build.mutation({
      query: (newEquipment) => ({
        url: "equipos", // La URL para agregar reactivos
        method: "POST", // Método POST para agregar
        body: newEquipment, // Datos del nuevo reactivo
      }),
      // Define cómo se etiquetará la caché después de agregar un equipo
      invalidatesTags: ["Equipment"],
    }),
    updateEquipment: build.mutation({
      query: (equipmentData) => ({
        url: `equipos/${equipmentData.id}`, // La URL para agregar Equipos
        method: "PUT", // Método PUT para editar
        body: equipmentData, // Datos del Equipo
      }),

      invalidatesTags: ["Equipment"],
    }),
    deleteEquipment: build.mutation({
      query: (id) => ({
        url: `equipos/${id}`, // La URL para eliminar reactivo
        method: "DELETE", // Método DELETE para eliminar logicamente
      }),

      invalidatesTags: ["Equipment"],
    }),
  }),
});
export const {
  useGetUserQuery,
  useCreateUserMutation,
  useLoginUserMutation,
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
  useDeleteEquipmentMutation,
} = api;
