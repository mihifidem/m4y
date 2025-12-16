import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminCodes() {
  const [codes, setCodes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/codes/");
      setCodes(res.data);
    } catch (err) {
      setError("Error cargando códigos");
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newCode) return;
    try {
      await api.post("/codes/", { code: newCode });
      setNewCode("");
      fetchCodes();
    } catch (err) {
      setError("Error creando código");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/codes/${id}/`);
      fetchCodes();
    } catch (err) {
      setError("Error borrando código");
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await api.patch(`/codes/${id}/`, { is_active: !isActive });
      fetchCodes();
    } catch (err) {
      setError("Error actualizando código");
    }
  };

  // Filtrado local por código o email (si existe en el objeto)
  const filteredCodes = codes.filter(c => {
    const searchLower = search.toLowerCase();
    // Extraer prefijo (primeros 4 caracteres antes de guion)
    const prefix = c.code.split("-")[0]?.toLowerCase() || "";
    return (
      c.code.toLowerCase().includes(searchLower) ||
      prefix.includes(searchLower) ||
      (c.message && c.message.buyer_email && c.message.buyer_email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Gestión de Códigos</h2>
      <div className="mb-4 flex gap-2">
        <input
          className="border px-2 py-1 rounded"
          value={newCode}
          onChange={e => setNewCode(e.target.value)}
          placeholder="Nuevo código"
        />
        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleCreate}>
          Crear
        </button>
      </div>
      <div className="mb-4">
        <input
          className="border px-2 py-1 rounded w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por código o email"
        />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table className="w-full border text-sm whitespace-nowrap">
          <thead>
            <tr>
              <th className="border p-2">Código</th>
              <th className="border p-2">Fecha creación</th>
              <th className="border p-2">Fecha grabación</th>
              <th className="border p-2">Fecha visualización</th>
              <th className="border p-2">Activo</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCodes.map((c) => {
              const message = c.message;
              return (
                <tr key={c.id}>
                  <td className="border p-2">{c.code}</td>
                  <td className="border p-2">{c.created_at ? new Date(c.created_at).toLocaleString() : "-"}</td>
                  <td className="border p-2">{message && message.created_at ? new Date(message.created_at).toLocaleString() : "-"}</td>
                  <td className="border p-2">{message && message.updated_at ? new Date(message.updated_at).toLocaleString() : "-"}</td>
                  <td className="border p-2">
                    <button
                      className={`px-2 py-1 rounded ${c.is_active ? "bg-green-200" : "bg-gray-200"}`}
                      onClick={() => handleToggleActive(c.id, c.is_active)}
                    >
                      {c.is_active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="border p-2">
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(c.id)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
