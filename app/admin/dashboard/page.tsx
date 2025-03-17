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
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import useGetAllPlo from '#/hooks/useGetAllPlo';

export default function Home() {
    const [rows, setRows] = useState<IUser[]>([]);
    const [countSubjectActive, setCountSubjectActive] = useState<number>(0);
    const [countUserSubjects, setCountUserSubjects] = useState<number>(0);
    const [countCurriculum, setCountCurriculum] = useState<number>(0);
    const { data: ploData, isLoading: isLoadingPloData } = useGetAllPlo();
    const { data: userData, isLoading: isLoadinguserData } = useGetAllUsers();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();

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

            setCountSubjectActive(transformedData.filter(item => item.subStatus).length || 0);
        }

        if (curriculumData?.data) {
            const transformedData = curriculumData?.data.length || 0;
            setCountCurriculum(transformedData);
        }

        if (userData && Array.isArray(userData?.data)) {
            const transformedData = userData?.data.map((data) => ({
                ...data,
            }));
            setCountUserSubjects(transformedData.filter(item => item.subjects === null).length || 0);
        }

        if (ploData?.data) {
            const transformedData = ploData?.data.map((item) => ({
                id: item.id,
                ...item
            }))
            setRows(transformedData);
        }
        
    }, [status.isActive, status.isInactive, subjectsData?.data, userData?.data, curriculumData?.data]);

    console.log("rows", rows);

    return (
        <>
            <PageContentLayout
                title="Dashboard"
                icon={<DashboardIcon />}
            >

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={3}>
                        <CardBoxDashboard
                            title='วิชาที่มีอยู่ในระบบ'
                            value={subjectsData?.data?.length || "0"}
                            subtitle="รายวิชาทั้งหมดในระบบ"
                            colorVariant='info'
                            icon={<DashboardIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CardBoxDashboard
                            title='วิชาที่เปิดสอน'
                            value={countSubjectActive || "0"}
                            subtitle="รายวิชาที่เปิดในเทอมปัจจุบัน"
                            colorVariant='success'
                            icon={<BookIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CardBoxDashboard
                            title='หลักสูตรที่มีอยู่ในระบบ'
                            value={countCurriculum || "0"}
                            subtitle="หลักสูตรทั้งหมดในระบบ"
                            colorVariant='warning'
                            icon={<PeopleIcon />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CardBoxDashboard
                            title='อาจารย์ที่ไม่มีวิชาที่รับผิดชอบ'
                            value={countUserSubjects || "0"}
                            subtitle="อาจารย์ที่ไม่มีวิชาที่รับผิดชอบ"
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