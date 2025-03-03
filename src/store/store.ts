import { configureStore } from "@reduxjs/toolkit";
import { apiLogin } from "@/api/app_home/app_home";
import { apiProject } from "@/api/app_project/app_project";

const store = configureStore({
  reducer: {
    [apiLogin.reducerPath]: apiLogin.reducer,
    [apiProject.reducerPath]: apiProject.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiLogin.middleware, apiProject.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;


