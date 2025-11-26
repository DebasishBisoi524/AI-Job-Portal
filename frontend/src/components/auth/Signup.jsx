import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false)); // ✔ FIXED
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md sm:max-w-lg md:max-w-md border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
        >
          <h1 className="font-bold text-3xl sm:text-4xl text-center mb-6 sm:mb-8 text-gray-800">
            Create Account
          </h1>

          {/* Full Name */}
          <div className="my-3 sm:my-4">
            <Label className="text-gray-600 text-sm sm:text-base">
              Full Name
            </Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Enter your full name"
              className="mt-1 border-gray-300 focus:border-blue-400 focus:ring-blue-300 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Email */}
          <div className="my-3 sm:my-4">
            <Label className="text-gray-600 text-sm sm:text-base">Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="mt-1 border-gray-300 focus:border-blue-400 focus:ring-blue-300 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Phone */}
          <div className="my-3 sm:my-4">
            <Label className="text-gray-600 text-sm sm:text-base">
              Phone Number
            </Label>
            <Input
              type="number"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="Enter your phone number"
              className="mt-1 border-gray-300 focus:border-blue-400 focus:ring-blue-300 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Password */}
          <div className="my-3 sm:my-4">
            <Label className="text-gray-600 text-sm sm:text-base">
              Password
            </Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="mt-1 border-gray-300 focus:border-blue-400 focus:ring-blue-300 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Role Selection */}
          <div className="my-5 sm:my-6">
            <Label className="text-gray-600 text-sm sm:text-base block mb-2">
              Select Role
            </Label>
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
                Student
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
                Recruiter
              </label>
            </div>
          </div>

          {/* Profile Upload */}
          <div className="my-4 sm:my-5">
            <Label className="text-gray-600 text-sm sm:text-base">
              Profile Picture
            </Label>
            <div className="mt-1">
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer border-gray-300 focus:border-blue-400 focus:ring-blue-300 transition-all text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Submit */}
          {loading ? (
            <Button disabled className="w-full mt-6">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-2xl shadow-md transition-all duration-300"
            >
              Signup
            </Button>
          )}

          {/* Link */}
          <div className="text-center mt-5 text-gray-600 text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-colors"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
