import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AIModal from "./AI/AIModal";
import { Bot } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isinitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isinitiallyApplied);
  const [showAIModal, setShowAIModal] = useState(false);

  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);

        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };

        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          setIsApplied(
            res.data.job.applications?.some(
              (application) => application.applicant === user?._id
            ) || false
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 my-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="w-full">
          <h1 className="font-bold text-2xl md:text-3xl">{singleJob?.title}</h1>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge className="text-blue-700 font-bold" variant="ghost">
              {singleJob?.position} Positions
            </Badge>

            <Badge className="text-[#F83002] font-bold" variant="ghost">
              {singleJob?.jobType}
            </Badge>

            <Badge className="text-[#7209b7] font-bold" variant="ghost">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        {/* APPLY + AI BUTTONS */}
        <div className="w-full md:w-auto flex flex-col gap-2">
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`w-full md:w-auto rounded-lg px-6 py-2.5 text-sm font-medium ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>

          {/* AI BUTTON */}
          <Button
            onClick={() => setShowAIModal(true)}
            className="
              w-full md:w-auto rounded-lg px-6 py-2.5 text-sm font-medium
              flex items-center gap-2 justify-center
              bg-gradient-to-r from-[#6f3edb] to-[#8a4fff]
              hover:from-[#5b32b2] hover:to-[#7436d8]
              text-white shadow-lg
              hover:shadow-xl hover:scale-[1.02]
              transition-all duration-200
            "
          >
            <Bot size={18} className="text-white" />
            Analyze My Fit
          </Button>
        </div>
      </div>

      {/* Divider */}
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4 mt-6 text-lg md:text-xl">
        Job Description
      </h1>

      {/* Details Section */}
      <div className="my-4 text-sm md:text-base space-y-3">
        <h1 className="font-bold">
          Role:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>

        <h1 className="font-bold">
          Location:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>

        <h1 className="font-bold">
          Description:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>

        <h1 className="font-bold">
          Experience:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experience} yrs
          </span>
        </h1>

        <h1 className="font-bold">
          Salary:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary} LPA
          </span>
        </h1>

        <h1 className="font-bold">
          Total Applicants:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications?.length}
          </span>
        </h1>

        <h1 className="font-bold">
          Posted Date:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt?.split("T")[0]}
          </span>
        </h1>
      </div>

      {/* AI MODAL */}
      <AIModal
        open={showAIModal}
        setOpen={setShowAIModal}
        resumeUrl={user?.profile?.resume}
        jobDescription={singleJob?.description}
      />
    </div>
  );
};

export default JobDescription;
