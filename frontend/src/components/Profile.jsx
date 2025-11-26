import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const isResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl my-10 p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-between items-start md:items-center gap-6 mb-6">
          {/* Profile Header */}
          <div className="flex items-start gap-5">
            <Avatar className="h-24 w-24 ring-2 ring-blue-100 shadow-md">
              <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
            </Avatar>

            <div>
              <h1 className="font-bold text-2xl md:text-3xl text-gray-800">
                {user?.fullname || "Your Name"}
              </h1>
              <p className="text-gray-600 mt-1 max-w-md leading-relaxed">
                {user?.profile?.bio || "Add a short bio about yourself..."}
              </p>

              {/* Contact Info */}
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>{user?.email || "your@email.com"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Contact className="w-5 h-5 text-purple-600" />
                  <span>{user?.phoneNumber || "Add phone number"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            className="rounded-xl border-gray-300 hover:bg-blue-600 hover:text-white transition-all"
            onClick={() => setOpen(true)}
          >
            <Pen className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </div>

        {/* Skills */}
        <div className="my-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Skills</h2>
          <div className="flex flex-wrap items-center gap-2">
            {user?.profile?.skills && user?.profile.skills.length > 0 ? (
              user?.profile.skills.map((item, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition"
                >
                  {item.toUpperCase()}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">Not added yet</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-semibold text-gray-800">Resume</Label>
          {isResume && user?.profile?.resume ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user?.profile?.resume}
              className="block text-blue-600 hover:text-blue-800 hover:underline mt-1 transition-all"
            >
              {user?.profile?.resumeOriginalName || "My resume"}
            </a>
          ) : (
            <span className="text-gray-500">Not uploaded</span>
          )}
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <h1 className="font-bold text-xl mb-6 text-gray-800">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
