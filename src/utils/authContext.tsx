import { createContext, useState, useEffect, ReactNode } from "react";
import API from "./axiosInstance";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/getdashboard");
        setUser(data.user);
      } catch (error) {
        console.error("Not logged in");
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await API.post("/loginuser", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.data);
  };

  const logout = async () => {
    await API.post("/logoutuser");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
