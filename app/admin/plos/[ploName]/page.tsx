"use client";
import { useEffect, useState } from 'react'
import { Autocomplete, FormControl, Grid, IconButton, Popover, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CardBox from '#/components/CardBox';
import { ICurriculum } from '#/types/LTS/ILts';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import { IPlo } from '#/types/LTS/IPlo';
import useGetAllPlo from '#/hooks/useGetAllPlo';
import useUpdatePlo from '#/hooks/useUpdatePlo';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';

export default function Page() {
    const router = useRouter();
    const [ploNames, setPloNames] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event: any) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);
    const { ploName } = useParams();
    const pathname = decodeURIComponent(ploName as string);
    const session = useSession();
    const user = session.data?.user;
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IPlo>();
    const { mutateAsync: updatePlo, isLoading: isLoadingUpdatePlo } = useUpdatePlo();
    const { data: ploData, isLoading: isLoadingPloData } = useGetAllPlo();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("cur");
    const encodedPloId = searchParams.get("plo");
    const { encode, decode } = useUrlSafeBase64();
    const paramsId = encodedId ? decode(encodedId) : null;
    const ploId = encodedPloId ? decode(encodedPloId) : null;

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        const parsedData = ploData?.data?.find((item: IPlo) => item.id === Number(ploId));
        if (parsedData) {
            if (parsedData.ploName === pathname) {
                setPloNames(parsedData.ploName);
                Object.keys(parsedData).map((key) => {
                    setValue(key as keyof IPlo, parsedData[key as keyof IPlo]);
                });
            }
        }

    }, [setValue, pathname, ploData?.data, paramsId, ploId]);

    const checkExistingField = (data: IPlo, originalData?: IPlo) => {
        const errors: string[] = [];

        const hasDataChanged = !originalData ||
            originalData.ploName !== data.ploName ||
            originalData.ploDesc !== data.ploDesc;

        if (!hasDataChanged) {
            return errors;
        }

        if (ploData?.data) {
            ploData.data.filter((item: IPlo) => item.curriculum?.id === Number(paramsId)).forEach((subject: IPlo) => {
                if (subject.id === data.id) {
                    return;
                }

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
            const originalData = sessionStorage.getItem('subjectData');
            const parsedOriginalData = originalData ? JSON.parse(originalData) : null;

            const result = {
                ...data,
                ploName: data.ploName?.trim(),
                ploDesc: data.ploDesc?.trim(),
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

            await updatePlo(result);

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

            await router.push(`../plos?cur=${encode(paramsId ?? '')}`);

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
                title={`${ploNames === pathname ? `${ploNames}` : "404 not found"}`}
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="ยกเลิก"
                            icon={<CloseIcon />}
                            color='#db3131'
                            onClick={() => router.push(`../plos?cur=${encode(paramsId ?? '')}`)}
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
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>
                                    ผลลัพธ์การเรียนรู้ระดับหลักสูตร (PLOs)
                                    <IconButton onClick={handleClick}>
                                        <InfoIcon />
                                    </IconButton>
                                    <Popover
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                    >
                                        <Typography sx={{ p: 2, maxWidth: 350 }}>
                                            วิธีการสร้าง PLO สามารถทําได้ดังนี้<br /><br />
                                            1. PLOs ไว้สำหรับการสร้างกลุ่มข้อมูลไว้ใช้กับ Sub PLO เช่น ใน PLOs1 มี Sub PLO 1.1 และ Sub PLO 1.2<br />
                                            2. Sub PLO เป็น PLO ย่อยไว้ใช้กับ PLOs เช่น ใน PLOs1 มี Sub PLO 1.1 <br />
                                            3. PLO เป็นชุดข้อมูลโดยไม่เกี่ยวข้องกับการสร้างกลุ่มข้อมูลและ PLO ย่อย
                                        </Typography>
                                    </Popover>
                                </Typography>
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
                                            placeholder='ตัวอย่าง PLO1'
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
                                    rules={{ required: "กรุณาเลือกหลักสูตร" }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            autoFocus
                                            autoHighlight
                                            size='small'
                                            options={curriculumData?.data?.filter((item: ICurriculum) => item.id === Number(paramsId)) || []}
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