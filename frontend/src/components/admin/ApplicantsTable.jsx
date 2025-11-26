import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-lg p-4">
      <Table>
        <TableCaption className="text-gray-600">
          A list of users who applied for this job
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicants?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item?.applicant?.fullname}</TableCell>

              <TableCell>{item?.applicant?.email}</TableCell>

              <TableCell>{item?.applicant?.phoneNumber}</TableCell>

              <TableCell>
                {item?.applicant?.profile?.resume ? (
                  <a
                    href={item.applicant.profile.resume}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {item.applicant.profile.resumeOriginalName}
                  </a>
                ) : (
                  "NA"
                )}
              </TableCell>

              <TableCell>{item?.applicant?.createdAt?.split("T")[0]}</TableCell>

              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    {shortlistingStatus.map((status, i) => (
                      <div
                        key={i}
                        onClick={() => statusHandler(status, item._id)}
                        className="cursor-pointer py-1 hover:bg-gray-100"
                      >
                        {status}
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {applicants.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No applicants have applied yet.
        </p>
      )}
    </div>
  );
};

export default ApplicantsTable;
