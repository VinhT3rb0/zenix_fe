import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "@/utils/token";

// Base URL từ Django API
export const apiProject = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/app-project/v1/`,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = getAccessTokenFromCookie();
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "projectApi",
  tagTypes: ["Project", "Task", "Sheet", "Comment", "Status"],
  endpoints: (builder) => ({
    // Lấy danh sách dự án
    getProjects: builder.query<any, void>({
      query: () => "projects/",
      providesTags: ["Project"],
    }),
    getProjectDetail: builder.query<any, string>({
      query: (projectId) => `projects/${projectId}/`,
      providesTags: ["Project"],
    }),
    // Lấy trạng thái của tất cả dự án
    getAllProjectStatuses: builder.query<any, void>({
      query: () => "project-status/",
      providesTags: ["Status"],
    }),
    // Lấy trạng thái của dự án bằng id dự án
    getProjectStatus: builder.query<any, { projectId: string }>({
      query: ({ projectId }) => `project-status/${projectId}/`,
      providesTags: ["Status"],
    }),
    getSheets: builder.query<any, void>({
      query: () => "sheets/",
      providesTags: ["Sheet"],
    }),
    getStatuses: builder.query<any, void>({
      query: () => "statuses/",
      providesTags: ["Status"],
    }),
    getTasks: builder.query<any, void>({
      query: () => "tasks/",
      providesTags: ["Task"],
    }),
    getComments: builder.query<any, void>({
      query: () => "comments/",
      providesTags: ["Comment"],
    }),
    createProject: builder.mutation<any, { name: string; description: string }>({
      query: (newProject) => ({
        url: "projects/",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProjectStatus: builder.mutation<any, { id: string; name: string; color: string; user: number }>({
      query: ({ id, name, color, user }) => ({
        url: `project-status/${id}/`,
        method: "PUT",
        body: { name, color, user },
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation<any, { id: string; name: string; description: string }>({
      query: ({ id, name, description }) => ({
        url: `projects/${id}/`,
        method: "PUT",
        body: { name, description },
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `projects/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectDetailQuery,
  useGetProjectStatusQuery,
  useGetAllProjectStatusesQuery,
  useGetSheetsQuery,
  useGetStatusesQuery,
  useGetTasksQuery,
  useGetCommentsQuery,
  useCreateProjectMutation,
  useUpdateProjectStatusMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = apiProject;