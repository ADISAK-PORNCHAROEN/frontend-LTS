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
import { ICurriculum } from '#/types/LTS/ILts';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import { IPlo } from '#/types/LTS/IPlo';
import useGetAllPlo from '#/hooks/useGetAllPlo';
import useCreatePlo from '#/hooks/useCreatePlo';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';

export default function Home() {
    const [subData, setSubData] = useState<IPlo[]>([])
    const [defaultCurriculum, setDefaultCurriculum] = useState<ICurriculum>({});
    const router = useRouter();
    const session = useSession();
    const user = session.data?.user;
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IPlo>();
    const { mutateAsync: createPlo, isLoading: isLoadingCreatePlo } = useCreatePlo();
    const { data: ploData, isLoading: isLoadingPloData } = useGetAllPlo();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("id");
    const { encode, decode } = useUrlSafeBase64();
    const paramsId = encodedId ? decode(encodedId) : null;

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        if (ploData?.data) {
            setSubData(ploData?.data)
        }

        if (curriculumData?.data && paramsId) {
            const matchedCurriculum = curriculumData.data.find(
                (curriculum) => curriculum.id?.toString() === paramsId
            );

            if (matchedCurriculum) {
                setValue("curriculum", matchedCurriculum);
                // setDefaultCurriculum(matchedCurriculum);
            }
        }
    }, [curriculumData?.data, paramsId, ploData, setValue])

    const checkExistingField = (data: IPlo) => {
        const errors: string[] = [];

        if (ploData?.data) {
            ploData.data.filter((item: IPlo) => item.curriculum?.id === Number(paramsId)).forEach((subject: IPlo) => {
                if (subject.ploName === data.ploName) {
                    errors.push("PLO นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }

                if (subject.ploDesc === data.ploDesc) {
                    errors.push("คําอธิบาย PLO นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
            });
        }
        return errors;
    };

    const handleSubmitSubject: SubmitHandler<IPlo> = async (data: IPlo) => {
        try {
            const result = {
                ...data,
                ploName: data.ploName?.trim(),
                ploDesc: data.ploDesc?.trim(),
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

            await createPlo(result)

            setTypeAlertBox("success");
            setTextAlertBox("บันทึกข้อมูลสําเร็จ");
            setIsOpenAlertBox(true);
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                    resolve();
                }, 1500)
            });

            await router.push(`../plos?id=${encode(paramsId ?? '')}`);

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
                title="Create PLO"
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="ยกเลิก"
                            icon={<CloseIcon />}
                            color='#db3131'
                            onClick={() => router.push(`../plos?id=${encode(paramsId ?? '')}`)}
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
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>ผลลัพธ์การเรียนรู้ระดับหลักสูตร (PLOs)</Typography>
                                <Controller
                                    control={control}
                                    name="ploName"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอก PLO" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="PLO"
                                            variant="outlined"
                                            size="small"
                                            placeholder='Ex. PLO1'
                                            fullWidth
                                            error={!!errors.ploName}
                                            helperText={errors.ploName?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="ploDesc"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกคำอธิบาย PLO" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="คำอธิบาย PLO"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={2}
                                            maxRows={4}
                                            error={!!errors.ploDesc}
                                            helperText={errors.ploDesc?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="curriculum"
                                    defaultValue={null}
                                    rules={{ required: "กรุณากรอกหลักสูตร" }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            autoFocus
                                            autoHighlight
                                            size='small'
                                            options={curriculumData?.data?.filter((item: ICurriculum) => item.id === Number(paramsId)) || []}
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