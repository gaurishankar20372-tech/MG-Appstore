import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // पहले से लॉगिन यूज़र की जानकारी प्राप्त करें
  const refreshUser = async () => {
    const token = localStorage.getItem("mg_appstore_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await api.get("/api/auth/me");

      const currentUser = response.data.user;

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      localStorage.removeItem("mg_appstore_token");
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password
        }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Login response अधूरा है।");
      }

      localStorage.setItem(
        "mg_appstore_token",
        token
      );

      setUser(user);

      return {
        success: true,
        user
      };

    } catch (error) {
      return {
        success: false,
        message: error.message || "Login असफल रहा।"
      };
    }
  };

  // Signup
  const register = async (name, email, password) => {
    try {
      const response = await api.post(
        "/api/auth/register",
        {
          name,
          email,
          password
        }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Registration response अधूरा है।");
      }

      localStorage.setItem(
        "mg_appstore_token",
        token
      );

      setUser(user);

      return {
        success: true,
        user
      };

    } catch (error) {
      return {
        success: false,
        message: error.message || "Signup असफल रहा।"
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.warn("Logout API error:", error.message);
    } finally {
      localStorage.removeItem("mg_appstore_token");
      setUser(null);
    }
  };

  // ऐप खुलने पर Login Status जाँचें
  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// किसी भी Component में Authentication इस्तेमाल करें
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth को AuthProvider के अंदर इस्तेमाल करें।"
    );
  }

  return context;
}

export default AuthContext;
