"use client";
import { useEffect, useState, useRef } from 'react'
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
import useGetAllClo from '#/hooks/useGetAllClo';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ISubjects } from '#/types/LTS/ILts';
import CardBox from '#/components/CardBox';

interface ChartData {
    curriculumLabels: string[];
    ploCountsPerCurriculum: number[];
}

interface CloChartData {
    subjectLabels: string[];
    cloCountsPerSubject: number[];
    curriculumIds: string[]; // เพิ่มข้อมูลหลักสูตรของแต่ละวิชา
}

interface GroupedCloChartData {
    curriculumName: string;
    subjects: {
        label: string;
        count: number;
    }[];
}

interface CurriculumSubjectsData {
    curriculumName: string;
    subjectCount: number;
}

export default function Home() {
    const [rows, setRows] = useState<IUser[]>([]);
    const [countSubjectActive, setCountSubjectActive] = useState<number>(0);
    const [countUserSubjects, setCountUserSubjects] = useState<number>(0);
    const [countCurriculum, setCountCurriculum] = useState<number>(0);
    const [chartData, setChartData] = useState<ChartData>({
        curriculumLabels: [],
        ploCountsPerCurriculum: []
    });
    const [cloChartData, setCloChartData] = useState<CloChartData>({
        subjectLabels: [],
        cloCountsPerSubject: [],
        curriculumIds: []
    });
    const [groupedCloData, setGroupedCloData] = useState<GroupedCloChartData[]>([]);
    const [curriculumSubjectsData, setCurriculumSubjectsData] = useState<CurriculumSubjectsData[]>([]);
    const [curriculumColorMap, setCurriculumColorMap] = useState<Map<string, string>>(new Map());

    // เพิ่ม useRef เพื่อป้องกัน infinite loop
    const processedPloData = useRef(false);
    const processedCloData = useRef(false);

    const { data: ploData, isLoading: isLoadingPloData } = useGetAllPlo();
    const { data: userData, isLoading: isLoadinguserData } = useGetAllUsers();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const { data: cloData, isLoading: isLoadingCloData } = useGetAllClo();

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [typeCardBox, setTypeCardBox] = useState<"default" | "success" | "warning" | "error" | "info">("default");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    const status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    // Process subject data
    useEffect(() => {
        if (subjectsData?.data) {
            const transformedData = subjectsData.data.map((data) => ({
                ...data,
                subStatus: data.subStatus === status.isActive,
                subStatusIn: data.subStatus === status.isInactive
            }));

            setCountSubjectActive(transformedData.filter(item => item.subStatus).length || 0);
        }
    }, [status.isActive, status.isInactive, subjectsData?.data]);

    // Process curriculum data
    useEffect(() => {
        if (curriculumData?.data) {
            setCountCurriculum(curriculumData.data.length || 0);

            // สร้าง map ของสีสำหรับแต่ละหลักสูตร
            const colors = [
                '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
            ];

            const colorMap = new Map();
            curriculumData.data.forEach((curriculum, index) => {
                colorMap.set(curriculum.id, colors[index % colors.length]);
            });

            setCurriculumColorMap(colorMap);
        }
    }, [curriculumData?.data]);

    // Process user data
    useEffect(() => {
        if (userData?.data && Array.isArray(userData.data)) {
            const transformedData = userData.data.map((data) => ({
                ...data,
            }));
            setCountUserSubjects(transformedData.filter(item => item.subjects === null).length || 0);
        }
    }, [userData?.data]);

    // Process PLO data
    useEffect(() => {
        if (ploData?.data && !processedPloData.current) {
            const transformedData = ploData.data.map((item) => ({
                id: item.id,
                ...item
            }));
            setRows(transformedData);

            // ใช้ Map เพื่อเก็บชื่อย่อของหลักสูตรและนับจำนวน PLO
            const curriculumMap = new Map();

            ploData.data.forEach((row) => {
                if (row.curriculum) {
                    const curriculumId = row.curriculum.id;
                    const curriculumShortName = row.curriculum.degreeShortTh || `Curriculum ${curriculumId}`;

                    if (!curriculumMap.has(curriculumId)) {
                        curriculumMap.set(curriculumId, {
                            label: curriculumShortName,
                            count: 0
                        });
                    }

                    curriculumMap.get(curriculumId).count += 1;
                }
            });

            // แปลง Map เป็น arrays สำหรับกราฟ
            const labels = Array.from(curriculumMap.values()).map(item => item.label);
            const counts = Array.from(curriculumMap.values()).map(item => item.count);

            setChartData({
                curriculumLabels: labels,
                ploCountsPerCurriculum: counts
            });

            processedPloData.current = true;
        }
    }, [ploData?.data]);

    // Process CLO data
    useEffect(() => {
        if (cloData?.data && subjectsData?.data && curriculumData?.data && !processedCloData.current) {
            // 1. นับจำนวน CLO ในแต่ละวิชา
            const subjectCloCountMap = new Map();
            const curriculumSubjectMap = new Map();

            // สร้าง map ของวิชากับหลักสูตร
            subjectsData.data.forEach((subject) => {
                if (subject.curriculum && subject.curriculum.id) {
                    curriculumSubjectMap.set(subject.id, {
                        curriculumId: subject.curriculum.id,
                        curriculumName: subject.curriculum.degreeShortTh || `Curriculum ${subject.curriculum.id}`
                    });
                }
            });

            cloData.data.forEach((clo) => {
                if (clo.subjects) {
                    const subjectId = clo.subjects.id;
                    const subjectName = clo.subjects.subNameTh || `รหัสวิชา: ${clo.subjects.subId}`;
                    const curriculumInfo = curriculumSubjectMap.get(subjectId) ||
                    {
                        curriculumId: clo.curriculum?.id,
                        curriculumName: clo.curriculum?.degreeShortTh || `Curriculum ${clo.curriculum?.id}`
                    };

                    if (!subjectCloCountMap.has(subjectId)) {
                        subjectCloCountMap.set(subjectId, {
                            label: subjectName.length > 15 ? subjectName.substring(0, 15) + '...' : subjectName,
                            count: 0,
                            curriculumId: curriculumInfo.curriculumId,
                            curriculumName: curriculumInfo.curriculumName
                        });
                    }

                    subjectCloCountMap.get(subjectId).count += 1;
                }
            });

            // แปลง Map เป็น arrays สำหรับกราฟ CLO แยกตามวิชา
            const subjectLabels = Array.from(subjectCloCountMap.values()).map(item => item.label);
            const cloCounts = Array.from(subjectCloCountMap.values()).map(item => item.count);
            const curriculumIds = Array.from(subjectCloCountMap.values()).map(item => item.curriculumId);

            setCloChartData({
                subjectLabels: subjectLabels,
                cloCountsPerSubject: cloCounts,
                curriculumIds: curriculumIds
            });

            // จัดกลุ่มข้อมูลตามหลักสูตร
            const groupedData = new Map();

            Array.from(subjectCloCountMap.values()).forEach(item => {
                const currName = item.curriculumName || "ไม่ระบุหลักสูตร";

                if (!groupedData.has(currName)) {
                    groupedData.set(currName, {
                        curriculumName: currName,
                        subjects: []
                    });
                }

                groupedData.get(currName).subjects.push({
                    label: item.label,
                    count: item.count
                });
            });

            setGroupedCloData(Array.from(groupedData.values()));

            // 2. นับจำนวนวิชาในแต่ละหลักสูตร
            const curriculumSubjectsMap = new Map();

            // เตรียมข้อมูลหลักสูตร
            curriculumData.data.forEach((curriculum) => {
                curriculumSubjectsMap.set(curriculum.id, {
                    curriculumName: curriculum.degreeShortTh || `Curriculum ${curriculum.id}`,
                    subjectCount: 0
                });
            });

            // นับจำนวนวิชาในแต่ละหลักสูตร
            subjectsData.data.forEach((subject) => {
                if (subject.curriculum && subject.curriculum.id) {
                    const curriculumId = subject.curriculum.id;
                    if (curriculumSubjectsMap.has(curriculumId)) {
                        curriculumSubjectsMap.get(curriculumId).subjectCount += 1;
                    }
                }
            });

            // แปลง Map เป็น array สำหรับการแสดงผล
            const currSubjectsData = Array.from(curriculumSubjectsMap.values()).filter(item => item.subjectCount > 0);
            setCurriculumSubjectsData(currSubjectsData);

            processedCloData.current = true;
        }
    }, [cloData?.data, subjectsData?.data, curriculumData?.data]);

    // สร้างสีสำหรับ PieChart
    const generatePieColors = (dataLength: any) => {
        const colors = [
            '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
            '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
        ];

        return Array(dataLength).fill(0).map((_, i) => colors[i % colors.length]);
    };

    return (
        <>
            <PageContentLayout
                title="แดชบอร์ด"
                icon={<DashboardIcon />}
            >
                <CardBox>
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

                        {/* PLO Chart */}
                        <Grid item xs={12} md={12} lg={6}>
                            <div className="w-full h-full bg-white p-4 rounded-lg shadow">
                                <h2 className="text-xl font-bold text-center mb-4">จำนวน PLO ตามหลักสูตร</h2>
                                {chartData.curriculumLabels.length > 0 ? (
                                    <BarChart
                                        series={[
                                            {
                                                data: chartData.ploCountsPerCurriculum,
                                                label: 'จํานวน PLO',
                                                color: '#2563eb'
                                            }
                                        ]}
                                        height={290}
                                        xAxis={[{
                                            data: chartData.curriculumLabels,
                                            scaleType: 'band'
                                        }]}
                                        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                                    />
                                ) : (
                                    <div className="h-64 flex items-center justify-center">
                                        <p className="text-gray-500">ไม่พบข้อมูล PLO</p>
                                    </div>
                                )}
                            </div>
                        </Grid>

                        {/* CLO Chart */}
                        <Grid item xs={12} md={12} lg={6}>
                            <div className="w-full h-full bg-white p-4 rounded-lg shadow">
                                <h2 className="text-xl font-bold text-center mb-4">จำนวน CLO แต่ละวิชา</h2>
                                {cloChartData.subjectLabels.length > 0 ? (
                                    <BarChart
                                        series={[
                                            {
                                                data: cloChartData.cloCountsPerSubject,
                                                label: 'จํานวน CLO',
                                                color: '#10b981'
                                            }
                                        ]}
                                        height={290}
                                        xAxis={[{
                                            data: cloChartData.subjectLabels,
                                            scaleType: 'band'
                                        }]}
                                        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                                    />
                                ) : (
                                    <div className="h-64 flex items-center justify-center">
                                        <p className="text-gray-500">ไม่พบข้อมูล CLO</p>
                                    </div>
                                )}
                            </div>
                        </Grid>

                        {/* Subjects per Curriculum Pie Chart */}
                        <Grid item xs={12} md={12} lg={6}>
                            <div className="w-full h-full bg-white p-4 rounded-lg shadow">
                                <h2 className="text-xl font-bold text-center mb-4">จํานวนวิชาตามหลักสูตร</h2>
                                {curriculumSubjectsData.length > 0 ? (
                                    <PieChart
                                        series={[
                                            {
                                                data: curriculumSubjectsData.map((item, index) => ({
                                                    id: index,
                                                    value: item.subjectCount,
                                                    label: item.curriculumName
                                                })),
                                                innerRadius: 30,
                                                outerRadius: 100,
                                                paddingAngle: 2,
                                                cornerRadius: 5,
                                                startAngle: -90,
                                                endAngle: 270,
                                                cx: 150,
                                                cy: 150
                                            }
                                        ]}
                                        height={290}
                                        colors={generatePieColors(curriculumSubjectsData.length)}
                                        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                                        slotProps={{
                                            legend: {
                                                direction: 'column',
                                                position: { vertical: 'middle', horizontal: 'right' },
                                                padding: 0
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="h-64 flex items-center justify-center">
                                        <p className="text-gray-500">ไม่พบข้อมูลวิชาในหลักสูตร</p>
                                    </div>
                                )}
                            </div>
                        </Grid>

                        {/* Active vs Inactive Subjects Chart */}
                        <Grid item xs={12} md={12} lg={6}>
                            <div className="w-full h-full bg-white p-4 rounded-lg shadow">
                                <h2 className="text-xl font-bold text-center mb-4">จํานวนวิชาที่ใช้งานและไม่ใช้งาน</h2>
                                {subjectsData?.data ? (
                                    <PieChart
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: countSubjectActive, label: 'Active' },
                                                    { id: 1, value: (subjectsData.data.length - countSubjectActive), label: 'Inactive' }
                                                ],
                                                innerRadius: 30,
                                                outerRadius: 100,
                                                paddingAngle: 2,
                                                cornerRadius: 5,
                                                startAngle: -90,
                                                endAngle: 270,
                                                cx: 150,
                                                cy: 150
                                            }
                                        ]}
                                        height={290}
                                        colors={['#10b981', '#cbd5e1']}
                                        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                                        slotProps={{
                                            legend: {
                                                direction: 'column',
                                                position: { vertical: 'middle', horizontal: 'right' },
                                                padding: 0
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="h-64 flex items-center justify-center">
                                        <p className="text-gray-500">ไม่พบข้อมูลวิชา</p>
                                    </div>
                                )}
                            </div>
                        </Grid>
                    </Grid>
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