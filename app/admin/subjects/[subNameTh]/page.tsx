"use client";
import { useEffect, useState } from 'react'
import { Button, FormControl, Grid, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Controller, set, SubmitHandler, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CardBox from '#/components/CardBox';
import { ISubjects } from '#/types/LTS/ILts';
import { useParams, usePathname, useRouter } from 'next/navigation';
import useUpdateSubjects from '#/hooks/useUpdateSubjects';

// type Props = {
//     params: Promise<{ subNameTh: string }>;
// }

export default function Page() {
    const router = useRouter();
    // const { subNameTh } = use(params);
    // const path = decodeURIComponent(subNameTh);
    // console.log("pathname:", path)
    const [subjectName, setSubjectName] = useState<string | null>(null);
    const { subNameTh } = useParams();
    const pathname = decodeURIComponent(subNameTh as string);
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<ISubjects>();
    const { mutateAsync: updateSubjects, isLoading: isLoadingUpdateSubjects } = useUpdateSubjects();

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        const storedData = sessionStorage.getItem('subjectData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setSubjectName(parsedData.subNameTh);
            if (parsedData.subNameTh === pathname) {
                // Set form values from stored data
                Object.keys(parsedData).forEach((key) => {
                    setValue(key as keyof ISubjects, parsedData[key]);
                });
            }
        }
    }, [setValue, pathname]);

    const status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    const handleSubmitSubject: SubmitHandler<ISubjects> = async (data: ISubjects) => {
        try {
            const result = {
                ...data,
                subStatus: status.isActive,
                updatedDate: new Date(),
            }
            console.log(result)
            sessionStorage.setItem('subjectData', JSON.stringify(result));

            await updateSubjects(result)

            setTypeAlertBox("success");
            setTextAlertBox("Edit Success");
            setIsOpenAlertBox(true);
            setTimeout(() => {
                sessionStorage.removeItem('subjectData');
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
                title={`${subjectName === pathname ? `${subjectName}` : "404 not found"}`}
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="Cancel"
                            icon={<CloseIcon />}
                            color='#db3131'
                            onClick={() => router.push("../subjects")}
                        />

                        <ActionBtn
                            title="Save"
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