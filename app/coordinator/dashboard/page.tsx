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
import useGetAllUserCloList from '#/hooks/useGetAllUserCloList';
import useGetAllUserExcel from '#/hooks/useGetAllUserExcel';
import { IExcelResponse, ISubject } from '#/types/LTS/ILts';
import { StudentEnrollmentChart } from '#/components/StudentEnrollmentChart';
import CardBox from '#/components/CardBox';

export default function Home() {
    const { data: session } = useSession();
    const user = session?.user;
    const [subjectsCount, setSubjectsCount] = useState(0);
    const [countSubjectCur, setCountSubjectCur] = useState<number>(0);
    const [userSubjects, setUserSubjects] = useState<ISubject[]>([]);

    // API hooks
    const { data: userData, isLoading: isLoadingUserData } = useGetAllUsers();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { data: colListClo, isLoading: isLoadingColListClo } = useGetAllUserCloList();
    const { data: excelData, isLoading: isLoadingExcelData } = useGetAllUserExcel();

    // Modal state
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [typeCardBox, setTypeCardBox] = useState<"default" | "success" | "warning" | "error" | "info">("default");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    useEffect(() => {
        if (!userData || !Array.isArray(userData.data) || !user?.id) return;

        const currentUser = userData.data.find(u => u.id === user?.id);

        if (!currentUser || !currentUser.subjects || !Array.isArray(currentUser.subjects)) {
            setSubjectsCount(0);
            setUserSubjects([]);
            return;
        }

        let totalSubjects = 0;
        const allUserSubjects: ISubject[] = [];

        currentUser.subjects.forEach(subjectEntry => {
            if (subjectEntry.subjects && Array.isArray(subjectEntry.subjects)) {
                totalSubjects += subjectEntry.subjects.length;
                subjectEntry.subjects.forEach(subject => allUserSubjects.push(subject as any));
            }
        });

        setSubjectsCount(totalSubjects);
        setUserSubjects(allUserSubjects);
    }, [userData, user?.id]);

    useEffect(() => {
        if (subjectsData?.data && user?.curriculumId) {
            const filteredData = subjectsData.data.filter(item =>
                item.curriculum?.id === user.curriculumId
            );
            setCountSubjectCur(filteredData.length);
        }
    }, [subjectsData?.data, user?.curriculumId]);


    return (
        <>
            <PageContentLayout
                title="แดชบอร์ด"
                icon={<DashboardIcon />}
            >
                <CardBox>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={6}>
                            <CardBoxDashboard
                                title='วิชาทั้งหมดในหลักสูตร'
                                value={countSubjectCur || "0"}
                                subtitle="รายวิชาในหลักสูตร"
                                colorVariant='info'
                                icon={<BookIcon />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <CardBoxDashboard
                                title='วิชาที่รับผิดชอบ'
                                value={subjectsCount || "0"}
                                subtitle="จํานวนวิชาที่รับผิดชอบ"
                                colorVariant='success'
                                icon={<BookIcon />}
                            />
                        </Grid>
                    </Grid>

                    <StudentEnrollmentChart
                        excelData={excelData as IExcelResponse}
                        isLoadingCloList={isLoadingColListClo}
                        isLoadingExcelData={isLoadingExcelData}
                        subjects={userSubjects as ISubject[]}
                    />
                </CardBox>

                {/* Alert Modal */}
                <Alert
                    text={textAlertBox}
                    type={typeAlertBox}
                    isOpen={isOpenAlertBox}
                    setIsOpen={setIsOpenAlertBox}
                />
            </PageContentLayout>
        </>
    );
}