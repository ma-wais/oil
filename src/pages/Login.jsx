import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../App";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken, setUser, token }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${server}/login`,
        {
          emailOrUsername: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(response.data.user);

      navigate("/");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <form
      className="w-[400px] p-4 mt-10 mx-auto flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      <input
        type="text"
        name="email"
        placeholder="Email or Username"
        value={email}
        onChange={onChange}
        className="p-2 text-sm text-gray-700 border border-gray-300 focus:outline-none"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={onChange}
        required
        className="p-2 text-sm text-gray-700 border border-gray-300 focus:outline-none"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
