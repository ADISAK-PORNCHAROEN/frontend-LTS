"use client";
import { useEffect, useState } from 'react'
import { IUser } from '#/types/IResponse/IResponse';
import { Grid } from '@mui/material';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import PendingIcon from '@mui/icons-material/Pending';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import CardBoxDashboard from '#/components/CardBoxDashboard';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { useSession } from 'next-auth/react';

export default function Home() {
    const [rows, setRows] = useState<IUser[]>([]);
    const { data: session } = useSession();
    const user = session?.user
    const [subjectsCount, setSubjectsCount] = useState(0);
    const { data: userData, isLoading: isLoadinguserData } = useGetAllUsers();

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
        if (!userData || !Array.isArray(userData.data) || !user?.id) return;

        const currentUser = userData.data.find(u => u.id === user?.id);

        if (!currentUser || !currentUser.subjects || !Array.isArray(currentUser.subjects)) {
            setSubjectsCount(0);
            return;
        }

        let totalSubjects = 0;
        currentUser.subjects.forEach(subjectEntry => {
            if (subjectEntry.subjects && Array.isArray(subjectEntry.subjects)) {
                totalSubjects += subjectEntry.subjects.length;
            }
        });

        setSubjectsCount(totalSubjects);
    }, [userData, user?.id]);

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
                            title='วิชาที่รับผิดชอบ'
                            value={subjectsCount || "0"}
                            subtitle="จํานวนวิชาที่รับผิดชอบ"
                            colorVariant='info'
                            icon={<DashboardIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CardBoxDashboard
                            title='วิชาที่เปิดสอน'
                            value={"0"}
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