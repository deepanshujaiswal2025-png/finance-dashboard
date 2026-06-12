import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          session ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/login"
        element={
          session ? <Navigate to="/dashboard" /> : <Login />
        }
      />

      <Route
        path="/signup"
        element={
          session ? <Navigate to="/dashboard" /> : <Signup />
        }
      />

      <Route
        path="/dashboard"
        element={
          session ? <Dashboard session={session} /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;