"use client";
import { useEffect, useState } from 'react';
import {
    Grid, Typography, Box, Paper, FormControl, InputLabel,
    Select, MenuItem, SelectChangeEvent, LinearProgress,
    Chip
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useSession } from 'next-auth/react';
import { StudentEnrollmentChartProps } from '#/types/LTS/ILts';
import useGetAllUserCloScore from '#/hooks/useGetAllUserCloScore';
import { BarChart } from '@mui/x-charts/BarChart';

interface CloScoreThreshold {
    cloId: number;
    requiredScore: number;
}


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
    const [cloThresholds, setCloThresholds] = useState<CloScoreThreshold[]>([]);
    const [validationResults, setValidationResults] = useState<any[]>([]);
    const { data: userCloScoreData, isLoading: isLoadingUserCloScoreData, refetch } = useGetAllUserCloScore();
    const [initialSetupDone, setInitialSetupDone] = useState(false);

    useEffect(() => {
        if (isLoadingExcelData || !excelData?.data || subjects.length === 0) return;
        if (initialSetupDone) return;

        const validSubjects = subjects.filter(sub => sub.id && sub.subNameTh);
        if (validSubjects.length === 0) return;

        const userSubjectIds = new Set(validSubjects.map(sub => sub.id));

        const filteredData = validSubjects.length > 0
            ? excelData.data.filter(item => userSubjectIds.has(item.subId))
            : excelData.data;

        const years = Array.from(new Set(filteredData.map(item => item.year))).sort();
        setAvailableYears(years);

        const subjectsFromData = Array.from(
            new Set(filteredData.map(item => item.subId))
        ).map(subId => {
            const subject = subjects.find(s => s.id === subId);
            return {
                id: subId,
                subNameTh: subject?.subNameTh || ''
            };
        }).filter(subject => subject.subNameTh);

        setAvailableSubjects(subjectsFromData);

        if (years.length > 0 && subjectsFromData.length > 0) {
            setSelectedYear(years[years.length - 1]);
            setSelectedSubject(subjectsFromData[0].id.toString());
            setInitialSetupDone(true);
        }
    }, [excelData?.data, isLoadingExcelData, subjects, initialSetupDone]);

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
    }, [excelData?.data, selectedYear, selectedSubject, selectedSemester]); 

    useEffect(() => {
        if (isLoadingUserCloScoreData || isLoadingExcelData ||
            !userCloScoreData || !excelData?.data ||
            !selectedYear || !selectedSubject || !selectedSemester) {
            return;
        }

        const subId = parseInt(selectedSubject);
        const semesterId = parseInt(selectedSemester);

        const thresholds = userCloScoreData?.data?.filter(item =>
            item.subId === subId &&
            item.year === selectedYear &&
            item.semester === semesterId)
            .map(item => ({
                cloId: item.userCloId!,
                requiredScore: item.score ?? 0
            }));

        setCloThresholds(thresholds || []);

        const relevantExcelData = excelData.data.filter(student =>
            student.subId === subId &&
            student.year === selectedYear &&
            student.semester === semesterId
        );

        const results = relevantExcelData.map(student => {
            const studentCloScores = student.excel || [];

            const cloResults = thresholds?.map(threshold => {
                const studentCloScore = studentCloScores.find(score => score.userCloId === threshold.cloId);
                const scoreValue = studentCloScore ? studentCloScore.score : 0;
                const isPassing = scoreValue >= threshold?.requiredScore;

                return {
                    cloId: threshold.cloId,
                    requiredScore: threshold.requiredScore,
                    actualScore: scoreValue,
                    isPassing
                };
            }) || [];

            const overallResult = cloResults.every(result => result.isPassing);

            return {
                studentId: student.id,
                studentName: student.fullName,
                stuId: student.subId,
                cloResults,
                overallResult
            };
        });

        setValidationResults(results);
    }, [
        userCloScoreData,
        selectedYear,
        selectedSubject,
        selectedSemester,
        isLoadingUserCloScoreData,
        isLoadingExcelData,
        excelData
    ]);

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

    const getChartData = () => {
        if (!validationResults.length) return { xAxisData: [], passData: [], failData: [] };

        // นับจำนวนคนที่ผ่านและไม่ผ่านรวม
        const passCount = validationResults.filter(student => student.overallResult).length;
        const failCount = validationResults.filter(student => !student.overallResult).length;

        // ข้อมูล CLO แต่ละตัว
        const cloLabels = cloThresholds.map((_, index) => `CLO ${index + 1}`);
        const cloPassCounts = cloLabels.map((_, index) => {
            return validationResults.filter(student =>
                student.cloResults[index]?.isPassing
            ).length;
        });
        const cloFailCounts = cloLabels.map((_, index) => {
            return validationResults.filter(student =>
                !student.cloResults[index]?.isPassing
            ).length;
        });

        return {
            xAxisData: ['ผลรวม', ...cloLabels],
            passData: [passCount, ...cloPassCounts],
            failData: [failCount, ...cloFailCounts]
        };
    };

    if (isLoadingCloList || isLoadingExcelData || isLoadingUserCloScoreData) {
        return <div className='mt-4'>
            <LinearProgress />
        </div>
    }

    if (!excelData?.data || excelData.data.length === 0) {
        return <Typography>ไม่พบข้อมูลนักศึกษา</Typography>;
    }

    if (!userCloScoreData || userCloScoreData?.data?.length === 0) {
        return <Typography>ไม่พบข้อมูลเกณฑ์คะแนน CLO</Typography>;
    }

    const { xAxisData, passData, failData } = getChartData();

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
                                ผลการตรวจสอบคะแนน CLO
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                            alignItems: 'center'
                        }}>
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
                        </Box>
                    </Box>

                    {selectedYear && selectedSubject && selectedSemester && (
                        <>
                            {/* CLO Thresholds Summary */}
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    เกณฑ์การผ่าน CLO:
                                </Typography>
                                <Grid container spacing={2}>
                                    {cloThresholds.map((threshold, index) => (
                                        <Grid item key={threshold.cloId}>
                                            <Chip
                                                label={`CLO ${index + 1}: ≥ ${threshold.requiredScore}`}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                    *นักศึกษาต้องผ่านทุก CLO จึงจะถือว่าผ่านเกณฑ์โดยรวม
                                </Typography>
                            </Box>

                            {/* Chart MUI */}
                            <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <BarChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="h6">กราฟแสดงผลการตรวจสอบคะแนน CLO</Typography>
                                </Box>
                                <Box sx={{ width: '100%', height: 400 }}>
                                    {validationResults.length > 0 && (
                                        <BarChart
                                            height={350}
                                            series={[
                                                {
                                                    data: passData,
                                                    label: 'จำนวนนักศึกษาที่ผ่าน',
                                                    color: '#4caf50',
                                                    valueFormatter: (value) => `${value} คน`
                                                },
                                                {
                                                    data: failData,
                                                    label: 'จำนวนนักศึกษาที่ไม่ผ่าน',
                                                    color: '#f44336',
                                                    valueFormatter: (value) => `${value} คน`
                                                }
                                            ]}
                                            xAxis={[{
                                                data: xAxisData,
                                                scaleType: 'band'
                                            }]}
                                            yAxis={[{
                                                label: 'จำนวนนักศึกษา (คน)'
                                            }]}
                                            title="ผลการตรวจสอบคะแนน CLO"
                                            sx={{ width: '100%' }}
                                        />
                                    )}
                                </Box>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', mr: 1 }}></Box>
                                        <Typography variant="body2">ผ่านเกณฑ์</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', mr: 1 }}></Box>
                                        <Typography variant="body2">ไม่ผ่านเกณฑ์</Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Summary Statistics */}
                            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    สรุปผล:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Typography>
                                        จำนวนนักศึกษาทั้งหมด: {validationResults.length} คน
                                    </Typography>
                                    <Typography>
                                        ผ่านเกณฑ์: {validationResults.filter(student => student.overallResult).length} คน
                                    </Typography>
                                    <Typography>
                                        ไม่ผ่านเกณฑ์: {validationResults.filter(student => !student.overallResult).length} คน
                                    </Typography>
                                </Box>
                            </Box>
                        </>
                    )}

                    {(!selectedSubject || (!selectedYear || !selectedSemester)) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <Typography variant="body1" color="text.secondary">
                                {!selectedSubject
                                    ? 'กรุณาเลือกรายวิชาเพื่อแสดงข้อมูล'
                                    : 'กรุณาเลือกปีการศึกษาและภาคเรียน'}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};