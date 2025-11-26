import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies = [], searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredCompany =
      companies.length > 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) return true;

        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });

    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
      <Table className="w-full">
        <TableCaption className="text-gray-500 text-sm py-4">
          A list of your recently registered companies
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold py-3">Logo</TableHead>
            <TableHead className="font-semibold py-3">Name</TableHead>
            <TableHead className="font-semibold py-3">Date</TableHead>
            <TableHead className="font-semibold py-3 text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterCompany?.map((company) => (
            <TableRow
              key={company._id}
              className="hover:bg-gray-50 transition-all"
            >
              <TableCell className="py-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={company.logo || "https://via.placeholder.com/100"}
                    alt="company-logo"
                  />
                </Avatar>
              </TableCell>

              <TableCell className="py-3 font-medium">{company.name}</TableCell>

              <TableCell className="py-3">
                {company.createdAt?.split("T")[0]}
              </TableCell>

              <TableCell className="text-right py-3">
                <Popover>
                  <PopoverTrigger className="p-2 rounded hover:bg-gray-200 cursor-pointer transition">
                    <MoreHorizontal />
                  </PopoverTrigger>

                  <PopoverContent className="w-36">
                    <div
                      onClick={() =>
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}

          {/* If no company found */}
          {filterCompany.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                No companies found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
