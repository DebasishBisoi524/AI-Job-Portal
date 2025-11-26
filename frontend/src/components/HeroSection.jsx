import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 px-6 sm:px-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none"></div>

      {/* Badge */}
      <span className="relative z-10 px-5 py-2 rounded-full bg-white shadow-sm border border-gray-200 text-[#f83002] text-sm sm:text-base font-semibold">
        🚀 No. 1 Job Hunt Platform
      </span>

      {/* Heading */}
      <h1 className="relative z-10 mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
        Search, Apply & <br className="hidden sm:block" />
        Get Your{" "}
        <span className="bg-gradient-to-r from-[#6a3ac2] to-[#b66bf3] bg-clip-text text-transparent">
          Dream Job
        </span>
      </h1>

      {/* Subheading */}
      <p className="relative z-10 mt-4 max-w-2xl text-gray-600 text-base sm:text-lg">
        Discover thousands of jobs from top companies, tailored just for you.
        Apply instantly and take your next career step with confidence.
      </p>

      {/* Search Bar */}
      <div className="relative z-10 mt-8 w-full max-w-xl flex items-center bg-white shadow-lg border border-gray-200 rounded-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <Input
          type="text"
          placeholder="Search for jobs, roles, or companies..."
          className="flex-grow px-5 py-3 text-gray-700 text-base sm:text-lg border-none outline-none focus:ring-0"
        />
        <Button
          type="button"
          onClick={searchJobHandler}
          className="rounded-full bg-gradient-to-r from-[#6a3ac2] to-[#9b5de5] hover:from-[#7b45d6] hover:to-[#b66bf3] text-white px-5 sm:px-7 py-3 sm:py-3 transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <Search className="h-5 w-5" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      {/* Decorative Blur Circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
    </section>
  );
};

export default HeroSection;
