"use client";
import { useEffect, useState } from 'react'
import { Autocomplete, FormControl, FormHelperText, Grid, InputLabel, Menu, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import CardBox from '#/components/CardBox';
import { ICurriculum, ISubjects } from '#/types/LTS/ILts';
import { useRouter } from 'next/navigation';
import useCreateSubjects from '#/hooks/useCreateSubjects';
import { useSession } from 'next-auth/react';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';

export default function Home() {
    const [subData, setSubData] = useState<ISubjects[]>([])
    const router = useRouter();
    const session = useSession();
    const user = session.data?.user;
    const { control, handleSubmit, formState: { errors } } = useForm<ISubjects>();
    const { mutateAsync: createSubjects, isLoading: isLoadingCreateSubjects } = useCreateSubjects();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    const status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    useEffect(() => {
        if (subjectsData?.data) {
            setSubData(subjectsData?.data)
        }
    }, [subjectsData])

    const checkExistingField = (data: ISubjects) => {
        const errors: string[] = [];

        if (subjectsData?.data) {
            subjectsData.data.forEach((subject: ISubjects) => {
                if (subject.subId === data.subId) {
                    errors.push("รหัสวิชานี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
                if (subject.subNameTh === data.subNameTh) {
                    errors.push("ชื่อวิชา(ภาษาไทย) นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
                if (subject.subNameEn === data.subNameEn) {
                    errors.push("ชื่อวิชา(ภาษาอังกฤษ) นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
            });
        }
        return errors;
    };

    const handleSubmitSubject: SubmitHandler<ISubjects> = async (data: ISubjects) => {
        try {
            const result = {
                ...data,
                subId: data.subId?.trim(),
                subNameTh: data.subNameTh?.trim(),
                subNameEn: data.subNameEn?.trim(),
                createdDate: new Date(),
                createdBy: user?.name,
            }

            const validationErrors = checkExistingField(result);

            if (validationErrors.length > 0) {
                setTypeAlertBox("warning");
                setTextAlertBox(validationErrors[0]);
                setIsOpenAlertBox(true);
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                }, 1500);
                return;
            }

            await createSubjects(result)

            setTypeAlertBox("success");
            setTextAlertBox("บันทึกข้อมูลสําเร็จ");
            setIsOpenAlertBox(true);
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                    resolve();
                }, 1500)
            });

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
                title="สร้างรายวิชา"
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="ยกเลิก"
                            icon={<CloseIcon />}
                            color='#db3131'
                            onClick={() => router.push("../subjects")}
                        />
                        <ActionBtn
                            title="บันทึก"
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
                                    rules={{ required: "กรุณากรอกรหัสวิชา" }}
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
                                    rules={{ required: "กรุณากรอกชื่อวิชา (ภาษาไทย)" }}
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
                                    rules={{ required: "กรุณากรอกชื่อวิชา (ภาษาอังกฤษ)" }}
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

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="curriculum"
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            autoFocus
                                            autoHighlight
                                            size='small'
                                            options={curriculumData?.data || []}
                                            getOptionLabel={(option: ICurriculum) => option.degreeFullTh || ""}
                                            onChange={(event, value) => field.onChange(value)}
                                            value={field.value || null}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => (
                                                <TextField {...params} label="หลักสูตรรายวิชา" />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="subStatus"
                                    defaultValue=""
                                    rules={{ required: "กรุณาเลือกสถานะรายวิชา" }}
                                    render={({ field }) => (
                                        <FormControl fullWidth size="small" error={!!errors.subStatus}>
                                            <InputLabel>{<span>สถานะรายวิชา{" "} <span style={{ color: "red" }}>*</span> </span>}</InputLabel>
                                            <Select
                                                {...field}
                                                required
                                                label={
                                                    <span>
                                                        สถานะรายวิชา{" "}
                                                        <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                }
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                renderValue={(selectedValue) => {
                                                    if (selectedValue === status.isActive) {
                                                        return <span style={{ color: 'green' }}>🟢 {selectedValue}</span>;
                                                    } else {
                                                        return <span style={{ color: 'red' }}>🔴 {selectedValue}</span>;
                                                    }
                                                }}
                                            >
                                                <MenuItem value={status.isActive} sx={{ color: 'green' }}>🟢 Active</MenuItem>
                                                <MenuItem value={status.isInactive} sx={{ color: 'red' }}>🔴 Inactive</MenuItem>
                                            </Select>
                                            {errors.subStatus && (
                                                <FormHelperText>{errors.subStatus.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>สมรรถนะรายวิชา</Typography>
                                <Controller
                                    control={control}
                                    name="subClo"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกสมรรถนะรายวิชา" }}
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
                                                field.onChange(e.target.value);
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
                                    rules={{ required: "กรุณากรอกคำอธิบายรายวิชา (ภาษาไทย)" }}
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
                                    rules={{ required: "กรุณากรอกคำอธิบายรายวิชา (ภาษาอังกฤษ)" }}
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
    );
}