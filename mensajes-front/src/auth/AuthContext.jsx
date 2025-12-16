import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [proveedor, setProveedor] = useState(() => {
    const stored = localStorage.getItem("proveedor");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const res = await api.post("/login/", {
      email: email,
      password: password,
    });

    // Guardar tokens PRIMERO para que el interceptor los use
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    // Guardar info de usuario extendida
    const userData = {
      email,
      is_staff: res.data.is_staff,
      is_superuser: res.data.is_superuser,
      user_id: res.data.user_id,
      username: res.data.username,
      first_name: res.data.first_name,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // Cargar información del proveedor automáticamente (ahora con token disponible)
    try {
      const proveedorRes = await api.get("/user/proveedor/");
      console.log("Respuesta proveedor:", proveedorRes.data);
      if (proveedorRes.data.has_proveedor) {
        localStorage.setItem("proveedor", JSON.stringify(proveedorRes.data.proveedor));
        setProveedor(proveedorRes.data.proveedor);
      } else {
        console.log("Usuario sin proveedor asignado");
        setProveedor(null);
        localStorage.removeItem("proveedor");
      }
    } catch (err) {
      console.error("Error cargando proveedor:", err);
      setProveedor(null);
      localStorage.removeItem("proveedor");
    }
  };

  const register = async (name, email, password) => {
    await api.post("/register/", { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("proveedor");
    setUser(null);
    setProveedor(null);
  };

  return (
    <AuthContext.Provider value={{ user, proveedor, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
