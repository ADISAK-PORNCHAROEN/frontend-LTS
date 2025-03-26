"use client";
import React from "react";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Typography } from "@mui/material";

type Props = {};
const CancelBtn = (props: Props) => {
  return (
    <div className="flex justify-center items-center bg-white rounded-lg">
      <div className=" cursor-pointer bg-[#ff2828] border-l-2 border-y-2 border-[#ff2828] rounded-l-lg w-8 h-10 flex justify-center items-center">
        <ClearRoundedIcon className="text-white" />
      </div>
      <button className=" w-24 h-10 hover:bg-[#ff2828] hover:text-white duration-300 border-2 border-[#ff2828] rounded-r-lg text-[#ff2828]">
        <Typography variant="button">
          Cancel
        </Typography>
      </button>
    </div>
  );
};

export default CancelBtn;