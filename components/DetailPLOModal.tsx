import React, { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Select, MenuItem, FormControl, InputLabel, FormHelperText, Autocomplete, TextField, Box, Button, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AlertForm from "./AlertForm";
import { IPlo } from "#/types/LTS/IPlo";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hook: UseFormReturn<IPlo, any>;
  title: string;
  // handleSubmitEdit: SubmitHandler<IUser>;
  plo: IPlo;
};

export default function DetailPLO({
  isOpen,
  setIsOpen,
  hook,
  title,
  // handleSubmitEdit,
  plo,
}: Props) {
  const {
    control,
    handleSubmit: handleSubmitEditTask,
    formState: { errors },
    setValue,
    reset
  } = hook;

  console.log("[DetailPLO] @plo >>>", plo);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = useCallback(() => {
    reset();
    setIsOpen(false);
    setIsSubmitting(false);
  }, [setIsOpen, reset]);

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <AlertForm isOpen={isOpen} setIsOpen={setIsOpen} style={{ width: "600px" }}>
      <div className="flex justify-between pb-2 items-center">
        <p className="font-bold text-xl">{title}</p>
      </div>
      <hr />
      <div className="flex justify-center mt-8 mb-8">
        <Typography>{plo?.ploDesc}</Typography>
      </div>
      <hr />
      <div className="flex justify-start gap-2 mt-3">
        <Button
          title="Cancel"
          startIcon={<CloseRoundedIcon />}
          onClick={handleCancel}
          className="rounded-lg"
          style={{ width: "110px" }}
          variant="contained"
          color="error"
        >
          Cancel
        </Button>
      </div>
    </AlertForm>
  );
}