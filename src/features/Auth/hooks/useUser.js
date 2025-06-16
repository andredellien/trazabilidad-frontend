import { useState, useEffect } from "react";
import { getMe } from "../../../shared/services/auth.service";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getMe();
        setUser(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Error al obtener información del usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
} 