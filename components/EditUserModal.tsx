import React, { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Select, MenuItem, FormControl, InputLabel, FormHelperText, Autocomplete, TextField, Box, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AlertForm from "./AlertForm";
import { IUser } from "#/types/projectManagement/IResponse";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hook: UseFormReturn<IUser, any>;
  title: string;
  handleSubmitEdit: SubmitHandler<IUser>;
  user: IUser;
};

export default function EditTask({
  isOpen,
  setIsOpen,
  hook,
  title,
  handleSubmitEdit,
  user,
}: Props) {
  const {
    control,
    handleSubmit: handleSubmitEditTask,
    formState: { errors },
    setValue,
    reset
  } = hook;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = useCallback(() => {
    reset();
    setIsOpen(false);
    setIsSubmitting(false);
  }, [setIsOpen, reset]);

  useEffect(() => {
    if (user) {
      reset({
        ...user
      })
    }
  }, [user, setValue, reset]);

  const onSubmit = async (data: IUser) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await handleSubmitEdit({ ...data } as IUser & { id: number });
        closeModal();
      } catch (error) {
        console.error("Submit error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    closeModal();
  };

  const handleConfirmClick = () => {
    handleSubmitEditTask(onSubmit)();
  };

  return (
    <AlertForm isOpen={isOpen} setIsOpen={setIsOpen} style={{ width: "600px" }}>
      <div className="flex justify-between pb-2 items-center">
        <p className="font-bold text-xl">{title}</p>
      </div>
      <hr />
      <div className="flex justify-center mt-8 mb-8">
        <FormControl sx={{ width: 350, gap: 2 }}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Username is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                label="Task Name"
                variant="outlined"
                size="small"
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                label="Email"
                variant="outlined"
                size="small"
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </FormControl>
      </div>
      <hr />
      <div className="flex justify-end gap-2 mt-3">
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
        <Button
          title="Confirm"
          startIcon={<CheckIcon />}
          onClick={handleConfirmClick}
          // color="#8286FF"
          className="rounded-lg"
          style={{ width: "110px" }}
          disabled={!!errors.id || isSubmitting}
          variant="contained"
          color="success"
        >
          Confirm
        </Button>
      </div>
    </AlertForm>
  );
}