import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="flex justify-center px-4 py-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-4xl bg-white border border-gray-200 shadow-xl rounded-2xl p-8 sm:p-10 backdrop-blur-md transition-all duration-300 hover:shadow-2xl"
        >
          {/* Header */}
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Post a New Job
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <Button
              type="button"
              onClick={() => navigate("/admin/jobs")}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 rounded-xl hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="font-medium text-gray-700">Job Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl"
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <Label className="font-medium text-gray-700">Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl"
                placeholder="Short description of the role"
              />
            </div>

            <div>
              <Label className="font-medium text-gray-700">Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl"
                placeholder="React, Node, SQL..."
              />
            </div>

            <div>
              <Label className="font-medium text-gray-700">Salary (LPA)</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl"
                placeholder="12"
              />
            </div>

            <div>
              <Label className="font-medium text-gray-700">Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl"
                placeholder="Bengaluru"
              />
            </div>

            <div>
              <Label className="font-medium text-gray-700">Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl"
                placeholder="Full-time"
              />
            </div>

            <div>
              <Label className="font-medium text-gray-700">
                Experience (Years)
              </Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl"
                placeholder="0"
              />
            </div>

            <div>
              <Label className="font-medium text-gray-700">
                Number of Positions
              </Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl"
                placeholder="1"
              />
            </div>

            {/* Company Dropdown */}
            {companies.length > 0 && (
              <div>
                <Label className="font-medium text-gray-700">
                  Select Company
                </Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="mt-2 rounded-xl w-full">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {loading ? (
            <Button className="w-full mt-8 rounded-xl py-3">
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Posting Job...
            </Button>
          ) : (
            <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 rounded-xl py-3 text-white text-lg font-semibold transition">
              Post New Job
            </Button>
          )}

          {/* Company Warning */}
          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-semibold text-center mt-4">
              * Please register a company first before posting jobs
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
