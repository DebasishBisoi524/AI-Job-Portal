import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  return (
    <div
      className="p-6 rounded-3xl shadow-md bg-white border border-gray-100 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                    cursor-pointer w-full max-w-sm mx-auto flex flex-col justify-between"
    >
      {/* Top row */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p className="flex items-center gap-1">
          <span className="text-gray-500">🕓</span>{" "}
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>

        <Button
          variant="outline"
          className="rounded-full border-gray-200 hover:bg-purple-100 hover:text-purple-600 transition"
          size="icon"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      {/* Company section */}
      <div className="flex items-center gap-4 mt-5">
        <div className="p-2 bg-gray-50 border rounded-2xl">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={
                job?.company?.logo ||
                "https: //img.lovepik.com/element/40172/7089.png_1200.png"
              }
            />
          </Avatar>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {job?.company?.name || "Company Name"}
          </h2>
          <p className="text-sm text-gray-500">📍 India</p>
        </div>
      </div>

      {/* Job Title */}
      <div className="mt-4">
        <h1 className="text-xl font-bold text-purple-700">{job?.title}</h1>

        <p className="text-gray-600 text-sm mt-2 leading-relaxed line-clamp-3">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-5">
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
          {job?.jobType}
        </span>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          Remote
        </span>

        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          {job?.salary} LPA
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3 mt-6">
        <Button
          variant="outline"
          className="border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white rounded-xl px-6 py-2"
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          Details
        </Button>

        <Button className="bg-linear-to-r from-purple-700 to-purple-500 hover:opacity-90 text-white px-6 py-2 rounded-xl shadow-md">
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
