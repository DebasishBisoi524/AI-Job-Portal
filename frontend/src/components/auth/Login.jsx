import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    dispatch(setLoading(false));
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md sm:max-w-lg md:max-w-md border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
        >
          <h1 className="font-bold text-3xl sm:text-4xl text-center mb-6 sm:mb-8 text-gray-800">
            Login
          </h1>

          {/* Email */}
          <div className="relative my-5">
            <Label
              htmlFor="email"
              className="absolute left-4 -top-3 bg-white px-1 text-sm text-gray-700 font-medium z-10"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base py-3 rounded-xl transition-all"
            />
          </div>

          {/* Password with toggle */}
          <div className="relative my-5">
            <Label
              htmlFor="password"
              className="absolute left-4 -top-3 bg-white px-1 text-sm text-gray-700 font-medium z-10"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base py-3 rounded-xl pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div className="my-6">
            <p className="text-gray-700 text-sm sm:text-base mb-2 font-medium">
              Select Role
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm sm:text-base">
                <input
                  type="radio"
                  name="role"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  value="student"
                  className="accent-blue-500 cursor-pointer"
                />
                <span>Student</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm sm:text-base">
                <input
                  type="radio"
                  name="role"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  value="recruiter"
                  className="accent-purple-500 cursor-pointer"
                />
                <span>Recruiter</span>
              </label>
            </div>
          </div>
          {loading ? (
            <Button disabled className="w-full mt-6">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-2xl shadow-md transition-all duration-300"
            >
              Login
            </Button>
          )}

          {/* Submit */}

          {/* Signup Link */}
          <div className="text-center mt-5 text-gray-600 text-sm sm:text-base">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
