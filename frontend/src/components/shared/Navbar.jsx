import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Menu, X, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

// ⭐ NEW IMPORT
import ATSScoreModal from "@/components/AI/ATSScoreModal";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // ⭐ NEW STATE - Open ATS Checker Modal
  const [openATS, setOpenATS] = useState(false);

  const { user } = useSelector((store) => store.auth);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800 hover:scale-105 transition-transform duration-200"
          >
            Job <span className="text-[#f83002]">Portal</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex font-medium items-center gap-7 text-gray-700">
              {/* Recruiter Menu */}
              {user && user.role === "recruiter" ? (
                <>
                  <li>
                    <Link
                      to="/admin/companies"
                      className="hover:text-[#f83002]"
                    >
                      Companies
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/jobs" className="hover:text-[#f83002]">
                      Jobs
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" className="hover:text-[#f83002]">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/jobs" className="hover:text-[#f83002]">
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/browse" className="hover:text-[#f83002]">
                      Browse
                    </Link>
                  </li>

                  {/* ⭐ NEW ATS CHECKER BUTTON */}
                  <li
                    onClick={() => setOpenATS(true)}
                    className="text-[#f83002] cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <Sparkles size={17} className="text-[#f83002]" />
                    <span>ATS Checker</span>
                  </li>
                </>
              )}
            </ul>

            {/* Right buttons */}
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="rounded-xl px-5 py-2 border-gray-300"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#f83002] text-white rounded-xl px-5 py-2">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer ring-2 ring-[#f83002]/20">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-72 rounded-2xl shadow-xl border bg-white/95 p-4">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePhoto} />
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{user.fullname}</h4>
                      <p className="text-sm">{user?.profile?.bio}</p>
                    </div>
                  </div>

                  <div className="flex flex-col mt-3 space-y-2">
                    {user.role === "student" && (
                      <div className="flex items-center gap-2 hover:text-[#f83002] cursor-pointer">
                        <User2 className="w-4 h-4" />
                        <Link to="/profile">View Profile</Link>
                      </div>
                    )}

                    <div
                      onClick={logoutHandler}
                      className="flex items-center gap-2 hover:text-[#f83002] cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 border-t px-4 py-4 space-y-4">
            <ul className="flex flex-col font-medium gap-3 text-gray-700">
              {user && user.role === "recruiter" ? (
                <>
                  <li>
                    <Link to="/admin/companies">Companies</Link>
                  </li>
                  <li>
                    <Link to="/admin/jobs">Jobs</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/jobs">Jobs</Link>
                  </li>
                  <li>
                    <Link to="/browse">Browse</Link>
                  </li>

                  {/* ⭐ ATS Button (Mobile) */}
                  <li
                    onClick={() => setOpenATS(true)}
                    className="text-[#f83002] font-semibold cursor-pointer"
                  >
                    ATS Checker
                  </li>
                </>
              )}
            </ul>

            {!user ? (
              <div className="flex flex-col gap-3">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-[#f83002] text-white">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </nav>

      {/* ⭐ ATS Modal */}
      <ATSScoreModal open={openATS} setOpen={setOpenATS} />
    </>
  );
};

export default Navbar;
