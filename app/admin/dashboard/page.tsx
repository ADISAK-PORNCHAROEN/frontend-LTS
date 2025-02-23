"use client";
import Image from 'next/image'
import { SetStateAction, use, useEffect, useState } from 'react'
import { IUser } from '#/types/IResponse/IResponse';
import { Button, Grid, Menu, MenuItem, Stack, Typography } from '@mui/material';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import PendingIcon from '@mui/icons-material/Pending';
import CardBox from '#/components/CardBox';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import CardBoxDashboard from '#/components/CardBoxDashboard';

export default function Home() {
    const [rows, setRows] = useState<IUser[]>([]);
    const [countSubjectActive, setCountSubjectActive] = useState<number>(0);
    const [countSubjectInactive, setCountSubjectInactive] = useState<number>(0);
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    console.log("subject", subjectsData?.data)

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [typeCardBox, setTypeCardBox] = useState<"default" | "success" | "warning" | "error" | "info">("default");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    const status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    useEffect(() => {
        if (subjectsData?.data) {
            const transformedData = subjectsData?.data.map((data) => ({
                ...data,
                subStatus: data.subStatus === status.isActive,
                subStatusIn: data.subStatus === status.isInactive 
            }));

            setCountSubjectActive(transformedData.filter(item => item.subStatus).length);
            setCountSubjectInactive(transformedData.filter(item => item.subStatusIn).length);
        }
    }, [status.isActive, status.isInactive, subjectsData?.data])

    return (
        <>
            <PageContentLayout
                title="Dashboard"
                icon={<DashboardIcon />}
                actions={
                    <>

                    </>
                }
            >

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={3}>
                        <CardBoxDashboard
                            title='วิชาที่มีอยู่ในระบบ'
                            value={subjectsData?.data?.length}
                            subtitle="รายวิชาทั้งหมดในระบบ"
                            colorVariant='info'
                            icon={<DashboardIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CardBoxDashboard
                            title='วิชาที่เปิดสอน'
                            value={countSubjectActive}
                            subtitle="รายวิชาที่เปิดในเทอมปัจจุบัน"
                            colorVariant='success'
                            icon={<BookIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CardBoxDashboard
                            title='นักศึกษาทั้งหมด'
                            value="245"
                            subtitle="จำนวนนักศึกษาที่ลงทะเบียน"
                            colorVariant='warning'
                            icon={<PeopleIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CardBoxDashboard
                            title='รายวิชารอดำเนินการ'
                            value="3"
                            subtitle="รายวิชาที่ต้องได้รับการอนุมัติ"
                            colorVariant='error'
                            icon={<PendingIcon />}
                        />
                    </Grid>
                </Grid>

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