"use client";
import { useEffect, useState } from 'react'
import { Autocomplete, Button, FormControl, FormHelperText, Grid, InputLabel, Menu, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CardBox from '#/components/CardBox';
import { ICurriculum, ISubjects } from '#/types/LTS/ILts';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import useUpdateSubjects from '#/hooks/useUpdateSubjects';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import { useSession } from 'next-auth/react';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';

export default function Page() {
    const router = useRouter();
    const [subjectName, setSubjectName] = useState<string | null>(null);
    const [subjectNameTh, setSubjectNameTh] = useState<string>("");
    const { subNameEn } = useParams();
    const pathname = decodeURIComponent(subNameEn as string);
    const session = useSession();
    const user = session.data?.user;
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<ISubjects>();
    const { mutateAsync: updateSubjects, isLoading: isLoadingUpdateSubjects } = useUpdateSubjects();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const { encode, decode } = useUrlSafeBase64();
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("id");
    const paramsId = encodedId ? decode(encodedId) : null;

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        const parsedData = subjectsData?.data?.find((item: ISubjects) => item.id === Number(paramsId));
        if (parsedData) {
            if (parsedData.subNameEn === pathname) {
                setSubjectName(parsedData.subNameEn);
                setSubjectNameTh(parsedData.subNameTh || "");
                Object.keys(parsedData).map((key) => {
                    setValue(key as keyof ISubjects, parsedData[key as keyof ISubjects]);
                });
            }
        }

    }, [setValue, pathname, subjectsData?.data, paramsId]);

    const status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    const checkExistingField = (data: ISubjects, originalData?: ISubjects) => {
        const errors: string[] = [];

        const hasDataChanged = !originalData ||
            originalData.subId !== data.subId ||
            originalData.subNameTh !== data.subNameTh ||
            originalData.subNameEn !== data.subNameEn;

        // console.log("hasDataChanged", hasDataChanged);

        if (!hasDataChanged) {
            return errors;
        }

        if (subjectsData?.data) {
            subjectsData.data.forEach((subject: ISubjects) => {
                if (subject.id === data.id) {
                    return;
                }

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
            const originalData = sessionStorage.getItem('subjectData');
            const parsedOriginalData = originalData ? JSON.parse(originalData) : null;

            const result = {
                ...data,
                subId: data.subId?.trim(),
                subNameTh: data.subNameTh?.trim(),
                subNameEn: data.subNameEn?.trim(),
                // subStatus: status.isActive,
                updatedDate: new Date(),
                updatedBy: user?.name
            };

            const validationErrors = checkExistingField(result, parsedOriginalData);

            if (validationErrors.length > 0) {
                setTypeAlertBox("warning");
                setTextAlertBox(validationErrors[0]);
                setIsOpenAlertBox(true);
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                }, 1500);
                return;
            }

            await updateSubjects(result);

            setTypeAlertBox("success");
            setTextAlertBox("แก้ไขข้อมูลสำเร็จ");
            setIsOpenAlertBox(true);

            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    sessionStorage.removeItem('subjectData');
                    setIsOpenAlertBox(false);
                    resolve();
                }, 1500);
            });

            await router.push("../subjects");

        } catch (error) {
            setTypeAlertBox("warning");
            setTextAlertBox(error as string);
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);
        }
    };

    return (
        <>
            <PageContentLayout
                title="Create Subject"
                icon={<AccountBoxIcon />}
                actions={
                    <>
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