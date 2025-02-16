import axios from "axios";

const API = axios.create({
  baseURL: "https://selfish-irita-hasanraza38-9f48365c.koyeb.app/api/v1/auth/",
  withCredentials: true, // Allows cookies to be sent
});

// Interceptor to refresh token if access token expires
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Request new access token using refresh token
        const { data } = await API.post("/auth/refresh-token");
        localStorage.setItem("accessToken", data.accessToken);

        // Retry the failed request
        error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return API(error.config);
      } catch (err) {
        console.error("Session expired. Please log in again.");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
