"use client";

import { useAvailableFunctionsQuery } from "@/api/SetUp/apiFunction";
import { setIsAuth } from "@/features/authSlice";
import { deleteCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { RxArrowTopRight } from "react-icons/rx";
import { useDispatch } from "react-redux";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function WelcomeZenix() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: availableFunctionsData } = useAvailableFunctionsQuery<any>({});
  const [data, setData] = useState<any>([]);
  const [hasReloaded, setHasReloaded] = useState(false);

  useLayoutEffect(() => {
    if (!sessionStorage.getItem("hasReloaded")) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    } else {
      setHasReloaded(true);
    }

  }, []);

  useEffect(() => {
    if (availableFunctionsData?.categories?.length > 0) {
      setData(availableFunctionsData.categories[0].detail_function_list);
    }
  }, [availableFunctionsData]);

  if (!hasReloaded) {
    return null;
  }

  const getImage = (title: string) => {
    const timestamp = new Date().getTime(); // Thêm timestamp để tránh lưu trữ cache
    switch (title) {
      case "Data Analytics":
        return `/images/services/data.png?${timestamp}`;
      case "Branding":
        return `/images/services/brand.png?${timestamp}`;
      case "CRM":
        return `/images/services/crm.png?${timestamp}`;
      case "HR":
        return `/images/services/hr.png?${timestamp}`;
      case "Finance":
        return `/images/services/f88.png?${timestamp}`;
      case "Task":
        return `/images/services/task.png?${timestamp}`;
      case "Inventory":
        return `/images/services/kho1.png?${timestamp}`;
      case "Procurement":
        return `/images/services/cung-ung.png?${timestamp}`;
      case "Accounting":
        return `/images/services/ktnb.png?${timestamp}`;
      case "Learning":
        return `/images/services/ctv.png?${timestamp}`;
      case "Customer Service":
          return `/images/services/cung-ung.png?${timestamp}`;
      default:
        return `/images/services/default.png?${timestamp}`; // Provide a default image
    }
  };

  const logout = () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    sessionStorage.clear();
    router.push("/login");
    dispatch(setIsAuth(false));
  };

  return (
    <div className="h-screen w-screen bg-[#172b4d] relative">
      <div className="parallelogram absolute max-lg:hidden bg-gray-500 top-0 opacity-30 h-[calc(100vh-70px)] w-[250px] 2xl:w-[350px] z-0 left-[350px] 2xl:left-[500px]"></div>
      <div className="parallelogram absolute max-lg:hidden bg-gray-500 bottom-0 opacity-30 h-[calc(100vh-50px)] w-[250px] 2xl:w-[350px] z-0 right-[350px] 2xl:right-[500px]"></div>

      <div className="my-auto h-auto lg:grid grid-row-2  lg:grid-row-7 lg:h-full">
        <div className="lg:items-end flex flex-1  flex-col lg:flex-row lg:col-span-4 z-10 px-4 lg:px-30 2xl:px-0 lg:container h-full">
          <div className=" w-full lg:w-2/5 2xl:w-2/5 flex lg:h-full ">
            <div className="lg:self-end flex-1">
              <div className="max-lg:mt-4">
                <div className="max-lg:flex gap-2">
                  <div className="2xl:w-[190px] 2xl:h-[165px] w-[50px] h-[40px] lg:w-[160px] lg:h-[140px] max-sm:my-auto">
                    <Image src="/logo.svg" alt="logo" width={190} height={165} />
                  </div>
                  <div className="text-blue-700  text-3xl lg:text-5xl 2xl:text-7xl font-semibold 2xl:mt-5 mt-3 mb-2">
                    Zenix Business
                  </div>
                </div>

                <div className="text-blue-600 font-medium text-xl 2xl:text-2xl pb-4 max-sm:hidden">
                  Nền tảng quản lý toàn diện dành cho doanh nghiệp.
                </div>
                <div className="my-3 2xl:my-5 font-medium flex text-white gap-2.5 2xl:gap-3 pb-4 2xl:pb-10 max-sm:hidden">
                  <Link href={`/business/profile`} className="text-white hover:text-blue-500">
                    Hồ sơ cá nhân
                  </Link>
                  <Link href={`/business/`} className="text-white hover:text-blue-500">
                    Hướng dẫn sử dụng
                  </Link>
                  <Link href={`/business/`} className="text-white hover:text-blue-500">
                    Hỗ trợ
                  </Link>
                  <button
                    className="text-white hover:text-blue-500 bg-none font-medium bg-transparent"
                    onClick={logout}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-sm:h-[600px] h-[500px] lg:w-3/5 lg:flex-1 2xl:w-3/5 lg:p-4 2xl:p-10 py-10 lg:pt-16">
            <div className="border-4 max-sm:h-[540px] border-blue-600 w-full  lg:h-full rounded-xl 2xl:rounded-3xl p-10 2xl:p-18 bg-[#132a52]">
              <div className="text-3xl 2xl:text-4xl text-blue-600 text-center mb-8 ">
                {data && data[0]?.category_str}
              </div>
              <div className={`${data?.length > 4 ? "grid-cols-2" : ""} grid max-sm:!grid-cols-1`}>
                {data?.map((item: any, index: number) => (
                  <Link
                    key={index}
                    href={`/business${item.link}`}
                    className="flex gap-3 text-white hover:text-blue-500 mb-3"
                  >
                    <FaCheck />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-screen lg:h-auto flex-1  col-span-3 z-10">
          <div className="flex items-center justify-center flex-col w-full  bg-blue-700  relative">
            {/* <div className="absolute bg-[#0068E1] w-full h-[196px]  top-0.5 z-0"></div> */}
            <Swiper
              breakpoints={{
                340: {
                  slidesPerView: 1,
                  spaceBetween: 1,
                },
                640: {
                  slidesPerView: 4,
                  spaceBetween: 2,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 2,
                },
                1920: {
                  slidesPerView: 6,
                  spaceBetween: 2,
                },
              }}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
              modules={[FreeMode]}
              className="max-w-[85%] 2xl:max-w-[80%] z-10 !h-[195px]"
            >
              {availableFunctionsData?.categories?.map((item: any) => {
                return (
                  <SwiperSlide key={item.id} onClick={() => setData(item?.detail_function_list)} className="py-5">
                    <div className="flex flex-col gap-4 max-sm:mx-auto group relative shadow-lg my-auto text-white rounded-xl p-4 w-[190px] h-full  overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-cover bg-center" />
                      <div className="absolute inset-0 bg-[#1d4b8f] opacity-90 group-hover:bg-black group-hover:opacity-50" />
                      <div className="relative flex flex-col gap-3">
                        <h1 className="text-base z-20">{item.title}</h1>
                      </div>
                      <div className="w-[110px] h-[120px] absolute z-0 bottom-[-15px] left-1/2 transform -translate-x-1/2">
                        <Image src={`${getImage(item.en_title)}`} alt="logo" width={200} height={200} />
                      </div>
                      <RxArrowTopRight className="absolute bottom-2 left-2  2xl:left-5 w-[18px] h-[18px]  text-white group-hover:text-blue-500 group-hover:rotate-45 duration-100" />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
        <div className="my-5 font-medium flex text-white gap-2.5 max-sm:justify-center 2xl:gap-3 mb-4 2xl:pb-10 sm:hidden">
          <Link href={`/business/`} className="text-white hover:text-blue-500">
            Tin tức
          </Link>
          <Link href={`/business/profile`} className="text-white hover:text-blue-500">
            Hồ sơ cá nhân
          </Link>
          <Link href={`/business/`} className="text-white hover:text-blue-500">
            Hướng dẫn sử dụng
          </Link>
          <button className="text-white hover:text-blue-500 bg-none font-medium bg-transparent" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
