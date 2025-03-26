"use client"
import useCreateUser from '#/hooks/useCreateUser'
import { IUser } from '#/types/IResponse/IResponse'
import { Password, Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, FormControl, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import bcrypt from 'bcryptjs'
import Alert from '#/components/modal/Alert'
import { useRouter } from 'next/navigation'

export default function Page() {
    const { control, handleSubmit, watch } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const password = watch("password", "");
    const rounter = useRouter();
    const { mutateAsync: createUser, isLoading: isLoadingCreateUser } = useCreateUser();

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    const Role = {
        isAdmin: "admin",
        isCoordinator: "program_coordinator",
        isInstructor: "instructor"
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const connectSignIn = () => {
        setTypeAlertBox("success");
        setTextAlertBox("สมัครสมาชิกเสร็จสิ้น");
        setIsOpenAlertBox(true);
        setTimeout(() => {
            setIsOpenAlertBox(false);
            rounter.push('../auth/signIn');
        }, 1500);
    }

    const onSubmit = async (data: FieldValues) => {
        if (data.password !== data.confirmPassword) {
            setTypeAlertBox("warning");
            setTextAlertBox("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);
        }

        const createUserData = {
            ...data,
            password: bcrypt.hashSync(data.password, 10),
            role: Role.isInstructor,
        };

        await createUser(createUserData);

        connectSignIn();
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen w-screen m-0 p-0" style={{ backgroundColor: '#F2F4F7' }}>
                <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-md shadow-lg w-96">
                    <div className="w-full space-y-4">
                        <Typography variant="h5" align="center" gutterBottom fontWeight={'bold'}>
                            สมัครสมาชิก
                        </Typography>
                        <Box sx={{ my: 2 }}>
                            <hr />
                        </Box>
                        <Controller
                            name="fname"
                            control={control}
                            defaultValue=""
                            rules={{ required: "กรุณากรอกชื่อ" }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    required
                                    label="ชื่อ"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    type='text'
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                />
                            )}
                        />
                        <Controller
                            name="lname"
                            control={control}
                            defaultValue=""
                            rules={{ required: "กรุณากรอกนามสกุล" }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    required
                                    label="นามสกุล"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    type='text'
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: "กรุณากรอกอีเมล",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "รูปแบบอีเมลไม่ถูกต้อง"
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
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{ required: "กรุณากรอกรหัสผ่าน" }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    required
                                    label="รหัสผ่าน"
                                    variant="outlined"
                                    size="small"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff sx={{ color: 'inherit' }} /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: "กรุณายืนยันรหัสผ่าน",
                                validate: (value) => value === password || "รหัสผ่านไม่ตรงกัน"
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="ยืนยันรหัสผ่าน"
                                    variant="outlined"
                                    size="small"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </div>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        className="w-full rounded-lg"
                        variant="contained"
                    >
                        สมัครสมาชิก
                    </Button>

                    <Typography align="center" gutterBottom>
                        มีบัญชีอยู่แล้ว?{' '}
                        <Link href="/lts/api/auth/signIn" className="">
                            เข้าสู่ระบบ
                        </Link>
                    </Typography>
                </div>
            </div>

            <Alert
                text={textAlertBox}
                type={typeAlertBox}
                isOpen={isOpenAlertBox}
                setIsOpen={setIsOpenAlertBox}
            />
        </>
    );
}