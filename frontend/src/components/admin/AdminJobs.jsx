import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AdminJobsTable from "./AdminJobsTable";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Search, Plus } from "lucide-react";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              className="pl-10 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Filter by name, role..."
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* New Job Button */}
          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            New Job
          </Button>
        </div>

        {/* Table Section */}
        <div className="p-2 sm:p-0">
          <AdminJobsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
