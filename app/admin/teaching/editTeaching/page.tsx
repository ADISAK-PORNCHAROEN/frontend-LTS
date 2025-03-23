"use client";
import { useEffect, useState } from 'react'
import { Box, Alert, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, InputLabel, Menu, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert1 from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CardBox from '#/components/CardBox';
import { ISubjects, IUserClo, IUserExcel, IUserPlo } from '#/types/LTS/ILts';
import { useRouter, useSearchParams } from 'next/navigation';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import { useSession } from 'next-auth/react';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import useGetAllPlo from '#/hooks/useGetAllPlo';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion, AnimatePresence } from 'framer-motion';
import useGetAllUserClo from '#/hooks/useGetAllUserClo';
import useUpdateUserPloMany from '#/hooks/useUpdateUserPloMany';
import useUpdateUserClo from '#/hooks/useUpdateUserClo';
import useGetAllCloList from '#/hooks/useGetAllCloList';
import useUpdateExcelName from '#/hooks/useUpdateExcelName';
import { IResponse } from '#/types/IResponse/IResponse';
import useGetAllUserExcel from '#/hooks/useGetAllUserExcel';
import useUpdateExcelSemeNYear from '#/hooks/useUpdateExcelSemeNYear';

export default function Page() {
    const [rows, setRows] = useState<IUserClo[]>([]);
    const [rowsExcel, setRowsExcel] = useState<IUserExcel[]>([]);
    const router = useRouter();
    const session = useSession();
    const user = session.data?.user;
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IUserClo>();
    const { mutateAsync: updateUserPloMany, isLoading: isLoadingUpdateUserPloMany } = useUpdateUserPloMany();
    const { mutateAsync: updateUserClo, isLoading: isLoadingUpdateUserClo } = useUpdateUserClo();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { data: ploData, isLoading: isLoadingPloData } = useGetAllPlo();
    const { data: userClo, isLoading: isLoadingUserClo } = useGetAllUserClo();
    const { data: userCloList, isLoading: isLoadingUserCloList } = useGetAllCloList();
    const { mutateAsync: uploadExcelName, isLoading: isLoadingUploadName } = useUpdateExcelName();
    const { mutateAsync: uploadExcelSemeNYear, isLoading: isLoadingUploadSemeNYear } = useUpdateExcelSemeNYear();
    const { data: excelData, isLoading: isLoadingExcelData } = useGetAllUserExcel();
    const { encode, decode } = useUrlSafeBase64();
    const searchParams = useSearchParams();
    const subId = searchParams.get("sub");
    const curId = searchParams.get("cur");
    const semId = searchParams.get("sem");
    const yearId = searchParams.get("year");
    const paramsSubId = Number(subId ? decode(subId) : null);
    const paramsCurId = Number(curId ? decode(curId) : null);
    const paramsSemId = Number(semId ? decode(semId) : null);
    const paramsYearId = yearId ? decode(yearId) : null;
    const [selectedPlos, setSelectedPlos] = useState<number[]>([]);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        if (excelData?.data && paramsYearId) {
            const parsedData = excelData?.data?.filter((item: IUserExcel) =>
                item.subId === paramsSubId &&
                item.year === paramsYearId &&
                item.semester === paramsSemId
            );

            setRowsExcel(parsedData);
        }
    }, [paramsCurId, paramsSubId, paramsYearId, paramsSemId, excelData?.data]);

    useEffect(() => {
        if (userClo?.data) {
            const parsedData = userClo?.data?.filter((item: IUserClo) =>
                item.subId === paramsSubId &&
                item.curriculumId === paramsCurId &&
                item.semester === paramsSemId &&
                item.year === paramsYearId
            );

            setRows(parsedData);
        } else {
            setRows([]);
        }
    }, [paramsCurId, paramsSemId, paramsSubId, paramsYearId, userClo?.data]);

    useEffect(() => {
        if (userClo?.data) {
            const existingUserClo = userClo.data.find((item: IUserClo) =>
                item.subId === paramsSubId &&
                item.curriculumId === paramsCurId &&
                item.semester === paramsSemId &&
                item.year === paramsYearId
            );
            if (existingUserClo) {
                setValue('semester', existingUserClo.semester);
                setValue('year', existingUserClo.year);

                if (existingUserClo.plo && existingUserClo.plo.length > 0) {
                    const selectedPloIds = existingUserClo.plo.map((plo: IUserPlo) => plo.ploId!).flat();
                    setSelectedPlos(selectedPloIds);
                }

            } else {
                setValue('semester', 1);
                setValue('year', dayjs(new Date()).format('YYYY'));
                setSelectedPlos([]);
            }
        }
    }, [userClo?.data, paramsSubId, paramsCurId, setValue, paramsSemId, paramsYearId]);

    const checkExistingField = (data: IUserClo | IUserClo[]) => {
        const errors: string[] = [];
        if (!userClo?.data) return errors;

        const dataArray = Array.isArray(data) ? data : [data];
        if (dataArray.length === 0) return errors;

        const firstItem = dataArray[0];
        const editingIds = dataArray.map(item => item.id).filter(Boolean);

        const hasDuplicate = userClo.data.some((clo: IUserClo) =>
            clo.semester === firstItem.semester &&
            clo.year === firstItem.year &&
            clo.subId === firstItem.subId &&
            clo.curriculumId === firstItem.curriculumId &&
            !editingIds.includes(clo.id)
        );

        if (hasDuplicate) {
            errors.push("ปีการศึกษานี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
        }

        return errors;
    };

    const handleSubmitSubject: SubmitHandler<IUserClo> = async (data: IUserClo | IUserPlo) => {
        try {
            const updatedPloIds: { [key: string]: number[] } = {};
            const updatedCloIds: number[] = [];

            rows.forEach(clo => {
                if (clo.id) {
                    updatedPloIds[clo.id] = [...selectedPlos];
                    updatedCloIds.push(clo.id);
                }
            });

            const result: any = updatedCloIds.map((id, index) => ({
                ...data,
                id: id,
                userId: user?.id,
                curriculumId: paramsCurId,
                subId: paramsSubId,
                updatedBy: user?.name,
                updatedDate: new Date(),
            }));
            console.log("result", result);

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

            await updateUserClo(result);

            const resUserPlo: IUserPlo = {
                userId: user?.id,
                curriculumId: paramsCurId,
                ...updatedPloIds
            };

            await updateUserPloMany(resUserPlo);

            const semester = (data as IUserClo).semester;
            const year = (data as IUserClo).year;

            if (semester && year && rowsExcel.length > 0) {
                const excelIds: any = rowsExcel
                    .filter(row => row.id !== undefined)
                    .map(row => row.id!);

                if (excelIds.length > 0) {
                    await uploadExcelSemeNYear({
                        ids: excelIds,
                        semester: semester,
                        year: year,
                        updatedBy: user?.name || '',
                        updatedDate: new Date()
                    });
                }
            }

            setTypeAlertBox("success");
            setTextAlertBox("แก้ไขข้อมูลสำเร็จ");
            setIsOpenAlertBox(true);

            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    sessionStorage.removeItem('teachingData');
                    setIsOpenAlertBox(false);
                    resolve();
                }, 1500);
            });

            await router.push(`../teaching?sub=${subId}&cur=${curId}`);

        } catch (error) {
            setTypeAlertBox("warning");
            setTextAlertBox(error as string);
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);
        }
    };

    const findSubName = subjectsData?.data?.find((item: ISubjects) => item.id === paramsSubId)?.subNameTh
    const titleSubName = findSubName ? `${findSubName}` : "404 not found";

    const handlePloSelection = (ploId: number) => {
        setSelectedPlos(prev => {
            const newSelected = prev.includes(ploId)
                ? prev.filter(id => id !== ploId)
                : [...prev, ploId];
            return newSelected;
        });
    };

    const renderPloSelection = () => {
        const ploDataItems = ploData?.data?.filter(plo => plo.curriculum?.id === paramsCurId) || [];

        const userCloPlos = new Set();
        rows.forEach(clo => {
            if (clo.plo && Array.isArray(clo.plo)) {
                clo.plo.forEach(plo => {
                    if (plo.ploId) userCloPlos.add(plo.ploId);
                });
            }
        });

        let combinedPlos = [...ploDataItems];

        rows.forEach(clo => {
            if (clo.plo && Array.isArray(clo.plo)) {
                clo.plo.forEach(ploClo => {
                    const existsInCombined = combinedPlos.some(p => p.id === ploClo.ploId);
                    if (!existsInCombined && ploClo.ploId && ploClo.ploName) {
                        combinedPlos.push({
                            id: ploClo.ploId,
                            ploName: ploClo.ploName,
                            ploDesc: ploClo.ploDesc || '',
                            curriculum: { id: paramsCurId }
                        });
                    }
                });
            }
        });

        const groupedPlos = combinedPlos.reduce((acc, plo) => {
            const mainPloMatch = plo?.ploName?.match(/^(PLOs?\d+)/)?.[1];
            const subPloMatch = plo?.ploName?.match(/^(Sub PLO (\d+\.\d+))/);

            if (mainPloMatch) {
                if (!acc[mainPloMatch]) acc[mainPloMatch] = [];

                const subPlosExist = acc[mainPloMatch].some(p => p.ploName.startsWith('Sub PLO'));
                if (!subPlosExist) {
                    acc[mainPloMatch].push(plo);
                }
            }

            if (subPloMatch) {
                const subPloNumber = subPloMatch[2].split('.')[0];
                const correspondingMainPlo = `PLOs${subPloNumber}`;

                if (acc[correspondingMainPlo]) {
                    acc[correspondingMainPlo] = acc[correspondingMainPlo].filter(
                        p => !p.ploName.startsWith(`PLOs${subPloNumber}`)
                    );
                    acc[correspondingMainPlo].push(plo);
                }
            }

            return acc;
        }, {} as Record<string, any[]>);

        return (
            <Grid item xs={12}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 3,
                        fontWeight: 700,
                        background: '#3f51b5',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <SchoolIcon sx={{ fontSize: 32 }} />
                    เลือกผลลัพธ์การเรียนรู้ระดับหลักสูตร (PLOs)
                </Typography>

                <AnimatePresence>
                    {selectedPlos.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <Alert
                                severity="warning"
                                sx={{
                                    mt: 2,
                                    mb: 3,
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                    '& .MuiAlert-icon': {
                                        color: '#ff9800'
                                    }
                                }}
                            >
                                กรุณาเลือก PLO อย่างน้อย 1 รายการ
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Paper
                    elevation={3}
                    sx={{
                        maxHeight: 500,
                        overflowY: 'auto',
                        backgroundColor: '#f9fafc',
                        borderRadius: 3,
                        padding: 2,
                        border: '1px solid rgba(0,0,0,0.08)'
                    }}
                >
                    {Object.entries(groupedPlos || {}).map(([mainPlo, plos]) => (
                        <Box
                            key={mainPlo}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                backgroundColor: 'white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                border: '1px solid rgba(0,0,0,0.1)'
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: '#f0f4ff',
                                    padding: 2,
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <StarIcon sx={{ color: '#3f51b5' }} />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#3f51b5'
                                    }}
                                >
                                    {mainPlo}
                                </Typography>
                            </Box>

                            <FormGroup sx={{ p: 2 }}>
                                {plos.map((plo) => (
                                    <motion.div
                                        key={plo.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Paper
                                            elevation={selectedPlos.includes(plo.id) ? 3 : 1}
                                            sx={{
                                                mb: 1.5,
                                                transition: 'all 0.3s ease',
                                                backgroundColor: selectedPlos.includes(plo.id)
                                                    ? 'rgba(63, 81, 181, 0.05)'
                                                    : 'white',
                                                border: selectedPlos.includes(plo.id)
                                                    ? '1px solid #3f51b5'
                                                    : '1px solid rgba(0,0,0,0.12)',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                                }
                                            }}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedPlos.includes(plo.id)}
                                                        onChange={() => handlePloSelection(plo.id)}
                                                        color="primary"
                                                        sx={{
                                                            '&.Mui-checked': {
                                                                color: '#3f51b5'
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: selectedPlos.includes(plo.id)
                                                                        ? '#3f51b5'
                                                                        : 'text.primary'
                                                                }}
                                                            >
                                                                {plo.ploName}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    mt: 0.5,
                                                                    opacity: 0.8
                                                                }}
                                                            >
                                                                {plo.ploDesc}
                                                            </Typography>
                                                        </Box>
                                                        {selectedPlos.includes(plo.id) && (
                                                            <CheckCircleIcon
                                                                sx={{
                                                                    color: '#3f51b5',
                                                                    ml: 2
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                                sx={{
                                                    width: '100%',
                                                    margin: 0,
                                                    '& .MuiFormControlLabel-label': {
                                                        width: '100%'
                                                    }
                                                }}
                                            />
                                        </Paper>
                                    </motion.div>
                                ))}
                            </FormGroup>
                        </Box>
                    ))}
                </Paper>
            </Grid>
        );
    };

    return (
        <>
            <PageContentLayout
                title={`${titleSubName}`}
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="บันทึก"
                            icon={<AddIcon />}
                            onClick={handleSubmit((data) => handleSubmitSubject(data))}
                            disabled={selectedPlos.length === 0}
                        />
                    </>
                }
            >
                <CardBox>
                    <FormControl fullWidth>
                        <Grid container spacing={2}>
                            {/* Semester and Year Selection */}
                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        control={control}
                                        name="semester"
                                        defaultValue={1}
                                        rules={{ required: "กรุณาเลือกภาคการศึกษา" }}
                                        render={({ field }) => (
                                            <FormControl fullWidth size="small" error={!!errors.semester}>
                                                <InputLabel>ภาคการศึกษา</InputLabel>
                                                <Select
                                                    {...field}
                                                    label="ภาคการศึกษา"
                                                    variant="outlined"
                                                >
                                                    <MenuItem value={1}>ภาคการศึกษาที่ 1</MenuItem>
                                                    <MenuItem value={2}>ภาคการศึกษาที่ 2</MenuItem>
                                                    <MenuItem value={3}>ภาคฤดูร้อน</MenuItem>
                                                </Select>
                                                {errors.semester && (
                                                    <FormHelperText>{errors.semester.message}</FormHelperText>
                                                )}
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        control={control}
                                        name="year"
                                        defaultValue={dayjs(new Date()).format('YYYY')}
                                        rules={{ required: "กรุณาเลือกปีการศึกษา" }}
                                        render={({ field }) => (
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label="ปีการศึกษา"
                                                    openTo="year"
                                                    views={['year']}
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(newValue) => {
                                                        const yearOnly = newValue ? newValue.format('YYYY') : null;
                                                        field.onChange(yearOnly);
                                                    }}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            variant: 'outlined',
                                                            size: 'small',
                                                            error: !!errors.year,
                                                            helperText: errors.year?.message
                                                        }
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            {/* PLO Selection */}
                            {renderPloSelection()}
                        </Grid>
                    </FormControl>
                </CardBox>

                <Alert1
                    text={textAlertBox}
                    type={typeAlertBox}
                    isOpen={isOpenAlertBox}
                    setIsOpen={setIsOpenAlertBox}
                />
            </PageContentLayout>
        </>
    )
}