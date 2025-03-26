"use client";
import { useEffect, useState } from 'react'
import { Autocomplete, Card, Chip, FormControl, Grid, Stack, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CardBox from '#/components/CardBox';
import { ISubjects } from '#/types/LTS/ILts';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { IUser } from '#/types/IResponse/IResponse';
import useUpdateUser from '#/hooks/useUpdateUser';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import useUpdateUserSubject from '#/hooks/useUpdateUserSubject';
import { useSession } from 'next-auth/react';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';

export default function Page() {
    const router = useRouter();
    const [namePath, setNamePath] = useState<string | null>(null);
    const [userId, setUserId] = useState<number>(0);
    const { name } = useParams();
    const pathname = decodeURIComponent(name as string);
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<IUser>();
    const { mutateAsync: updateUserSubject, isLoading: isLoadingUpdateUserSubject } = useUpdateUserSubject();
    const { mutateAsync: updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { data: userData, isLoading: isLoadinguserData } = useGetAllUsers();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const session = useSession();
    const user = session.data?.user;
    const selectedSubjects = watch('subjects') || [];
    const selectedCurriculum = watch('curriculumId');
    const { encode, decode } = useUrlSafeBase64();
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("id");
    const paramsId = encodedId ? decode(encodedId) : null;

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        const parsedData = userData?.data?.find((item: IUser) => item.id === Number(paramsId));
        if (parsedData) {
            if (parsedData.name === pathname) {
                setNamePath(parsedData.name);
                setUserId(parsedData.id ?? 0);
                Object.keys(parsedData).map((key) => {
                    setValue(key as keyof IUser, parsedData[key as keyof IUser]);
                });
            }
        }

    }, [setValue, pathname, paramsId, userData?.data]);

    const status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    const Role = {
        isAdmin: "admin",
        isCoordinator: "program_coordinator",
        isInstructor: "instructor"
    }

    const roles = [
        { value: Role.isAdmin, label: "ผู้ดูแลระบบ" },
        { value: Role.isCoordinator, label: "อาจารย์ผู้รับผิดชอบรายวิชา" },
        { value: Role.isInstructor, label: "อาจารย์ผู้สอน" }
    ];

    const handleSubmitSubject: SubmitHandler<IUser> = async (data: IUser) => {
        try {
            const resultUserSubs = selectedSubjects.map((item: ISubjects) => item.subjects?.[0].id ?? 0);

            const result = {
                ...data,
                curriculumId: data.role === Role.isCoordinator ? data.curriculumId : null,
                updatedDate: new Date(),
            }

            const res = await updateUser(result)

            const resUserSubject = await updateUserSubject({
                userId: userId,
                subjects: resultUserSubs
            });

            if (resUserSubject.success === true && res.success === true) {
                setTypeAlertBox("success");
                setTextAlertBox("แก้ไขสำเร็จ");
                setIsOpenAlertBox(true);
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        setIsOpenAlertBox(false);
                        resolve();
                    }, 1500);
                });

                await router.push("../accounts");
            } else {
                setTypeAlertBox("warning");
                setTextAlertBox("แก้ไขไม่สำเร็จ");
                setIsOpenAlertBox(true);
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        setIsOpenAlertBox(false);
                        resolve();
                    }, 1500);
                });
            }

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
                title={`${namePath === pathname ? `${namePath}` : "404 not found"}`}
                icon={<AccountBoxIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="ยกเลิก"
                            icon={<CloseIcon />}
                            color='#db3131'
                            onClick={() => router.push("../accounts")}
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
                                <Typography variant="h6" sx={{ padding: "8px 0px 16px", fontWeight: "bold" }}>ข้อมูล {namePath === pathname ? `${namePath}` : "404 not found"}</Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="fname"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกชื่อ" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="ชื่อ"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.fname}
                                            helperText={errors.fname?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    control={control}
                                    name="lname"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกนามสกุล" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="นามสกุล"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.lname}
                                            helperText={errors.lname?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: "กรุณากรอกอีเมล",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: "อีเมลไม่ถูกต้อง"
                                        }
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="อีเมล"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!error}
                                            inputProps={{ type: 'email' }}
                                            helperText={error ? error.message : ''}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="role"
                                    defaultValue=""
                                    rules={{ required: "กรุณากรอกตำแหน่ง" }}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            disablePortal
                                            fullWidth
                                            size='small'
                                            options={roles}
                                            value={roles.find(role => role.value === value) || null}
                                            onChange={(_, newValue) => {
                                                onChange(newValue ? newValue.value : '')
                                            }}
                                            isOptionEqualToValue={(option, value) => {
                                                if (typeof value === 'string') {
                                                    return option.value === value;
                                                }
                                                return option.value === value.value;
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="ตำแหน่ง"
                                                    error={!!errors.role}
                                                    helperText={errors.role?.message}
                                                    required
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            {watch('role') === Role.isCoordinator && (
                                <Grid item xs={12}>
                                    <Controller
                                        control={control}
                                        name="curriculumId"
                                        defaultValue={null}
                                        rules={{
                                            required: watch('role') === Role.isCoordinator ? "กรุณาเลือกหลักสูตรที่รับผิดชอบ" : false
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Autocomplete
                                                disablePortal
                                                fullWidth
                                                autoHighlight
                                                size='small'
                                                options={curriculumData?.data || []}
                                                value={curriculumData?.data?.find(item => item.id === value) || null}
                                                onChange={(_, newValue) => {
                                                    onChange(newValue ? newValue.id : null);
                                                }}
                                                getOptionLabel={(option) =>
                                                    option?.degreeFullTh || ""
                                                }
                                                isOptionEqualToValue={(option, value) =>
                                                    option.id === value?.id
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="หลักสูตรที่รับผิดชอบ"
                                                        error={!!errors.curriculumId}
                                                        helperText={errors.curriculumId?.message?.toString()}
                                                        required={watch('role') === Role.isCoordinator}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="subjects"
                                    defaultValue={[]}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            multiple
                                            disablePortal
                                            fullWidth
                                            autoHighlight
                                            size='small'
                                            options={subjectsData?.data?.filter(subject => subject.subStatus === status.isActive) || []}
                                            value={selectedSubjects || []}
                                            onChange={(_, newValue) => {
                                                const mappedValue = newValue.map(item => {
                                                    if (item.subjects?.[0]) {
                                                        return {
                                                            id: item.id,
                                                            userId: user?.id,
                                                            subjects: item.subjects
                                                        };
                                                    }
                                                    return {
                                                        id: item.id,
                                                        userId: user?.id,
                                                        subjects: [{
                                                            id: item.id,
                                                            subId: item.subId,
                                                            subNameTh: item.subNameTh,
                                                            subNameEn: item.subNameEn
                                                        }]
                                                    };
                                                });
                                                onChange(mappedValue);
                                            }}
                                            getOptionLabel={(option) =>
                                                option.subjects?.[0]?.subId ?
                                                    `${option.subjects[0].subId} - ${option.subjects[0].subNameTh}` :
                                                    `${option.subId} - ${option.subNameTh}`
                                            }
                                            isOptionEqualToValue={(option, value) =>
                                                option.id === (value.subjects?.[0]?.id || value.id)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="วิชาที่รับผิดชอบ"
                                                    error={!!errors.subjects}
                                                    helperText={errors.subjects?.message?.toString()}
                                                />
                                            )}
                                            renderTags={(selectedOptions, getTagProps) =>
                                                selectedOptions.map((option, index) => {
                                                    const subject = option.subjects?.[0];
                                                    return (
                                                        <Chip
                                                            {...getTagProps({ index })}
                                                            key={option.id}
                                                            label={subject ?
                                                                `${subject.subId} - ${subject.subNameTh}` :
                                                                `${option.subId} - ${option.subNameTh}`
                                                            }
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    );
                                                })
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            {selectedSubjects.length > 0 && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                        รายการวิชาที่รับผิดชอบ ({selectedSubjects.length} วิชา)
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {selectedSubjects.map((sub: ISubjects) => (
                                            <Grid item xs={12} sm={6} md={4} key={sub.id}>
                                                <Card sx={{ p: 2 }}>
                                                    <Stack spacing={1}>
                                                        <Typography variant="subtitle2" fontWeight="bold">
                                                            {sub.subjects?.[0]?.subNameTh || 'ไม่พบชื่อวิชา'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            รหัสวิชา: {sub.subjects?.[0]?.subId || 'ไม่พบรหัสวิชา'}
                                                        </Typography>
                                                    </Stack>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            )}

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