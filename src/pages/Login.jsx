import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../App";
import { useNavigate } from "react-router-dom";
import { BiLock, BiUser } from "react-icons/bi";
import img from '../components/R.png'
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
      sessionStorage.setItem("token", token);
      setToken(token);
      setUser(response.data.user);

      navigate("/home");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="flex items-center bg-gray-100 justify-center min-h-screen m-auto">
      <div className="max-w-[800px] flex">
        <img
          src={img}
          alt=""
          className="w-[380px] h-[380px] object-cover shadow-lg"
        />
        <form
          className="w-[380px] h-[380px] max-w-md px-8 py-6 text-left bg-white shadow-lg"
          onSubmit={onSubmit}
        >
          <h3 className="text-2xl font-bold mb-4 text-center">Oil Kohlu</h3>
          <div className="relative mt-10">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <div className="flex items-center">
              <BiUser className="absolute left-3 text-gray-400" size={18} />
              <input
                type="text"
                name="email"
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-2 border focus:outline-none"
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="relative mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 rounded"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center">
              <BiLock className="absolute left-3 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={onChange}
                className="w-full pl-10 pr-4 py-2 border focus:outline-none rounded"
                required
              />
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white mt-4 font-bold py-2 px-4 rounded"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
