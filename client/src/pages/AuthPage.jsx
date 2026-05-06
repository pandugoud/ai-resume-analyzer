import { useState } from "react";
import API from "../services/api";

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const { data } = await API.post(endpoint, payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (error) {
      alert(error?.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p>{isLogin ? "Login to analyze and save resumes" : "Register to start analyzing resumes"}</p>

        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <button
          type="button"
          className="auth-switch"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "New user? Create account" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;