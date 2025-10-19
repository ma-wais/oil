import axios from "../utils/axios";
import React, { useEffect, useState } from "react";
import { server } from "../App";
import { useNavigate } from "react-router-dom";
import { BiLock, BiUser } from "react-icons/bi";
import img from "../components/R.png";
const Login = ({ setToken, setUser, token }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }
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
      setLoading(false);
      navigate("/home");
    } catch (error) {
      setLoading(false);
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-4">
      <div className="max-w-4xl w-full flex shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm bg-white/10">
        <div className="hidden md:block w-1/2 relative">
          <img
            src={img}
            alt="Oil Kohlu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
        </div>

        <form
          className="w-full md:w-1/2 px-8 md:px-12 py-10 bg-white"
          onSubmit={onSubmit}
        >
          <div className="text-center mb-8">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Oil Kohlu
            </h3>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <BiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="email"
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <BiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={onChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Secure login for authorized users only
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
