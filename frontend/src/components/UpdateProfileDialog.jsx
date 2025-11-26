import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const skillOptions = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "TailwindCSS",
    "TypeScript",
    "Next.js",
    "Redux",
  ];

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills || [],
    file: "",
    resume: "",
  });

  const changeEventHandler = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const clearField = (field) => setInput((prev) => ({ ...prev, [field]: "" }));

  const fileChangeHandler = (e) =>
    setInput({ ...input, file: e.target.files?.[0] });

  const resumeChangeHandler = (e) =>
    setInput({ ...input, resume: e.target.files?.[0] });

  const toggleSkill = (skill) =>
    setInput((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills.join(","));

    if (input.file) formData.append("file", input.file); // profile picture
    if (input.resume) formData.append("resume", input.resume); // resume pdf

    try {
      setLoading(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[480px] bg-white/80 backdrop-blur-xl border border-gray-200 
        shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl p-6 transition-all duration-300"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 text-center mb-2">
            Update Profile
          </DialogTitle>
          <p className="text-sm text-gray-500 text-center">
            Keep your profile fresh to get better job opportunities.
          </p>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-5 mt-4">
          {/* FULL NAME */}
          <div className="relative">
            <Label className="text-sm text-gray-700">Full Name</Label>
            <div className="relative">
              <Input
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                className="mt-1 border-gray-200 rounded-xl pr-10"
              />
              {input.fullname && (
                <button
                  type="button"
                  onClick={() => clearField("fullname")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Label className="text-sm text-gray-700">Email</Label>
            <div className="relative">
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="mt-1 border-gray-200 rounded-xl pr-10"
              />
              {input.email && (
                <button
                  type="button"
                  onClick={() => clearField("email")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* PHONE */}
          <div className="relative">
            <Label className="text-sm text-gray-700">Phone Number</Label>
            <Input
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              className="mt-1 border-gray-200 rounded-xl"
            />
          </div>

          {/* BIO */}
          <div className="relative">
            <Label className="text-sm text-gray-700">Bio</Label>
            <Input
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              className="mt-1 border-gray-200 rounded-xl"
            />
          </div>

          {/* SKILLS */}
          <div>
            <Label className="text-sm text-gray-700">Skills</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 border-gray-200 rounded-xl justify-between"
                >
                  {input.skills.length > 0
                    ? input.skills.join(", ")
                    : "Select skills"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-white border border-gray-100 shadow-lg rounded-xl p-1">
                {skillOptions.map((skill) => (
                  <DropdownMenuCheckboxItem
                    key={skill}
                    checked={input.skills.includes(skill)}
                    onCheckedChange={() => toggleSkill(skill)}
                    className="capitalize text-sm"
                  >
                    {skill}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* PROFILE PHOTO */}
          <div>
            <Label className="text-sm text-gray-700">Profile Picture</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
              className="mt-1 border-gray-200 rounded-xl"
            />
          </div>

          {/* RESUME PDF */}
          <div>
            <Label className="text-sm text-gray-700">Resume (PDF)</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={resumeChangeHandler}
              className="mt-1 border-gray-200 rounded-xl"
            />
          </div>

          {/* SUBMIT */}
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
