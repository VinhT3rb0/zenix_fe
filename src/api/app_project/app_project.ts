import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessTokenFromCookie } from '@/utils/token';

// Base URL từ Django API
export const apiProject = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/app-project/v1/`,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = getAccessTokenFromCookie();
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  reducerPath: 'projectApi',
  tagTypes: ['Project', 'Task', 'Sheet', 'Comment', 'Status', 'User'],
  endpoints: (builder) => ({
    // Lấy danh sách dự án
    getProjects: builder.query<any, void>({
      query: () => 'projects/',
      providesTags: ['Project'],
    }),
    getProjectDetail: builder.query<any, string>({
      query: (projectId) => `projects/${projectId}/`,
      providesTags: ['Project'],
    }),
    // Lấy trạng thái của tất cả dự án
    getAllProjectStatuses: builder.query<any, void>({
      query: () => 'project-status/',
      providesTags: ['Status'],
    }),
    // Lấy trạng thái của dự án bằng id dự án
    getProjectStatus: builder.query<any, { projectId: string }>({
      query: ({ projectId }) => `project-status/${projectId}/`,
      providesTags: ['Status'],
    }),
    getSheets: builder.query<any, void>({
      query: () => 'sheets/',
      providesTags: ['Sheet'],
    }),
    // lấy trạng thái của task
    getStatuses: builder.query<any, void>({
      query: () => 'statuses/',
      providesTags: ['Status'],
    }),
    getStatusesById: builder.query<any, { id: string }>({
      query: ({ id }) => `statuses/${id}/`,
      providesTags: ['Status'],
    }),
    getTasks: builder.query<any, void>({
      query: () => 'tasks/',
      providesTags: ['Task'],
    }),
    getComments: builder.query<any, void>({
      query: () => 'comments/',
      providesTags: ['Comment'],
    }),
    createProject: builder.mutation<any, { name: string; description: string }>(
      {
        query: (newProject) => ({
          url: 'projects/',
          method: 'POST',
          body: newProject,
        }),
        invalidatesTags: ['Project'],
      }
    ),
    createSheets: builder.mutation<any, { name: string; project: string }>({
      query: (newSheet) => ({
        url: 'sheets/',
        method: 'POST',
        body: newSheet,
      }),
    }),
    createTasks: builder.mutation<
      any,
      { title: string; assignees: string[]; sheet: string; project: string }
    >({
      query: (data) => ({
        url: 'tasks/',
        method: 'POST',
        body: data,
      }),
    }),
    updateProjectStatus: builder.mutation<
      any,
      { id: string; status: number }
    >({
      query: ({ id, status }) => ({
        url: `projects/${id}/`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<
      any,
      { id: string; name: string; description: string }
    >({
      query: ({ id, name, description }) => ({
        url: `projects/${id}/`,
        method: 'PUT',
        body: { name, description },
      }),
      invalidatesTags: ['Project'],
    }),
    updateTask: builder.mutation<any, { id: string; title: string; assignees_names: string[]; status: number }>({
      query: ({ id, ...data }) => ({
        url: `tasks/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteProject: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `projects/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
    deleteSheet: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `sheets/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sheet'],
    }),
    deleteTask: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `tasks/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
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
  useUpdateTaskMutation,
  useCreateSheetsMutation,
  useCreateTasksMutation,
  useDeleteProjectMutation,
  useDeleteSheetMutation,
  useDeleteTaskMutation,
  useGetStatusesByIdQuery,
} = apiProject;
