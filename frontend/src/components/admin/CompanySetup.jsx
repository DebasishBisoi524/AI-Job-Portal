import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };
  const { singleCompany } = useSelector((store) => store.company);
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(true);
    }
  };
  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: singleCompany.file || null,
    });
  }, [singleCompany]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Card */}
        <form
          className="bg-white shadow-xl border border-gray-200 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
          onSubmit={submitHandler}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 rounded-xl hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-2xl text-gray-800">Company Setup</h1>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="col-span-1">
              <Label className="text-gray-700 font-medium">Company Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-300"
                placeholder="Ex: Microsoft"
                onChange={changeEventHandler}
              />
            </div>

            <div className="col-span-1">
              <Label className="text-gray-700 font-medium">Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-300"
                placeholder="Short description"
                onChange={changeEventHandler}
              />
            </div>

            <div className="col-span-1">
              <Label className="text-gray-700 font-medium">Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-300"
                placeholder="https://example.com"
                onChange={changeEventHandler}
              />
            </div>

            <div className="col-span-1">
              <Label className="text-gray-700 font-medium">Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-300"
                placeholder="City, Country"
                onChange={changeEventHandler}
              />
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <Label className="text-gray-700 font-medium">Logo</Label>
              <Input
                type="file"
                accept="image/*"
                className="mt-2 rounded-xl border-gray-300 cursor-pointer"
                onChange={changeFileHandler}
              />
            </div>
          </div>

          {/* Submit Button */}
          {loading ? (
            <Button className="w-full mt-8 rounded-xl">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button className="w-full mt-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg transition">
              Update
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
