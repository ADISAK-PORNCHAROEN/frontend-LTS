"use client";
import { useEffect, useState } from 'react'
import { Autocomplete, Button, FormControl, Grid, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CardBox from '#/components/CardBox';
import { ICurriculum, ISubjects } from '#/types/LTS/ILts';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import { IClo } from '#/types/LTS/IPlo';
import useGetAllPlo from '#/hooks/useGetAllPlo';
import useCreatePlo from '#/hooks/useCreatePlo';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import useCreateClo from '#/hooks/useCreateClo';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import useGetAllClo from '#/hooks/useGetAllClo';

export default function Home() {
    const [subData, setSubData] = useState<IClo[]>([])
    const [defaultCurriculum, setDefaultCurriculum] = useState<ICurriculum>({});
    const router = useRouter();
    const session = useSession();
    const user = session.data?.user;
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IClo>();
    const { mutateAsync: createClo, isLoading: isLoadingCreateClo } = useCreateClo();
    const { data: cloData, isLoading: isLoadingPloData } = useGetAllClo();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("id");
    const curriculumId = searchParams.get("cur");
    const { encode, decode } = useUrlSafeBase64();
    const paramsSubId = Number(encodedId ? decode(encodedId) : null);
    const paramsCurId = Number(curriculumId ? decode(curriculumId) : null);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        if (cloData?.data) {
            setSubData(cloData?.data)
        }

        if (curriculumData?.data && paramsCurId) {
            const matchedCurriculum = curriculumData.data.find(
                (curriculum) => curriculum.id === paramsCurId
            );

            if (matchedCurriculum) {
                setValue("curriculum", matchedCurriculum);
            }
        }

        if (subjectsData?.data && paramsSubId) {
            const matchedSubjects = subjectsData.data.find(
                (subjects) => subjects.id === paramsSubId
            );

            if (matchedSubjects) {
                setValue("subjects", matchedSubjects);
            }
        }
    }, [curriculumData?.data, paramsCurId, cloData, setValue, subjectsData?.data, paramsSubId])

    const checkExistingField = (data: IClo) => {
        const errors: string[] = [];

        if (cloData?.data) {
            cloData.data.filter((item: IClo) => item.curriculum?.id === paramsCurId && item.subjects?.id === paramsSubId).forEach((subject: IClo) => {
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
            const result = {
                ...data,
                cloName: data.cloName?.trim(),
                cloDesc: data.cloDesc?.trim(),
                createdDate: new Date(),
                createdBy: user?.name,
            }
            // console.log("result", result)

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

            await createClo(result)

            setTypeAlertBox("success");
            setTextAlertBox("บันทึกข้อมูลสําเร็จ");
            setIsOpenAlertBox(true);
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                    resolve();
                }, 1500)
            });

            await router.push(`../clos?id=${encodedId}&cur=${curriculumId}`);

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
                title="สร้าง CLOs"
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="ยกเลิก"
                            icon={<CloseIcon />}
                            color='#db3131'
                            onClick={() => router.push(`../clos?id=${encodedId}&cur=${curriculumId}`)}
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
                                            value={field.value || defaultCurriculum}
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