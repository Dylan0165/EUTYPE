import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = "http://192.168.124.50:30500";
const LOGIN_URL = "http://192.168.124.50:30090/login";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const validateAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        // User niet ingelogd -> redirect naar login
        const redirectPath = window.location.pathname + window.location.search;
        const redirectUrl = redirectPath === "/" ? "/eutype" : redirectPath;
        window.location.href = `${LOGIN_URL}?redirect=${encodeURIComponent(redirectUrl)}`;
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.valid && data.username) {
            setUser({ username: data.username, email: data.email });
        } else {
            // Should technically be 401, but if valid is false
             const redirectPath = window.location.pathname + window.location.search;
             const redirectUrl = redirectPath === "/" ? "/eutype" : redirectPath;
             window.location.href = `${LOGIN_URL}?redirect=${encodeURIComponent(redirectUrl)}`;
             return;
        }
      } else {
          throw new Error(`Auth check failed with status: ${response.status}`);
      }

    } catch (err) {
      console.error("Auth validation error:", err);
      setError(err);
      // In catch GEEN redirect meer doen, alleen loggen en error state zetten
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      window.location.href = `${LOGIN_URL}?redirect=/eutype`;
    }
  }, []);

  useEffect(() => {
    validateAuth();
  }, [validateAuth]);

  return { user, loading, error, logout, refetch: validateAuth };
};
