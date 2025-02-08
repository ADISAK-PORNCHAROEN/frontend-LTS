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

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const connectSignIn = () => {
        setTypeAlertBox("success");
        setTextAlertBox("Signup successfully.");
        setIsOpenAlertBox(true);
        setTimeout(() => {
            setIsOpenAlertBox(false);
            rounter.push('../auth/signIn');
        }, 1500);
    }

    const onSubmit = async (data: FieldValues) => {
        if (data.password !== data.confirmPassword) {
            setTypeAlertBox("warning");
            setTextAlertBox("Password and confirm password do not match.");
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);
        }
        // console.log("Submitted data:", data);

        const createUserData = {
            ...data,
            // name: data.firstname + " " + data.lastname,
            password: bcrypt.hashSync(data.password, 10),
            role: 'member',
        };
        // console.log("Create user data:", createUserData);

        await createUser(createUserData);

        connectSignIn();
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen w-screen m-0 p-0" style={{ backgroundColor: '#F2F4F7' }}>
                <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-md shadow-lg w-96">
                    <div className="w-full space-y-4">
                        <Typography variant="h5" align="center" gutterBottom fontWeight={'bold'}>
                            Sign up
                        </Typography>
                        <Box sx={{ my: 2 }}>
                            <hr />
                        </Box>
                        <Controller
                            name="fname"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Firstname is required" }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    required
                                    label="Firstname"
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
                            rules={{ required: "Lastname is required" }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    required
                                    label="Lastname"
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
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Invalid email address"
                                }
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    required
                                    label="Email"
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
                            rules={{ required: "Password is required" }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    required
                                    label="Password"
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
                                                    aria-label={showPassword ? 'hide the password' : 'display the password'}
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
                                required: "Please confirm your password",
                                validate: (value) => value === password || "Passwords do not match"
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Confirm Password"
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
                        Sign up
                    </Button>

                    <Typography align="center" gutterBottom>
                        Already have an account?{' '}
                        <Link href="/lts/api/auth/signIn" className="">
                            Sign In
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