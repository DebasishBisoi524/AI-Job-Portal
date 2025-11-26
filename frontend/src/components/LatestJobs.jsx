import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job); 

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold underline">
        <span className="text-[#6A38C2] underline">Latest & Top </span>Job
        Openings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-8">
        {allJobs?.length <= 0 ? (
          <span className="text-gray-500 text-lg">No Jobs Available</span>
        ) : (
          allJobs?.slice(0, 6).map((job) => (
            <div
              key={job._id}
              className="transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <LatestJobCards job={job} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
