import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CompaniesTable from "./CompaniesTable";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { Search, Plus } from "lucide-react";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Search + Button Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-8">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              className="pl-10 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Search companies..."
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            New Company
          </Button>
        </div>

        <div className="p-2 sm:p-0">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default Companies;
