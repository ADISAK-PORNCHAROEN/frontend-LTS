"use client";
import { useEffect, useState } from 'react'
import { Box, Alert, Checkbox, Fade, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, InputLabel, Menu, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { Controller, set, SubmitHandler, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert1 from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CardBox from '#/components/CardBox';
import { ISubjects, IUserClo, IUserPlo } from '#/types/LTS/ILts';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import useUpdateSubjects from '#/hooks/useUpdateSubjects';
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
import useUpdateUserPlo from '#/hooks/useUpdateUserPlo';
import useCreateClo from '#/hooks/useCreateClo';
import useCreateUserClo from '#/hooks/useCreateUserClo';
import useCreateUserCloWithPlo from '#/hooks/useCreateUserCloWithPlo';
import useGetAllUserClo from '#/hooks/useGetAllUserClo';

export default function Page() {
    const router = useRouter();
    const { subNameEn } = useParams();
    const pathname = decodeURIComponent(subNameEn as string);
    const session = useSession();
    const user = session.data?.user;
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IUserClo>();
    const { mutateAsync: updateUserPlo, isLoading: isLoadingUpdateUserPlo } = useUpdateUserPlo();
    const { mutateAsync: createUserClo, isLoading: isLoadingCreateUserClo } = useCreateUserClo();
    const { mutateAsync: createUserCloWithPlo, isLoading: isLoadingCreateUserCloWithPlo } = useCreateUserCloWithPlo();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { data: ploData, isLoading: isLoadingPloData } = useGetAllPlo();
    const { data: userClo, isLoading: isLoadingUserClo } = useGetAllUserClo();
    const { encode, decode } = useUrlSafeBase64();
    const searchParams = useSearchParams();
    const subId = searchParams.get("sub");
    const curId = searchParams.get("cur");
    const paramsSubId = Number(subId ? decode(subId) : null);
    const paramsCurId = Number(curId ? decode(curId) : null);
    const [selectedPlos, setSelectedPlos] = useState<number[]>([]);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    const checkExistingField = (data: IUserClo) => {
        const errors: string[] = [];

        if (userClo?.data) {
            userClo.data.map((clo: IUserClo) => {
                if (clo.semester === data.semester && clo.year === data.year && clo.subId === data.subId && clo.curriculumId === data.curriculumId) {
                    errors.push("ภาคการศึกษานี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
                }

            });
        }
        return errors;
    };

    const handleSubmitSubject: SubmitHandler<IUserClo> = async (data: IUserClo | IUserPlo) => {
        try {

            const result = {
                ...data,
                ploIds: selectedPlos.map((plo) => plo),
                plo: selectedPlos.map((ploId) => ({ id: ploId } as IUserPlo)),
                userId: user?.id,
                subId: paramsSubId,
                curriculumId: paramsCurId,
                createdDate: new Date(),
                createdBy: user?.name
            };
            // console.log("result", result);

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

            await createUserCloWithPlo(result);

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
        setSelectedPlos(prev =>
            prev.includes(ploId)
                ? prev.filter(id => id !== ploId)
                : [...prev, ploId]
        );
    };

    // Render method for PLO selection
    const renderPloSelection = () => {
        // Group PLOs by their main PLO category
        const groupedPlos = ploData?.data?.filter(plo => plo.curriculum?.id === paramsCurId).reduce((acc, plo) => {
            const mainPloMatch = plo?.ploName?.match(/^(PLOs?\d+)/)?.[1];
            const subPloMatch = plo?.ploName?.match(/^(Sub PLO (\d+\.\d+))/);

            // Handle main PLOs first
            if (mainPloMatch) {
                if (!acc[mainPloMatch]) acc[mainPloMatch] = [];

                // Only add main PLO if no sub PLOs exist yet
                const subPlosExist = acc[mainPloMatch].some(p => p.ploName.startsWith('Sub PLO'));
                if (!subPlosExist) {
                    acc[mainPloMatch].push(plo);
                }
            }

            // Handle Sub PLOs
            if (subPloMatch) {
                const subPloNumber = subPloMatch[2].split('.')[0];
                const correspondingMainPlo = `PLOs${subPloNumber}`;

                if (acc[correspondingMainPlo]) {
                    // Remove main PLO if Sub PLO is added
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