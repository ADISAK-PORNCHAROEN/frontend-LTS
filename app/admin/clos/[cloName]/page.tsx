"use client";
import { useEffect, useState } from 'react'
import { Autocomplete, FormControl, Grid, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CardBox from '#/components/CardBox';
import { ICurriculum, ISubjects } from '#/types/LTS/ILts';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import { IClo } from '#/types/LTS/IPlo';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import useGetAllClo from '#/hooks/useGetAllClo';
import useUpdateClo from '#/hooks/useUpdateClo';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';

export default function Page() {
    const router = useRouter();
    const [cloNames, setCloNames] = useState<string | null>(null);
    // const [subjectNameTh, setSubjectNameTh] = useState<string>("");
    const { cloName } = useParams();
    const pathname = decodeURIComponent(cloName as string);
    const session = useSession();
    const user = session.data?.user;
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IClo>();
    const { data: cloData, isLoading: isLoadingPloData } = useGetAllClo();
    const { mutateAsync: updateClo, isLoading: isLoadingUpdateClo } = useUpdateClo();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("id");
    const subId = searchParams.get("sub1");
    const curriculumId = searchParams.get("cur");
    const { encode, decode } = useUrlSafeBase64();
    const paramsId = Number(encodedId ? decode(encodedId) : null);
    const paramsSubId = Number(subId ? decode(subId) : null);
    const paramsCurId = Number(curriculumId ? decode(curriculumId) : null);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        const parsedData = cloData?.data?.find((item: IClo) => item.id === paramsId && item.subjects?.id === paramsSubId && item.curriculum?.id === paramsCurId);
        // console.log("parsedData", parsedData);
        if (parsedData) {
            if (parsedData.cloName === pathname) {
                setCloNames(parsedData.cloName);
                Object.keys(parsedData).map((key) => {
                    setValue(key as keyof IClo, parsedData[key as keyof IClo]);
                });
            }
        }

    }, [setValue, pathname, cloData?.data, paramsSubId, paramsCurId, paramsId]);

    const checkExistingField = (data: IClo, originalData?: IClo) => {
        const errors: string[] = [];

        const hasDataChanged = !originalData ||
            originalData.cloName !== data.cloName ||
            originalData.cloDesc !== data.cloDesc;

        // console.log("hasDataChanged", hasDataChanged);

        if (!hasDataChanged) {
            return errors;
        }

        if (cloData?.data) {
            cloData.data.filter((item: IClo) => item.subjects?.id === paramsSubId && item.curriculum?.id === paramsCurId).forEach((subject: IClo) => {
                if (subject.id === data.id) {
                    return;
                }

                if (subject.cloName === data.cloName) {
                    errors.push("CLO นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }

                if (subject.cloDesc === data.cloDesc) {
                    errors.push("คําอธิบาย CLO นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }

            });
        }
        return errors;
    };

    const handleSubmitSubject: SubmitHandler<IClo> = async (data: IClo) => {
        try {
            const originalData = sessionStorage.getItem('subjectData');
            const parsedOriginalData = originalData ? JSON.parse(originalData) : null;

            const result = {
                ...data,
                cloName: data.cloName?.trim(),
                cloDesc: data.cloDesc?.trim(),
                updatedDate: new Date(),
                updatedBy: user?.name
            };
            // console.log("result", result);

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

            await updateClo(result);

            setTypeAlertBox("success");
            setTextAlertBox("แก้ไขข้อมูลสำเร็จ");
            setIsOpenAlertBox(true);

            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                    resolve();
                }, 1500);
            });

            await router.push(`../clos?id=${subId}&cur=${curriculumId}`);

        } catch (error) {
            setTypeAlertBox("warning");
            setTextAlertBox(error as string);
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);
        }
    };

    const subjectName = cloData?.data?.find((item: IClo) => item.subjects?.id === paramsSubId && item.curriculum?.id === paramsCurId && item.id === paramsId)?.cloName ?
        `${cloData?.data?.find((item: IClo) => item.subjects?.id === paramsSubId && item.curriculum?.id === paramsCurId && item.id === paramsId)?.cloName}`
        : "404 Not Found";

    return (
        <>
            <PageContentLayout
                title={`${subjectName}`}
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="ยกเลิก"
                            icon={<CloseIcon />}
                            color='#db3131'
                            onClick={() => router.push(`../clos?id=${subId}&cur=${curriculumId}`)}
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
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs)</Typography>
                                <Controller
                                    control={control}
                                    name="cloName"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกชื่อ CLO" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อ CLO"
                                            variant="outlined"
                                            size="small"
                                            placeholder='Ex. CLO1'
                                            fullWidth
                                            error={!!errors.cloName}
                                            helperText={errors.cloName?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="cloDesc"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกคำอธิบาย CLO" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="คำอธิบาย CLO"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={2}
                                            maxRows={4}
                                            error={!!errors.cloDesc}
                                            helperText={errors.cloDesc?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="curriculum"
                                    defaultValue={null}
                                    rules={{ required: "กรุณาเลือกหลักสูตร" }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            autoFocus
                                            autoHighlight
                                            size='small'
                                            options={curriculumData?.data?.filter((item: ICurriculum) => item.id === paramsCurId) || []}
                                            getOptionLabel={(option: ICurriculum) => option.degreeFullTh || ""}
                                            onChange={(event, value) => field.onChange(value)}
                                            value={field.value || null}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => (
                                                <TextField {...params} label="หลักสูตรรายวิชา"
                                                    required
                                                    error={!!errors.curriculum}
                                                    helperText={errors.curriculum?.message}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="subjects"
                                    defaultValue={null}
                                    rules={{ required: "กรุณาเลือกรายวิชา" }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            autoFocus
                                            autoHighlight
                                            size='small'
                                            options={subjectsData?.data?.filter((item: ISubjects) => item.id === paramsSubId) || []}
                                            getOptionLabel={(option: ISubjects) => option.subNameTh || ""}
                                            onChange={(event, value) => field.onChange(value)}
                                            value={field.value}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => (
                                                <TextField {...params} label="รายวิชา"
                                                    required
                                                    error={!!errors.subjects}
                                                    helperText={errors.subjects?.message}
                                                />
                                            )}
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