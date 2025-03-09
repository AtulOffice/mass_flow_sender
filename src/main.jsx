import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import InputForm from "./form.jsx";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
    } else {
      toast.error("invalid username or password")
    }
  };

  return (
    <StrictMode>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {isAuthenticated ? <InputForm /> : <LoginForm onLogin={handleLogin} />}
      </div>
    </StrictMode>
  );
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
    <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-xl shadow-lg">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-white text-center">
          MASS FLOW METER
        </h2>
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
  
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
  
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400"
        >
          Login
        </button>
      </form>
    </div>
  </div>
  
  );
}

createRoot(document.getElementById("root")).render(<App />);
