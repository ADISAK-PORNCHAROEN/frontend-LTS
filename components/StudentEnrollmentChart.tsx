"use client";
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Grid, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Switch, FormControlLabel, LinearProgress } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useSession } from 'next-auth/react';
import { StudentEnrollmentChartProps, ComprehensiveChartData } from '#/types/LTS/ILts';
import { m } from 'framer-motion';

export const StudentEnrollmentChart = ({
    excelData,
    isLoadingCloList,
    isLoadingExcelData,
    subjects = []
}: StudentEnrollmentChartProps) => {
    const { data: session } = useSession();
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [availableSubjects, setAvailableSubjects] = useState<{ id: number; subNameTh: string }[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [showAllData, setShowAllData] = useState<boolean>(true);
    const [chartData, setChartData] = useState<{
        studentCount: number;
        subjectName: string;
    }>({
        studentCount: 0,
        subjectName: ""
    });
    const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveChartData>({
        labels: [],
        data: []
    });

    console.log("subjects", subjects)

    useEffect(() => {
        if (isLoadingExcelData || !excelData?.data || subjects.length === 0) return;

        // รับรองว่ามีข้อมูล subjects ครบถ้วนก่อนประมวลผล
        const validSubjects = subjects.filter(sub => sub.id && sub.subNameTh);
        if (validSubjects.length === 0) return;

        const userSubjectIds = new Set(validSubjects.map(sub => sub.id));

        const filteredData = validSubjects.length > 0
            ? excelData.data.filter(item => userSubjectIds.has(item.subId))
            : excelData.data;

        const years = Array.from(new Set(filteredData.map(item => item.year))).sort();
        setAvailableYears(years);

        if (years.length > 0 && !selectedYear) {
            setSelectedYear(years[years.length - 1]);
        }

        const subjectsFromData = Array.from(
            new Set(filteredData.map(item => item.subId))
        ).map(subId => {
            const subject = subjects.find(s => s.id === subId);
            return {
                id: subId,
                subNameTh: subject?.subNameTh!
            };
        });

        setAvailableSubjects(subjectsFromData);

        if (subjectsFromData.length > 0 && !selectedSubject && subjectsFromData[0].subNameTh) {
            setSelectedSubject(subjectsFromData[0].id.toString());
        }
    }, [excelData, isLoadingExcelData, selectedYear, subjects]);

    useEffect(() => {
        if (!excelData?.data || !selectedYear || !selectedSubject) return;

        const subId = parseInt(selectedSubject);

        const filteredData = excelData.data.filter(
            item => item.year === selectedYear && item.subId === subId
        );

        const semesters = Array.from(
            new Set(filteredData.map(item => item.semester))
        ).sort();

        setAvailableSemesters(semesters);

        if (semesters.length > 0 && (!selectedSemester || !semesters.includes(parseInt(selectedSemester)))) {
            setSelectedSemester(semesters[0].toString());
        }
    }, [excelData, selectedYear, selectedSubject]);

    useEffect(() => {
        if (!excelData?.data || !selectedYear || !selectedSubject || !selectedSemester) return;

        const subId = parseInt(selectedSubject);
        const semesterId = parseInt(selectedSemester);

        const subject = availableSubjects.find(s => s.id === subId);
        const subjectName = subject?.subNameTh as string;

        const filteredData = excelData.data.filter(item =>
            item.year === selectedYear &&
            item.subId === subId &&
            item.semester === semesterId
        );

        const uniqueStudents = new Set(filteredData.map(item => item.id));

        setChartData({
            studentCount: uniqueStudents.size,
            subjectName
        });
    }, [excelData, selectedYear, selectedSubject, selectedSemester, availableSubjects]);

    useEffect(() => {
        if (isLoadingExcelData || !excelData?.data || !selectedSubject) return;

        const subId = parseInt(selectedSubject);

        const subject = availableSubjects.find(s => s.id === subId);
        const subjectName = subject?.subNameTh;

        const subjectData = excelData.data.filter(item => item.subId === subId);

        const groupedData: Map<string, Set<number>> = new Map();

        subjectData.forEach(item => {
            const key = `${item.year} (${item.semester})`;
            if (!groupedData.has(key)) {
                groupedData.set(key, new Set());
            }
            groupedData.get(key)!.add(item.id);
        });

        const sortedLabels = Array.from(groupedData.keys()).sort((a, b) => {
            const [yearA, semA] = a.split(' ');
            const [yearB, semB] = b.split(' ');
            return yearA === yearB
                ? parseInt(semA.replace(/[()]/g, '')) - parseInt(semB.replace(/[()]/g, ''))
                : yearA.localeCompare(yearB);
        });

        const chartData = {
            labels: sortedLabels,
            data: sortedLabels.map(key => groupedData.get(key)!.size)
        };

        setComprehensiveData(chartData);
    }, [excelData, selectedSubject, availableSubjects]);

    const handleYearChange = (event: SelectChangeEvent) => {
        setSelectedYear(event.target.value);
        setSelectedSemester("");
    };

    const handleSemesterChange = (event: SelectChangeEvent) => {
        setSelectedSemester(event.target.value);
    };

    const handleSubjectChange = (event: SelectChangeEvent) => {
        setSelectedSubject(event.target.value);
        setSelectedSemester("");
    };

    const handleToggleView = () => {
        setShowAllData(!showAllData);
    };

    if (isLoadingCloList || isLoadingExcelData) {
        return <div className='mt-4'>
            <LinearProgress />;
        </div>
    }

    if (!excelData?.data || excelData.data.length === 0) {
        return <Typography>ไม่พบข้อมูลนักศึกษา</Typography>;
    }

    const subjectName = availableSubjects.find(s => s.id === parseInt(selectedSubject))?.subNameTh

    return (
        <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        height: '100%'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        mb: 3
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
                            <SchoolIcon sx={{ fontSize: 30, color: '#1976d2', mr: 1 }} />
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                จำนวนนักศึกษาที่ลงทะเบียนเรียน
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                            alignItems: 'center'
                        }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showAllData}
                                        onChange={handleToggleView}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                                        แสดงข้อมูลทั้งหมด
                                    </Typography>
                                }
                            />

                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel id="subject-select-label">รายวิชา</InputLabel>
                                <Select
                                    labelId="subject-select-label"
                                    id="subject-select"
                                    value={selectedSubject}
                                    label="รายวิชา"
                                    onChange={handleSubjectChange}
                                >
                                    {availableSubjects.length > 0 ? (
                                        availableSubjects.map(subject => (
                                            <MenuItem key={subject.id} value={subject.id.toString()}>
                                                {subject.subNameTh || 'กำลังโหลด...'}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>กำลังโหลดรายวิชา...</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            {!showAllData && (
                                <>
                                    <FormControl sx={{ minWidth: 100 }} size="small">
                                        <InputLabel id="year-select-label">ปีการศึกษา</InputLabel>
                                        <Select
                                            labelId="year-select-label"
                                            id="year-select"
                                            value={selectedYear}
                                            label="ปีการศึกษา"
                                            onChange={handleYearChange}
                                        >
                                            {availableYears.map(year => (
                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl sx={{ minWidth: 100 }} size="small">
                                        <InputLabel id="semester-select-label">ภาคเรียน</InputLabel>
                                        <Select
                                            labelId="semester-select-label"
                                            id="semester-select"
                                            value={selectedSemester}
                                            label="ภาคเรียน"
                                            onChange={handleSemesterChange}
                                            disabled={availableSemesters.length === 0}
                                        >
                                            {availableSemesters.map(semester => (
                                                <MenuItem key={semester} value={semester.toString()}>
                                                    {semester}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </>
                            )}
                        </Box>
                    </Box>

                    {!showAllData && selectedYear && selectedSubject && selectedSemester && (
                        <Box sx={{ height: 400, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <BarChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: [`${chartData.subjectName}`],
                                    tickLabelStyle: {
                                        fontSize: 16,
                                        fontWeight: 'bold'
                                    }
                                }]}
                                series={[
                                    {
                                        data: [chartData.studentCount],
                                        label: 'จำนวนนักศึกษาลงทะเบียน',
                                        color: '#1976d2'
                                    }
                                ]}
                                height={300}
                                width={500}
                            // margin={{ top: 10, bottom: 50, left: 80, right: 80 }}
                            />

                            <Box sx={{
                                mt: 4,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: '#e3f2fd',
                                textAlign: 'center',
                                width: 'fit-content'
                            }}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'medium' }}>
                                    {`วิชา ${chartData.subjectName} ปีการศึกษา ${selectedYear} ภาคเรียนที่ ${selectedSemester}`}
                                </Typography>
                                <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                                    {`มีนักศึกษาลงทะเบียนทั้งหมด ${chartData.studentCount} คน`}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* แสดงข้อมูลทั้งหมดของวิชาที่เลือก */}
                    {showAllData && selectedSubject && (
                        <Box sx={{ height: 500, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            {comprehensiveData.labels.length > 0 ? (
                                <>
                                    <BarChart
                                        xAxis={[{
                                            scaleType: 'band',
                                            data: comprehensiveData.labels,
                                            tickLabelStyle: {
                                                fontSize: 12,
                                            }
                                        }]}
                                        series={[
                                            {
                                                data: comprehensiveData.data,
                                                label: 'จำนวนนักศึกษาลงทะเบียน',
                                                color: '#1976d2'
                                            }
                                        ]}
                                        height={350}
                                    // width={Math.max(500, comprehensiveData.labels.length * 70)}
                                    // margin={{ top: 10, bottom: 70, left: 80, right: 80 }}
                                    />

                                    <Box sx={{
                                        mt: 4,
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: '#e3f2fd',
                                        textAlign: 'center',
                                        width: 'fit-content'
                                    }}>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'medium' }}>
                                            {`วิชา ${subjectName} - ข้อมูลทั้งหมด`}
                                        </Typography>
                                        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                                            {`มีข้อมูลทั้งหมด ${comprehensiveData.labels.length} ภาคการศึกษา`}
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        ไม่พบข้อมูลนักศึกษาสำหรับวิชานี้
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {(!selectedSubject || (!selectedYear || !selectedSemester) && !showAllData) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <Typography variant="body1" color="text.secondary">
                                {!selectedSubject
                                    ? 'กรุณาเลือกรายวิชาเพื่อแสดงข้อมูล'
                                    : 'กรุณาเลือกปีการศึกษาและภาคเรียน หรือเปิดโหมดแสดงข้อมูลทั้งหมด'}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};