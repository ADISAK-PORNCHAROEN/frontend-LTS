"use client";
import { useEffect, useState } from 'react'
import { Button, FormControl, Grid, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Controller, set, SubmitHandler, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CardBox from '#/components/CardBox';
import { ISubjects } from '#/types/LTS/ILts';
import { useParams, usePathname, useRouter } from 'next/navigation';
import useUpdateSubjects from '#/hooks/useUpdateSubjects';
import { IUser } from '#/types/IResponse/IResponse';
import useUpdateUser from '#/hooks/useUpdateUser';

// type Props = {
//     params: Promise<{ subNameTh: string }>;
// }

export default function Page() {
    const router = useRouter();
    const [namePath, setNamePath] = useState<string | null>(null);
    const { name } = useParams();
    const pathname = decodeURIComponent(name as string);
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IUser>();
    const { mutateAsync: updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        const storedData = sessionStorage.getItem('accountsData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setNamePath(parsedData.name);
            if (parsedData.name === pathname) {
                // Set form values from stored data
                Object.keys(parsedData).forEach((key) => {
                    setValue(key as keyof IUser, parsedData[key]);
                });
            }
        }
    }, [setValue, pathname]);

    const status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    const handleSubmitSubject: SubmitHandler<IUser> = async (data: IUser) => {
        try {
            const result = {
                ...data,
                // subStatus: status.isActive,
                updatedDate: new Date(),
            }
            console.log(result)
            sessionStorage.setItem('accountsData', JSON.stringify(result));

            await updateUser(result)

            setTypeAlertBox("success");
            setTextAlertBox("Edit Success");
            setIsOpenAlertBox(true);
            setTimeout(() => {
                sessionStorage.removeItem('accountsData');
                setIsOpenAlertBox(false);
            }, 1500)

            await router.push("../accounts")

        } catch (error) {
            setTypeAlertBox("warning");
            setTextAlertBox(error as string);
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500)
        }
    }

    return (
        <>
            <PageContentLayout
                title={`${namePath === pathname ? `${namePath}` : "404 not found"}`}
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="Cancel"
                            icon={<CloseIcon />}
                            color='#db3131'
                            onClick={() => router.push("../accounts")}
                        />

                        <ActionBtn
                            title="Save"
                            icon={<AddIcon />}
                            onClick={handleSubmit((data) => handleSubmitSubject(data))}
                        />
                    </>
                }
            >
                <CardBox>
                    <FormControl fullWidth>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>ข้อมูล {namePath === pathname ? `${namePath}` : "404 not found"}</Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="fname"
                                    defaultValue=""
                                    rules={{ required: "First Name is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อ"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.fname}
                                            helperText={errors.fname?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="lname"
                                    defaultValue=""
                                    rules={{ required: "Last Name is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="นามสกุล"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.lname}
                                            helperText={errors.lname?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: "Invalid email address"
                                        }
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="อีเมล"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!error}
                                            inputProps={{ type: 'email' }}
                                            helperText={error ? error.message : ''}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="role"
                                    defaultValue=""
                                    rules={{ required: "Role is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ตำแหน่ง"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.role}
                                            helperText={errors.role?.message}
                                        />
                                    )}
                                />
                            </Grid>

                        </Grid>
                    </FormControl>
                </CardBox>

                <Alert
                    text={textAlertBox}
                    type={typeAlertBox}
                    isOpen={isOpenAlertBox}
                    setIsOpen={setIsOpenAlertBox}
                />
            </PageContentLayout>
        </>
    )
}