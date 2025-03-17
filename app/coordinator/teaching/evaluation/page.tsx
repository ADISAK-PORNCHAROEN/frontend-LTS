"use client";
import { useEffect, useRef, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Backdrop, CircularProgress, Menu, MenuItem, TextField } from '@mui/material';
import Table, { createColumn } from '#/components/table/Table';
import TableWithSearch from '#/components/table/TableWithSearch';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import { useRouter, useSearchParams } from 'next/navigation';
import { IExcel, ISubjects, IUserCloList, IUserExcel } from '#/types/LTS/ILts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useSession } from 'next-auth/react';
import useGetAllUserCloList from '#/hooks/useGetAllUserCloList';
import useGetAllUserExcel from '#/hooks/useGetAllUserExcel';
import useDeleteUserExcel from '#/hooks/useDeleteUserExcel';
import AlertConfirm from '#/components/modal/AlertConfirm';
import useUplodaExcel from '#/hooks/useUplodaExcel';
import ModalForm from '#/components/modal/ModalForm';
import Table2 from '#/components/table/Table2';
import useUpdateExcelScore from '#/hooks/useUpdateExcelScore';
import { IResponse } from "#/types/IResponse/IResponse";
import useUpdateExcelName from '#/hooks/useUpdateExcelName';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import AccessDeniedPage from '#/components/AccessDeniedPage';

export default function Page() {
    const [rows, setRows] = useState<IUserExcel[]>([]);
    const [modalRows, setModalRows] = useState<IUserExcel[]>([]);
    const [rowsSelectedModal, setRowsSelectedModal] = useState<IUserExcel[]>([]);
    const [cols, setCols] = useState<IUserCloList[]>([]);
    const [scoreChanges, setScoreChanges] = useState({});
    const [nameChanges, setNameChanges] = useState<{ [key: number]: string }>({});
    const [rowsSelected, setRowsSelected] = useState<IUserExcel[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>("fullName");
    const [yearValue, setYearValue] = useState<string>("");
    const [yearOptions, setYearOptions] = useState<{ value: string, name: string }[]>([]);
    const [semesterValue, setSemesterValue] = useState<string>("1");
    const [pagination, setPagination] = useState({ pageSize: 10, page: 0 });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { mutateAsync: uploadExcel, isLoading: isLoadingUpload } = useUplodaExcel();
    const { mutateAsync: uploadExcelScore, isLoading: isLoadingUploadScore } = useUpdateExcelScore();
    const { mutateAsync: uploadExcelName, isLoading: isLoadingUploadName } = useUpdateExcelName();
    const { mutateAsync: deleteUserExcel, isLoading: isLoadingDeleteUserExcel } = useDeleteUserExcel();
    const { data: colListClo, isLoading: isLoadingColListClo } = useGetAllUserCloList();
    const { data: excelData, isLoading: isLoadingExcelData } = useGetAllUserExcel();
    const { data: userData, isLoading: isLoadingUserData } = useGetAllUsers();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const isUserSelected = useRef(false);
    const session = useSession();
    const user = session.data?.user;
    const router = useRouter();
    const [key, setKey] = useState(0);
    const { encode, decode } = useUrlSafeBase64();
    const searchParams = useSearchParams();
    const subId = searchParams.get("sub");
    const curId = searchParams.get("cur");
    const paramsSubId = Number(subId ? decode(subId) : null);
    const paramsCurId = Number(curId ? decode(curId) : null);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);
    const [isOpenAlertForm, setIsOpenAlertForm] = useState(false);
    const [isOpenConfirmModalAlert, setIsOpenConfirmModalAlert] = useState(false);

    const Role = {
        isAdmin: "admin",
        isCoordinator: "program_coordinator",
        isInstructor: "instructor"
    }

    useEffect(() => {
        const checkAccess = async () => {
            if (!userData?.data || !user || !paramsSubId || !paramsCurId) {
                return;
            }

            let hasPermission = false;

            if (user.role === Role.isAdmin) {
                hasPermission = true;
            } else {
                const currentUser = userData.data.find((u: any) => u.id === user.id);

                if (currentUser) {
                    const hasSubject = currentUser.subjects?.some((subject: any) => {
                        return subject.subjects?.some((sub: any) =>
                            sub.id === paramsSubId &&
                            sub.curriculum?.id === paramsCurId
                        );
                    });

                    hasPermission = !!hasSubject;
                }
            }

            setHasAccess(hasPermission);
            setIsCheckingAccess(false);
        };

        checkAccess();
    }, [userData, user, paramsSubId, paramsCurId, Role.isAdmin, Role.isCoordinator]);

    // เปลี่ยนนิยาม state
    const [semesterOptions, setSemesterOptions] = useState<{ value: string, name: string, hasData?: boolean }[]>([
        { value: "1", name: "ภาคการศึกษาที่ 1", hasData: false },
        { value: "2", name: "ภาคการศึกษาที่ 2", hasData: false },
        { value: "3", name: "ภาคฤดูร้อน", hasData: false }
    ]);


    useEffect(() => {
        if (colListClo?.data && yearValue) {
            const yearFilteredData = colListClo.data.filter((item: IUserCloList) =>
                item.subId === paramsSubId &&
                item.curriculumId === paramsCurId &&
                item.year === yearValue
            );

            const existingSemesters = new Set(
                yearFilteredData.map((item: IUserCloList) => item.semester?.toString())
            );

            const latestSemester = Math.max(
                ...yearFilteredData.map((item) => Number(item.semester || "0")),
                0
            ).toString();

            const allSemesters = [
                { value: "1", name: "ภาคการศึกษาที่ 1", hasData: existingSemesters.has("1") },
                { value: "2", name: "ภาคการศึกษาที่ 2", hasData: existingSemesters.has("2") },
                { value: "3", name: "ภาคฤดูร้อน", hasData: existingSemesters.has("3") }
            ];

            setSemesterOptions(allSemesters);

            if (!isUserSelected.current) {
                if (latestSemester !== "0") {
                    setSemesterValue(latestSemester);
                }
            }
        } else {
            setSemesterOptions([
                { value: "1", name: "ภาคการศึกษาที่ 1", hasData: false },
                { value: "2", name: "ภาคการศึกษาที่ 2", hasData: false },
                { value: "3", name: "ภาคฤดูร้อน", hasData: false }
            ]);
        }
    }, [yearValue, paramsSubId, paramsCurId, colListClo?.data]);

    useEffect(() => {
        if (colListClo?.data) {
            const filteredData = colListClo.data.filter((item: IUserCloList) =>
                item.subId === paramsSubId &&
                item.curriculumId === paramsCurId
            );

            const uniqueYears = Array.from(new Set(
                filteredData.map((item: IUserCloList) => item.year)
            )).filter(Boolean).sort();

            const options = uniqueYears.map(year => ({
                value: year as string,
                name: year as string
            }));

            setYearOptions(options);

            const isYearStillValid = options.some(option => option.value === yearValue);

            if (options.length > 0 && !isYearStillValid) {
                const latestYear = options[options.length - 1].value;
                setYearValue(latestYear);
            }
        }
    }, [paramsSubId, paramsCurId, yearValue, colListClo?.data]);

    useEffect(() => {
        if (colListClo?.data && yearValue) {
            const parsedData = colListClo?.data?.filter((item: IUserCloList) =>
                item.subId === paramsSubId &&
                item.curriculumId === paramsCurId &&
                item.year === yearValue &&
                item.semester === Number(semesterValue)
            );

            setCols(parsedData);
        }
    }, [paramsCurId, paramsSubId, yearValue, semesterValue, colListClo?.data]);

    useEffect(() => {
        if (excelData?.data && yearValue) {
            const parsedData = excelData?.data?.filter((item: IUserExcel) =>
                item.subId === paramsSubId &&
                item.year === yearValue &&
                item.semester === Number(semesterValue)
            );

            setRows(parsedData);
        }
    }, [paramsCurId, paramsSubId, yearValue, semesterValue, excelData?.data]);

    const handleConfirmDelete = () => {
        setAnchorEl(null);
        setIsOpenConfirmModalAlert(true);
    }

    const handleDelete = async (data: IUserExcel[]) => {
        setIsOpenConfirmModalAlert(false);
        try {
            const ids = data.map((row: IUserExcel) => row.id).join(',');
            const res = await deleteUserExcel({ ids });

            if (res.success === true) {
                setAnchorEl(null);
                setRowsSelected([]);
                setKey(key + 1);

                setTextAlertBox("ลบข้อมูลสําเร็จ");
                setTypeAlertBox("success");
                setIsOpenAlertBox(true);
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                }, 1500);
            } else {
                setTextAlertBox("ได้เกิดข้อผิดพลาดในการลบข้อมูล");
                setTypeAlertBox("error");
                setIsOpenAlertBox(true);
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                }, 1500)
            }
        } catch (error) {
            console.error("Error deleting subjects:", error);
        }
    }

    const handleUploadExcel = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx';
        fileInput.onchange = async (event) => {
            const file = (event?.target as HTMLInputElement)?.files?.[0];
            if (file) {
                const payload: IExcel = {
                    year: yearValue,
                    semester: Number(semesterValue),
                    curriculumId: paramsCurId,
                    subId: paramsSubId,
                    createdBy: user?.name,
                    createdDate: new Date(),
                };

                try {
                    const res = await uploadExcel({ payload, file });

                    if (res.success === true) {

                        if (res.data && typeof res.data === 'string' && (res.data as string).toLowerCase().includes('อัปโหลดไม่สําเร็จ')) {
                            setTextAlertBox(res.data);
                            setTypeAlertBox("error");
                        } else {
                            setTextAlertBox("อัปโหลดสําเร็จ");
                            setTypeAlertBox("success");
                        }
                    } else {

                        const errorMessage = res.message || "อัปโหลดไม่สําเร็จ";
                        setTextAlertBox(errorMessage);
                        setTypeAlertBox("error");
                    }
                } catch (error: any) {

                    console.error("API Error:", error);
                    const errorMessage = error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        "อัปโหลดไม่สําเร็จ";
                    setTextAlertBox(errorMessage);
                    setTypeAlertBox("error");
                }

                setIsOpenAlertBox(true);
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                }, 3000);
            }
        };
        fileInput.click();
    }

    const handleSearchTextClear = () => {
        setSearchText('');
    };

    const handleSelectRows = (rowSelected: IUserExcel[]) => {
        setRowsSelected(rowSelected);
    };

    const handleScoreChange = ({ rowId, excelId, userCloId, newScore }: any) => {
        setScoreChanges(prev => ({
            ...prev,
            [`${rowId}-${excelId}-${userCloId}`]: newScore
        }));

        // Also update the rowsSelectedModal directly
        setRowsSelectedModal(prev =>
            prev.map(row => {
                if (row.id === rowId && row.excel) {
                    return {
                        ...row,
                        excel: row.excel.map(item => {
                            if (item.id === excelId && item.userCloId === userCloId) {
                                return { ...item, score: newScore };
                            }
                            return item;
                        })
                    };
                }
                return row;
            })
        );
    }

    const handleNameChange = (rowId: number, newName: string) => {
        setNameChanges(prev => ({
            ...prev,
            [rowId]: newName
        }));

        // Also update the rowsSelectedModal directly
        setRowsSelectedModal(prev =>
            prev.map(row => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        fullName: newName
                    };
                }
                return row;
            })
        );
    }

    const column: GridColDef[] = [
        createColumn("fullName", "STRING", "รายชื่อนักศึกษา", 400, {
            headerAlign: "center",
            align: "left",
        })
    ]

    const colClo = cols.map((item: IUserCloList) => item.cloName).map(
        (cloName) => cloName ? (
            createColumn(cloName, "STRING", cloName, 150, {
                headerAlign: "center",
                align: "center",
                renderCell: (params) => {
                    const currentCloId = cols.find((col: IUserCloList) => col.cloName === cloName)?.id;

                    if (!params.row.excel) {
                        return 0;
                    }

                    const matchingItem = params.row.excel.find((item: IExcel) =>
                        item.userCloId === currentCloId
                    );

                    return matchingItem ? matchingItem.score : 0;
                }
            })
        ) : null
    );

    const columnEdit: GridColDef[] = [
        createColumn("fullName", "STRING", "รายชื่อนักศึกษา", 400, {
            headerAlign: "center",
            align: "left",
            renderCell(params) {
                const fullName = params.row.fullName
                return (
                    <TextField
                        fullWidth
                        size="small"
                        defaultValue={fullName}
                        onChange={(e) => handleNameChange(params.row.id, e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === " ") {
                                e.stopPropagation(); // ป้องกัน DataGrid บล็อก Spacebar
                            }
                        }}
                    />
                )
            },
        })
    ]

    const colCloEdit = cols.map((item: IUserCloList) => item.cloName).map(
        (cloName) => cloName ? (
            createColumn(cloName, "STRING", cloName, 150, {
                headerAlign: "center",
                align: "center",
                renderCell: (params) => {
                    const currentCloId = cols.find((col: IUserCloList) => col.cloName === cloName)?.id;

                    if (!params.row.excel) {
                        return 0;
                    }

                    const matchingItem = params.row.excel.find((item: IExcel) =>
                        item.userCloId === currentCloId
                    );

                    if (isOpenAlertForm) {
                        return (
                            <TextField
                                type="number"
                                size="small"
                                defaultValue={matchingItem ? matchingItem.score : 0}
                                onChange={(e) => handleScoreChange({
                                    rowId: params.row.id,
                                    excelId: matchingItem?.id,
                                    userCloId: currentCloId,
                                    newScore: parseFloat(e.target.value)
                                })}
                                inputProps={{
                                    step: "0.1",
                                    min: "0"
                                }}
                            />
                        );
                    }

                    return matchingItem ? matchingItem.score : 0;
                }
            })
        ) : null
    );

    const mergeColumnClo = [...column, ...colClo];
    const mergeColumnEdit = [...columnEdit, ...colCloEdit];

    const filteredRows = rows.filter((row) => {
        if (!searchText) return true;

        if (["fullName"].includes(searchType)) {
            const value = row[searchType as keyof typeof row];
            return value?.toString().toLowerCase().includes(searchText.toLowerCase());
        }

        if (searchType.startsWith("CLO")) {
            const cloId = cols.find(col => col.cloName === searchType)?.id;

            if (!cloId || !row.excel) return false;

            const matchingItem = row.excel.find(item => item.userCloId === cloId);

            if (matchingItem) {
                return matchingItem?.score?.toString().includes(searchText);
            }
            return false;
        }

        return false;
    });

    const findSubName = subjectsData?.data?.find((item: ISubjects) => item.id === paramsSubId)?.subNameTh;
    const titleSubName = findSubName ? `${findSubName}` : "404 not found";

    const handleNavigationEditPush = (data: IUserExcel) => {
        setRowsSelectedModal([data]);
        setIsOpenAlertForm(true);
    }

    const handleUpdateData = async () => {
        setIsOpenAlertForm(false);

        try {
            const scoreUpdatePromises: Promise<IResponse<IExcel>>[] = [];
            const nameUpdatePromises: Promise<IResponse<IUserExcel>>[] = [];

            rowsSelectedModal.forEach((row) => {

                if (row.excel && Array.isArray(row.excel)) {
                    row.excel.forEach((excelItem) => {
                        const updatedScore = excelItem.score;
                        scoreUpdatePromises.push(
                            uploadExcelScore({
                                id: excelItem.id,
                                score: updatedScore
                            })
                        );
                    });
                }

                if (nameChanges[row.id!]) {
                    nameUpdatePromises.push(
                        uploadExcelName({
                            id: row.id,
                            fullName: nameChanges[row.id!],
                            updatedDate: new Date(),
                            updatedBy: user?.name
                        })
                    );
                }
            });

            const scoreResults = await Promise.all(scoreUpdatePromises);
            const nameResults = await Promise.all(nameUpdatePromises);

            const allScoreUpdatesSuccessful = scoreResults.every((result) => result.success === true);
            const allNameUpdatesSuccessful = nameResults.every((result) => result.success === true);

            if (allScoreUpdatesSuccessful && allNameUpdatesSuccessful) {

                const updatedRows = rows.map((row) => {

                    const updatedRow = rowsSelectedModal.find(selectedRow => selectedRow.id === row.id);

                    if (updatedRow) {
                        return {
                            ...row,
                            fullName: updatedRow.fullName,
                            excel: updatedRow.excel ? updatedRow.excel : row.excel
                        };
                    }
                    return row;
                });

                setRows(updatedRows);
                setRowsSelectedModal([]);
                setNameChanges({});
                setKey(key + 1);

                setTextAlertBox("อัพเดทข้อมูลสําเร็จ");
                setTypeAlertBox("success");
                setIsOpenAlertBox(true);
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                }, 1500);
            } else {
                setTextAlertBox("ได้เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
                setTypeAlertBox("error");
                setIsOpenAlertBox(true);
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                }, 1500);
            }
        } catch (error) {
            setTextAlertBox("Api error");
            setTypeAlertBox("error");
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);
        }
    }

    if (isCheckingAccess || isLoadingUserData) {
        return <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>;
    }

    if (!hasAccess) {
        return <AccessDeniedPage />;
    }

    return (
        <>
            <PageContentLayout
                title={`ประเมินรายวิชา ${titleSubName}`}
                icon={<MenuBookIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="Action"
                            icon={<ExpandMoreIcon />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            disabled={filteredRows.length === 0}
                        />
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            className='this-menu'
                            disableAutoFocus
                            sx={{
                                "& .MuiMenu-list": { paddingY: '0px', backgroundColor: "#FFF" },
                            }}
                        >
                            <MenuItem sx={{ width: '150px', backgroundColor: "#FFF" }} onClick={handleConfirmDelete}>ลบข้อมูล</MenuItem>
                        </Menu>
                        <ActionBtn
                            title="Upload Excel"
                            icon={<FileUploadIcon />}
                            color='#3FA26E'
                            onClick={() => handleUploadExcel()}
                        />
                    </>
                }
            >
                <TableWithSearch
                    idKey='id'
                    key={key}
                    columns={mergeColumnClo as GridColDef[]}
                    rows={filteredRows}
                    onViewRow={(rowSelected) => handleNavigationEditPush(rowSelected)}
                    searchType={searchType as string}
                    onSearchTypeChange={(newSearchType) => setSearchType(newSearchType)}
                    searchText={searchText}
                    onSearchTextChange={(newSearchText) => setSearchText(newSearchText)}
                    onSearchTextClear={handleSearchTextClear}
                    onSelectRows={(rowsSelected) => handleSelectRows(rowsSelected)}
                    yearValue={yearValue}
                    onYearChange={(newYear) => setYearValue(newYear)}
                    yearOptions={yearOptions}
                    semesterValue={semesterValue}
                    onSemesterChange={(newSemester) => setSemesterValue(newSemester)}
                    semesterOptions={semesterOptions}
                    pageSizeOptions={[10, 20]}
                    initialPageSize={10}
                    isOrganize={false}
                    isMultiSelectRow
                />

                <Alert
                    text={textAlertBox}
                    type={typeAlertBox}
                    isOpen={isOpenAlertBox}
                    setIsOpen={setIsOpenAlertBox}
                />

                <AlertConfirm
                    isOpen={isOpenConfirmModalAlert}
                    setIsOpen={setIsOpenConfirmModalAlert}
                    onConfirm={() => handleDelete(rowsSelected)}
                    description="ลบรายชื่อนักศึกษาที่เลือก"
                    title="แน่ใจหรือไม่?"
                />

                <ModalForm
                    isOpen={isOpenAlertForm}
                    setIsOpen={setIsOpenAlertForm}
                    handleSaveAllChanges={handleUpdateData}
                    headTitle={`ประเมินรายวิชา ${titleSubName}`}
                    titleSubName={""}
                    yearSemesterDisplay={""}
                >
                    <Table2
                        idKey='id'
                        key={key}
                        columns={mergeColumnEdit as GridColDef[]}
                        rows={rowsSelectedModal}
                        onViewRow={(rowSelected) => null}
                        onSelectRows={(rowsSelected) => handleSelectRows(rowsSelected)}
                        showViewButton={false}
                        isOrganize={false}
                        showCheckboxColumn={false}
                    />
                </ModalForm>

            </PageContentLayout>
        </>
    )
}