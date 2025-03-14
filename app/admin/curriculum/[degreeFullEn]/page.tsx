"use client";
import { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react'
import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { Controller, set, SubmitHandler, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
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
import useUpdateCurruculum from '#/hooks/useUpdateCurruculum';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';

export default function Page() {
    const router = useRouter();
    const [subjectName, setSubjectName] = useState<string | null>(null);
    const [subjectNameTh, setSubjectNameTh] = useState<string>("");
    const { degreeFullEn } = useParams();
    const pathname = decodeURIComponent(degreeFullEn as string);
    const session = useSession();
    const user = session.data?.user;
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<ICurriculum>();
    const { mutateAsync: updateCurrriculum, isLoading: isLoadingUpdateCurrriculum } = useUpdateCurruculum();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const { encode, decode } = useUrlSafeBase64();
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("id");
    const paramsId = encodedId ? decode(encodedId) : null;
    const selectedType = watch('curriculumType');

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        const parsedData = curriculumData?.data?.find((item: ICurriculum) => item.id === Number(paramsId));
        if (parsedData) {
            if (parsedData.degreeFullEn === pathname) {
                setSubjectName(parsedData.degreeFullEn);
                setSubjectNameTh(parsedData.degreeFullTh || "");
                Object.keys(parsedData).map((key) => {
                    setValue(key as keyof ICurriculum, parsedData[key as keyof ICurriculum]);
                });
            }
        }

    }, [setValue, pathname, paramsId, curriculumData?.data]);

    const checkExistingField = (data: ICurriculum, originalData?: ICurriculum) => {
        const errors: string[] = [];

        const hasDataChanged = !originalData ||
            originalData.curriculumCode !== data.curriculumCode ||
            originalData.nameTh !== data.nameTh ||
            originalData.nameEn !== data.nameEn ||
            originalData.degreeFullTh !== data.degreeFullTh ||
            originalData.degreeShortTh !== data.degreeShortTh ||
            originalData.degreeFullEn !== data.degreeFullEn ||
            originalData.degreeShortEn !== data.degreeShortEn;

        // console.log("hasDataChanged", hasDataChanged);

        if (!hasDataChanged) {
            return errors;
        }

        if (curriculumData?.data) {
            curriculumData.data.forEach((subject: ICurriculum) => {
                if (subject.id === data.id) {
                    return;
                }

                if (subject.curriculumCode === data.curriculumCode) {
                    errors.push("รหัสหลักสูตรนี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
                if (subject.nameTh === data.nameTh) {
                    errors.push("ชื่อหลักสูตร(ภาษาไทย) นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
                if (subject.nameEn === data.nameEn) {
                    errors.push("ชื่อหลักสูตร(ภาษาอังกฤษ) นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
                if (subject.degreeFullTh === data.degreeFullTh) {
                    errors.push("ชื่อปริญญาเต็ม(ภาษาไทย) นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
                if (subject.degreeShortTh === data.degreeShortTh) {
                    errors.push("ชื่อปริญญาย่อ(ภาษาไทย) นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
                if (subject.degreeFullEn === data.degreeFullEn) {
                    errors.push("ชื่อปริญญาเต็ม(ภาษาอังกฤษ) นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
                if (subject.degreeShortEn === data.degreeShortEn) {
                    errors.push("ชื่อปริญญาย่อ(ภาษาอังกฤษ) นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }
            });
        }
        return errors;
    };

    const handleSubmitSubject: SubmitHandler<ICurriculum> = async (data: ICurriculum) => {
        try {
            const originalData = sessionStorage.getItem('subjectData');
            const parsedOriginalData = originalData ? JSON.parse(originalData) : null;

            const result = {
                ...data,
                curriculumCode: data.curriculumCode?.trim(),
                nameTh: data.nameTh?.trim(),
                nameEn: data.nameEn?.trim(),
                degreeFullTh: data.degreeFullTh?.trim(),
                degreeShortTh: data.degreeShortTh?.trim(),
                degreeFullEn: data.degreeFullEn?.trim(),
                degreeShortEn: data.degreeShortEn?.trim(),
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

            await updateCurrriculum(result);

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

            await router.push("../curriculum");

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
                title={`${subjectName === pathname ? `${subjectNameTh}` : "404 not found"}`}
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="ยกเลิก"
                            icon={<CloseIcon />}
                            color='#db3131'
                            onClick={() => router.push("../curriculum")}
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
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>1. รหัสและชื่อหลักสูตร</Typography>
                                <Controller
                                    control={control}
                                    name="curriculumCode"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกรหัสหลักสูตร" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="รหัสหลักสูตร"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.curriculumCode}
                                            helperText={errors.curriculumCode?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="nameTh"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกชื่อหลักสูตร (ภาษาไทย)" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อหลักสูตร (ภาษาไทย)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.nameTh}
                                            helperText={errors.nameTh?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="nameEn"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกชื่อหลักสูตร (ภาษาอังกฤษ)" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อหลักสูตร (ภาษาอังกฤษ)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.nameEn}
                                            helperText={errors.nameEn?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px", fontWeight: "bold" }}>2. ชื่อปริญญาและสาขาวิชา</Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="degreeFullTh"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกชื่อปริญญาเต็ม (ภาษาไทย)" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อปริญญาเต็ม (ภาษาไทย)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.degreeFullTh}
                                            helperText={errors.degreeFullTh?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="degreeShortTh"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกชื่อปริญญาย่อ (ภาษาไทย)" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อปริญญาย่อ (ภาษาไทย)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.degreeShortTh}
                                            helperText={errors.degreeShortTh?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="degreeFullEn"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกชื่อปริญญาเต็ม (ภาษาอังกฤษ)" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อปริญญาเต็ม (ภาษาอังกฤษ)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.degreeFullEn}
                                            helperText={errors.degreeFullEn?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="degreeShortEn"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกชื่อปริญญาย่อ (ภาษาอังกฤษ)" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อปริญญาย่อ (ภาษาอังกฤษ)"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.degreeShortEn}
                                            helperText={errors.degreeShortEn?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>3. วิชาเอก</Typography>
                                <Controller
                                    control={control}
                                    name="major"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกวิชาเอก" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="วิชาเอก"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={1}
                                            maxRows={2}
                                            error={!!errors.major}
                                            helperText={errors.major?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>4. จำนวนหน่วยกิตที่เรียนตลอดหลักสูตร</Typography>
                                <Controller
                                    control={control}
                                    name="totalCredits"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกจำนวนหน่วยกิต" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="จำนวนหน่วยกิตตลอดหลักสูตร"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={1}
                                            maxRows={2}
                                            error={!!errors.major}
                                            helperText={errors.major?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px", fontWeight: "bold" }}>5. รูปแบบของหลักสูตร</Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="programType"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกรูปแบบของหลักสูตร" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="5.1 รูปแบบของหลักสูตร"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.programType}
                                            helperText={errors.programType?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="degreeCategory"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกประเภทของหลักสูตร" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="5.2 ประเภทของหลักสูตร"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.degreeCategory}
                                            helperText={errors.degreeCategory?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="language"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกภาษาที่ใช้ในหลักสูตร" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="5.3 ภาษาที่ใช้ในหลักสูตร"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.language}
                                            helperText={errors.language?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="acceptance"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกการรับเข้าศึกษา" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="5.4 การรับเข้าศึกษา"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.acceptance}
                                            helperText={errors.acceptance?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="integration"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกการบูรณาการหลักสูตร" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="5.5 การบูรณาการหลักสูตร"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.integration}
                                            helperText={errors.integration?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="collaboration"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกความร่วมมือกับสถาบันอื่น" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="5.6 ความร่วมมือกับสถาบันอื่น"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.collaboration}
                                            helperText={errors.collaboration?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="degreeGranted"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกการให้ปริญญาแก่ผู้สำเร็จการศึกษา" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="5.7 การให้ปริญญาแก่ผู้สำเร็จการศึกษา"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.degreeGranted}
                                            helperText={errors.degreeGranted?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>
                                    6. สถานภาพของหลักสูตรและการพิจารณาอนุมัติ/เห็นชอบหลักสูตร
                                </Typography>

                                <Controller
                                    control={control}
                                    name="curriculumType"
                                    defaultValue=""
                                    rules={{ required: "กรุณาเลือกประเภทหลักสูตร" }}
                                    render={({ field }) => (
                                        <FormControl component="fieldset" error={!!errors.curriculumType}>
                                            <FormLabel component="legend">ประเภทหลักสูตร</FormLabel>
                                            <RadioGroup {...field} row>
                                                <FormControlLabel value="new" control={<Radio />} label="หลักสูตรใหม่" />
                                                <FormControlLabel value="improved" control={<Radio />} label="หลักสูตรปรับปรุง" />
                                            </RadioGroup>
                                            {errors.curriculumType && (
                                                <Typography color="error" variant="caption">
                                                    {errors.curriculumType.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Controller
                                    control={control}
                                    name="approvalCurriculum"
                                    defaultValue=""
                                    rules={{
                                        required: selectedType === 'new' ? "กรุณากรอกข้อมูลหลักสูตรใหม่" : false
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="รายละเอียดหลักสูตรใหม่"
                                            variant="outlined"
                                            size="small"
                                            required
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            maxRows={8}
                                            disabled={selectedType !== 'new'}
                                            error={!!errors.approvalCurriculum}
                                            helperText={errors.approvalCurriculum?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Controller
                                    control={control}
                                    name="previousCurriculum"
                                    defaultValue=""
                                    rules={{
                                        required: selectedType === 'improved' ? "กรุณากรอกข้อมูลหลักสูตรปรับปรุง" : false
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="รายละเอียดหลักสูตรปรับปรุง"
                                            variant="outlined"
                                            size="small"
                                            required
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            maxRows={8}
                                            disabled={selectedType !== 'improved'}
                                            error={!!errors.previousCurriculum}
                                            helperText={errors.previousCurriculum?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>7. ความพร้อมในการเผยแพร่หลักสูตรคุณภาพและมาตรฐาน </Typography>
                                <Controller
                                    control={control}
                                    name="qualityAssurance"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกความพร้อมในการเผยแพร่หลักสูตรคุณภาพและมาตรฐาน" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ความพร้อมในการเผยแพร่หลักสูตรคุณภาพและมาตรฐาน"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            maxRows={8}
                                            error={!!errors.qualityAssurance}
                                            helperText={errors.qualityAssurance?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>8. อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา</Typography>
                                <Controller
                                    control={control}
                                    name="career"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกอาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            maxRows={8}
                                            error={!!errors.career}
                                            helperText={errors.career?.message}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                            }}
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