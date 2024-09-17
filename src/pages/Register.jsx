import axios from "axios";
import React, { useState } from "react";
import { server } from "../App";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log("Passwords do not match");
    } else {
      try {
        const response = await axios.post(`${server}/register`, {
          username: formData.name,
          email: formData.email,
          password: formData.password,
        }, { withCredentials: true });
        console.log(response);
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } catch (error) {
        console.error("Registration failed", error);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-[400px] p-4 mx-auto flex flex-col gap-4">
    <input
      type="text"
      name="name"
      value={name}
      placeholder="Name"
      onChange={onChange}
      required
      className="p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={email}
      onChange={onChange}
      required
      className="p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={password}
      onChange={onChange}
      required
      className="p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
    <input
      type="password"
      name="password2"
      placeholder="Confirm Password"
      value={password2}
      onChange={onChange}
      required
      className="p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
      Register
    </button>
  </form>
  );
};

export default Register;