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
    // Lấy trạng thái của dự án
    getProjectStatus: builder.query<any, void>({
      query: () => "project-status/",
      providesTags: ["Project"],
    }),

    // Lấy danh sách bảng (Sheet)
    getSheets: builder.query<any, void>({
      query: () => "sheets/",
      providesTags: ["Sheet"],
    }),

    // Lấy danh sách trạng thái (Status)
    getStatuses: builder.query<any, void>({
      query: () => "statuses/",
      providesTags: ["Status"],
    }),

    // Lấy danh sách công việc (Tasks)
    getTasks: builder.query<any, void>({
      query: () => "tasks/",
      providesTags: ["Task"],
    }),

    // Lấy danh sách bình luận (Comments)
    getComments: builder.query<any, void>({
      query: () => "comments/",
      providesTags: ["Comment"],
    }),

    // Thêm mới dự án
    createProject: builder.mutation<any, { name: string; description: string }>({
      query: (newProject) => ({
        url: "projects/",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: ["Project"],
    }),

    // Cập nhật trạng thái của dự án
    updateProjectStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `project-status/${id}/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Project"],
    }),

    // Xóa một dự án
    deleteProject: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `projects/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

// Export các hooks để sử dụng trong component
export const {
  useGetProjectsQuery,
  useGetProjectDetailQuery,
  useGetProjectStatusQuery,
  useGetSheetsQuery,
  useGetStatusesQuery,
  useGetTasksQuery,
  useGetCommentsQuery,
  useCreateProjectMutation,
  useUpdateProjectStatusMutation,
  useDeleteProjectMutation,
} = apiProject;
