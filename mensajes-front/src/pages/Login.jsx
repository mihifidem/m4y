import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      nav("/");
    } catch {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[rgba(247,221,226,0.6)]">
      <form
        onSubmit={handleSubmit}
        className="card-romantic w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-[#E86B87]">
          💌 Inicia sesión
        </h2>

        <input
          type="email"
          placeholder="Tu email"
          className="input-romantic"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Tu contraseña"
          className="input-romantic"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn-romantic w-full">Entrar</button>
      </form>
    </div>
  );
}
