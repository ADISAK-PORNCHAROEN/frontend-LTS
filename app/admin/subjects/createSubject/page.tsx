"use client";
import Image from 'next/image'
import { SetStateAction, use, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { IUser } from '#/types/IResponse/IResponse';
import useDeleteUser from '#/hooks/useDeleteUser';
import { Button, FormControl, Grid, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import useUpdateUser from '#/hooks/useUpdateUser';
import { Controller, set, SubmitHandler, useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Table, { createColumn } from '#/components/table/Table';
import TableWithSearch from '#/components/table/TableWithSearch';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import CardBox from '#/components/CardBox';
import { ISubjects } from '#/types/LTS/ILts';
import { useRouter } from 'next/navigation';
import useCreateSubjects from '#/hooks/useCreateSubjects';

export default function Home() {
    const router = useRouter();
    const { control, handleSubmit, formState: { errors } } = useForm<ISubjects>();
    const { mutateAsync: createSubjects, isLoading: isLoadingCreateSubjects } = useCreateSubjects();

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    const Status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    const handleSubmitSubject: SubmitHandler<ISubjects> = async (data: ISubjects) => {
        try {
            const result = {
                ...data,
                subStatus: Status.isActive,
                createdDate: new Date(),
            }
            console.log(result)
            await createSubjects(result)

            setTypeAlertBox("success");
            setTextAlertBox("Create Success");
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500)

            await router.push("../subjects")

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
                title="Create Subject"
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="Confirm"
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
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>รหัสและชื่อรายวิชา</Typography>
                                <Controller
                                    control={control}
                                    name="subId"
                                    defaultValue=""
                                    rules={{ required: "Subject ID is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="รหัสวิชา"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.subId}
                                            helperText={errors.subId?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="subNameTh"
                                    defaultValue=""
                                    rules={{ required: "Subject Name Th is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อวิชา (ภาษาไทย)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.subNameTh}
                                            helperText={errors.subNameTh?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="subNameEn"
                                    defaultValue=""
                                    rules={{ required: "Subject Name En is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อวิชา (ภาษาอังกฤษ)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.subNameEn}
                                            helperText={errors.subNameEn?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>สมรรถนะรายวิชา</Typography>
                                <Controller
                                    control={control}
                                    name="subClo"
                                    defaultValue=""
                                    rules={{ required: "Subject CLO is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="สมรรถนะรายวิชา"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            maxRows={8}
                                            error={!!errors.subClo}
                                            helperText={errors.subClo?.message}
                                            onChange={(e) => {
                                                // Auto-format numbered list
                                                const value = e.target.value;
                                                const lines = value.split('\n');
                                                const formattedLines = lines.map((line, index) => {
                                                    // If line starts with a number, don't add a new number
                                                    if (/^\d+\./.test(line)) return line;
                                                    return `${index + 1}. ${line.replace(/^\d+\.\s*/, '')}`;
                                                });
                                                field.onChange(formattedLines.join('\n'));
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>คำอธิบายรายวิชา</Typography>
                                <Controller
                                    control={control}
                                    name="subDescTh"
                                    defaultValue=""
                                    rules={{ required: "Subject Description Th is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="คำอธิบายรายวิชา (ภาษาไทย)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={2}
                                            maxRows={4}
                                            error={!!errors.subDescTh}
                                            helperText={errors.subDescTh?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="subDescEn"
                                    defaultValue=""
                                    rules={{ required: "Subject Description En is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="คำอธิบายรายวิชา (ภาษาอังกฤษ)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={2}
                                            maxRows={4}
                                            error={!!errors.subDescEn}
                                            helperText={errors.subDescEn?.message}
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