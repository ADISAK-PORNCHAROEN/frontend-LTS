import React, { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Select, MenuItem, FormControl, InputLabel, FormHelperText, Autocomplete, TextField, Box, Button, Grid } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AlertForm from "./AlertForm";
import { IPlo } from "#/types/LTS/IPlo";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hook: UseFormReturn<IPlo, any>;
  title: string;
  handleSubmitEdit: SubmitHandler<IPlo>;
  plo: IPlo;
  ploColumn: IPlo[];
};

export default function EditTask({
  isOpen,
  setIsOpen,
  hook,
  title,
  handleSubmitEdit,
  plo,
  ploColumn,
}: Props) {
  const {
    control,
    handleSubmit: handleSubmitEditTask,
    formState: { errors },
    setValue,
    reset
  } = hook;

  console.log("Check Plo >>>", plo);
  console.log("Check ploColumn >>>", ploColumn);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = useCallback(() => {
    reset();
    setIsOpen(false);
    setIsSubmitting(false);
  }, [setIsOpen, reset]);

  useEffect(() => {
    if (plo) {
      reset({
        ...plo
      })
    }
  }, [plo, setValue, reset]);

  const onSubmit = async (data: IPlo) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await handleSubmitEdit({ ...data } as IPlo & { id: number });
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
    <AlertForm isOpen={isOpen} setIsOpen={setIsOpen} style={{ width: "1000px" }}>
      <div className="flex justify-between pb-2 items-center">
        <p className="font-bold text-xl">{title}</p>
      </div>
      <hr />
      <div className="flex justify-center mt-8 mb-8">
        <FormControl sx={{ width: 750, gap: 2 }}>
          <Grid container spacing={2}>
            {ploColumn.map((ploItem, index) => (
              <Grid item xs={6} key={ploItem.id}>
                <Controller
                  key={ploItem.id} // ใช้ `id` เป็น key เพื่อให้ React จัดการ component ได้ถูกต้อง
                  name={ploItem.ploName as "id" | "ploName" | "ploDesc" | "ploStatus"} // ใช้ `ploName` เป็น name สำหรับแต่ละ field
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label={ploItem.ploName} // ใช้ `ploName` เป็น label
                      variant="outlined"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : ""}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
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