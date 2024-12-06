import React, { useCallback, useState } from "react";
import { Controller, SubmitHandler, UseFormReturn } from "react-hook-form";
import { FormControl, TextField, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IUser } from "#/types/projectManagement/IResponse";
import AlertForm from "./AlertForm";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hook: UseFormReturn<IUser, any>;
  title: string;
  handleSubmit: SubmitHandler<IUser>;
};

export default function CreateUserModal({
  isOpen,
  setIsOpen,
  hook,
  title,
  handleSubmit,
}: Props) {
  const {
    control: controlContactForm,
    handleSubmit: handleSubmitCreateUser,
    formState: { errors },
    reset
  } = hook;

  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [userOption, setUserOption] = useState<IAdmUsers[]>([]);
  // const [dates, setDates] = React.useState<{ [key: string]: { startDate: Dayjs | null; endDate: Dayjs | null } }>({});

  const closeModal = useCallback(() => {
    setIsOpen(false);
    reset();
    setIsSubmitting(false);
  }, [setIsOpen, reset]);

  /* const { data: memberData, isLoading: isLoadingMemberData } = useGetAllUsers();

  useEffect(() => {
    if (memberData) {
      // Check if data is in memberData.data or directly in memberData
      const sourceData = Array.isArray(memberData) ? memberData :
        Array.isArray(memberData.data) ? memberData.data : [];

      const transformedData = sourceData.map((member: any) => ({
        userId: member.id || member.userId || null,
        username: member.username || '',
        employeeCode: member.employeeCode || null,
        firstName: member.firstName || null,
        lastName: member.lastName || null,
        activeStatus: member.activeStatus || '',
        jobTitle: member.jobTitle || null,
        identityCode: member.identityCode || null,
        name: `${member.firstName || ''} ${member.lastName || ''}`.trim(),
        role: member.jobTitle || 'N/A',
      }));


      setUserOption(transformedData);
    }
  }, [memberData]); */

  const onSubmit = async (data: IUser) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await handleSubmit(data);
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
    handleSubmitCreateUser(onSubmit)();
  };

  // Loading state
  /* if (isLoadingMemberData) {
    return (
      <AlertForm isOpen={isOpen} setIsOpen={setIsOpen} style={{ width: "600px" }}>
        <div className="flex justify-center items-center h-40">
          Loading users...
        </div>
      </AlertForm>
    );
  } */

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
            control={controlContactForm}
            defaultValue=""
            rules={{ required: "username is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                label="Username"
                variant="outlined"
                size="small"
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />

          <Controller
            name="email"
            control={controlContactForm}
            defaultValue=""
            rules={{ required: "email is required" }}
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