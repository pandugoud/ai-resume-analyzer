// import Dashboard from "./pages/Dashboard";

// function App() {
//   return <Dashboard />;
// }

// export default App;


import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;