import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "Full Stack Developer",
  "Mobile App Developer",
  "Cloud Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-12">
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
        🔥 Popular Categories
      </h2>

      <Carousel className="w-full max-w-3xl mx-auto mb-6">
        <CarouselContent className="flex items-center gap-3 sm:gap-5">
          {categories.map((cat, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/3 flex justify-center"
            >
              <Button
                onClick={() => searchJobHandler(cat)} // 🔥 Functionality added back
                variant="outline"
                className="w-full border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-[#6A3AC2] hover:text-white transition-all duration-300 shadow-sm"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default CategoryCarousel;
