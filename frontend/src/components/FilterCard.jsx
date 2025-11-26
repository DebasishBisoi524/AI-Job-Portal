import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const fitlerData = [
  {
    fitlerType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    fitlerType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    fitlerType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
      <h1 className="text-2xl font-bold text-[#6a3ac2] mb-2">Filter Jobs</h1>
      <hr className="mb-4 border-gray-300" />

      <RadioGroup
        className="space-y-5"
        value={selectedValue}
        onValueChange={changeHandler}
      >
        {fitlerData.map((data, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {data.fitlerType}
            </h2>

            <div className="space-y-2 ml-2">
              {data.array.map((item, i) => {
                const id = `${data.fitlerType}-${i}`;

                return (
                  <div key={id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      id={id}
                      value={item}
                      className="text-[#6a3ac2] focus:ring-[#6a3ac2]"
                    />

                    <Label
                      htmlFor={id}
                      className="text-gray-700 cursor-pointer hover:text-[#6a3ac2] transition-colors"
                    >
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
