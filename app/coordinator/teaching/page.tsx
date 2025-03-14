"use client";
import { useEffect, useRef, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Menu, MenuItem, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Table, { createColumn } from '#/components/table/Table';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ISubjects, IUserClo, IUserPlo } from '#/types/LTS/ILts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import useGetAllUserClo from '#/hooks/useGetAllUserClo';
import { IClo, IPlo } from '#/types/LTS/IPlo';
import useUpdatePloChecked from '#/hooks/useUpdatePloChecked';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Table2 from '#/components/table/Table2';
import ModalForm from '#/components/modal/ModalForm';
import useDeleteUserClo from '#/hooks/useDeleteUserClo';
import useGetExcel from '#/hooks/useGetExcel';
import TableWithSearchNoCheck from '#/components/table/TableWithSearchNoCheck';
import { useSession } from 'next-auth/react';
import useUpdateNewUserClo from '#/hooks/useUpdateNewUserClo';
import useGetAllCloList from '#/hooks/useGetAllCloList';
import useCreateUserCloWithPloUpdate from '#/hooks/useCreateUserCloWithPloUpdate';
import CheckIcon from '@mui/icons-material/Check';
import useGetAllUsers from '#/hooks/useGetAllUsers';

export default function Page() {
    const [rows, setRows] = useState<IUserClo[]>([]);
    const [modalRows, setModalRows] = useState<IUserClo[]>([]); // สร้าง state แยกสำหรับ modal
    const [rowsSelected, setRowsSelected] = useState<IUserClo[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>("cloName");
    const [yearValue, setYearValue] = useState<string>("");
    const [yearOptions, setYearOptions] = useState<{ value: string, name: string }[]>([]);
    const [semesterValue, setSemesterValue] = useState<string>("1");
    const [pagination, setPagination] = useState({ pageSize: 10, page: 0 });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { data: userClo, isLoading: isLoadingUserClo } = useGetAllUserClo();
    const { mutateAsync: getExcel, isLoading: isLoadingGetExcel } = useGetExcel();
    const { mutateAsync: deleteUserClo, isLoading: isLoadingDeleteUserClo } = useDeleteUserClo();
    const { mutateAsync: updatePloChecked, isLoading: isLoadingUpdatePloChecked } = useUpdatePloChecked();
    const { mutateAsync: createUserCloWithPloUpdate, isLoading: isLoadingCreateUserCloWithPloUpdate } = useCreateUserCloWithPloUpdate();
    const { mutateAsync: updateNewUserClo, isLoading: isLoadingUpdateNewUserClo } = useUpdateNewUserClo();
    const { data: userCloList, isLoading: isLoadingUserCloList } = useGetAllCloList();
    const [pendingChanges, setPendingChanges] = useState<{
        cloId: string | number | null | undefined;
        plos: IUserPlo[];
    }[]>([]);
    const session = useSession();
    const user = session.data?.user;
    const router = useRouter();
    const [key, setKey] = useState(0);
    const pathname = usePathname();
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

    let currentPath = "/instructor";
    if (pathname.startsWith("/admin")) {
        currentPath = "/admin";
    } else if (pathname.startsWith("/coordinator")) {
        currentPath = "/coordinator";
    }
    
    // เปลี่ยนนิยาม state
    const [semesterOptions, setSemesterOptions] = useState<{ value: string, name: string, hasData?: boolean }[]>([
        { value: "1", name: "ภาคการศึกษาที่ 1", hasData: false },
        { value: "2", name: "ภาคการศึกษาที่ 2", hasData: false },
        { value: "3", name: "ภาคฤดูร้อน", hasData: false }
    ]);

    const isUserSelected = useRef(false); // ตรวจสอบว่าผู้ใช้เลือกเองหรือไม่

    useEffect(() => {
        if (userClo?.data && yearValue) {
            const yearFilteredData = userClo.data.filter((item: IUserClo) =>
                item.subId === paramsSubId &&
                item.curriculumId === paramsCurId &&
                item.year === yearValue
            );

            // เก็บภาคการศึกษาที่มีข้อมูลอยู่
            const existingSemesters = new Set(
                yearFilteredData.map((item: IUserClo) => item.semester?.toString())
            );

            // คำนวณภาคที่มีข้อมูลล่าสุด (ค่ามากสุด)
            const latestSemester = Math.max(
                ...yearFilteredData.map((item) => Number(item.semester || "0")),
                0
            ).toString();

            // สร้างตัวเลือกสำหรับทั้ง 3 ภาคการศึกษาเสมอ
            const allSemesters = [
                { value: "1", name: "ภาคการศึกษาที่ 1", hasData: existingSemesters.has("1") },
                { value: "2", name: "ภาคการศึกษาที่ 2", hasData: existingSemesters.has("2") },
                { value: "3", name: "ภาคฤดูร้อน", hasData: existingSemesters.has("3") }
            ];

            setSemesterOptions(allSemesters);

            // ถ้าไม่มีข้อมูล หรือยังไม่เคยเลือกภาค ให้ใช้ภาคล่าสุด
            if (!isUserSelected.current) {
                if (latestSemester !== "0") {
                    setSemesterValue(latestSemester);
                }
            }
        } else {
            // กรณีไม่มีข้อมูลปี ให้แสดงทั้ง 3 ภาคเป็นค่าเริ่มต้น
            setSemesterOptions([
                { value: "1", name: "ภาคการศึกษาที่ 1", hasData: false },
                { value: "2", name: "ภาคการศึกษาที่ 2", hasData: false },
                { value: "3", name: "ภาคฤดูร้อน", hasData: false }
            ]);
        }
    }, [userClo?.data, yearValue, paramsSubId, paramsCurId]);

    useEffect(() => {
        if (userClo?.data) {
            const filteredData = userClo.data.filter((item: IUserClo) =>
                item.subId === paramsSubId &&
                item.curriculumId === paramsCurId
            );

            const uniqueYears = Array.from(new Set(
                filteredData.map((item: IUserClo) => item.year)
            )).filter(Boolean).sort();

            const options = uniqueYears.map(year => ({
                value: year as string,
                name: year as string
            }));

            setYearOptions(options);

            // ตรวจสอบว่า yearValue ยังอยู่ใน options หรือไม่
            const isYearStillValid = options.some(option => option.value === yearValue);

            if (options.length > 0 && !isYearStillValid) {
                const latestYear = options[options.length - 1].value;
                setYearValue(latestYear);
            }
        }
    }, [userClo?.data, paramsSubId, paramsCurId, yearValue]);

    useEffect(() => {
        if (userClo?.data && yearValue) {
            const parsedData = userClo?.data?.filter((item: IUserClo) =>
                item.subId === paramsSubId &&
                item.curriculumId === paramsCurId &&
                item.year === yearValue &&
                item.semester === Number(semesterValue)
            );

            setRows(parsedData);
        } else {
            setRows([]);
        }
    }, [paramsCurId, paramsSubId, userClo?.data, yearValue, semesterValue]);

    useEffect(() => {
        if (isOpenAlertForm) {
            const clonedRows = JSON.parse(JSON.stringify(rows));
            setModalRows(clonedRows);
        }
    }, [isOpenAlertForm, rows]);

    const handleDelete = async (data: IUserClo[]) => {
        try {
            const ids = data.map((row: IUserClo) => row.id).join(',');
            const res = await deleteUserClo({ ids });

            if (res.success === true) {
                setAnchorEl(null);
                setRowsSelected([]);
                setKey(key + 1);

                setTextAlertBox("Delete success");
                setTypeAlertBox("success");
                setIsOpenAlertBox(true);
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                }, 1500);
            } else {
                setTextAlertBox("Fail to delete");
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

    // ฟังก์ชันสำหรับการเปลี่ยนแปลง PLO ใน Modal
    const handleModalPloChange = (row: IUserClo, ploName: string) => {
        if (!row.plo) return;

        // อัพเดตเฉพาะใน modalRows
        setModalRows(prevRows => {
            return prevRows.map(r => {
                if (r.id === row.id) {
                    // ค้นหา PLO ที่ต้องการเปลี่ยน
                    const updatedPlos = r.plo?.map(plo => {
                        if (plo.ploName === ploName && plo.cloId === row.id) {
                            return { ...plo, selected: !plo.selected };
                        }
                        return plo;
                    }) || [];

                    return {
                        ...r,
                        plo: updatedPlos
                    };
                }
                return r;
            });
        });

        // เก็บข้อมูลที่เปลี่ยนแปลงใน pendingChanges
        setPendingChanges((prev) => {
            // ตรวจสอบว่ามีข้อมูลของ row นี้อยู่แล้วหรือไม่
            const existingIndex = prev.findIndex((item) => item.cloId === row.id);

            // หา plo ที่จะอัพเดต
            const updatedPlos = row.plo?.map(plo => {
                if (plo.ploName === ploName && plo.cloId === row.id) {
                    return { ...plo, selected: !plo.selected };
                }
                return plo;
            }) || [];

            if (existingIndex >= 0) {
                // ถ้ามีอยู่แล้ว ให้อัพเดต plos ในรายการนั้น
                const newChanges = [...prev];
                newChanges[existingIndex] = {
                    cloId: row.id,
                    plos: updatedPlos
                };
                return newChanges;
            } else {
                // ถ้ายังไม่มี ให้เพิ่มเข้าไปใหม่
                return [...prev, {
                    cloId: row.id,
                    plos: updatedPlos
                }];
            }
        });
    };

    const handleSaveAllChanges = async () => {
        setIsOpenAlertForm(false);
        if (pendingChanges.length === 0) {
            setTextAlertBox("ไม่มีข้อมูลที่ต้องบันทึก");
            setTypeAlertBox("warning");
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);
            return;
        }

        try {
            // บันทึกทีละรายการ
            const results = await Promise.all(
                pendingChanges.map(change =>
                    updatePloChecked({
                        cloId: Number(change.cloId),
                        plos: change.plos
                    })
                )
            );

            // ตรวจสอบผลลัพธ์
            const allSuccess = results.every(res => res.success);

            if (allSuccess) {
                // อัพเดท rows หลักด้วยข้อมูลจาก modalRows เมื่อบันทึกสำเร็จ
                setRows(modalRows);

                // ล้าง pendingChanges เมื่อบันทึกสำเร็จทั้งหมด
                setPendingChanges([]);

                setTextAlertBox("บันทึกข้อมูลทั้งหมดสำเร็จ");
                setTypeAlertBox("success");
            } else {
                setTextAlertBox("บันทึกข้อมูลไม่สำเร็จบางรายการ โปรดลองอีกครั้ง");
                setTypeAlertBox("warning");
            }
        } catch (error) {
            console.error("Error saving all PLO data:", error);
            setTextAlertBox("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            setTypeAlertBox("error");
        } finally {
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);
        }
    };

    const handleNavigationCreate = () => {
        router.push(`/${currentPath}/teaching/createTeaching?sub=${subId}&cur=${curId}`);
    };

    const handleNavigationEditPush = () => {
        setAnchorEl(null);
        const semesterEncode = encode(semesterValue)
        const yearEncode = encode(yearValue)
        router.push(`/${currentPath}/teaching/editTeaching?sub=${subId}&cur=${curId}&sem=${semesterEncode}&year=${yearEncode}`);
    }

    const handleExportExcel = async (data: IUserClo[]) => {
        const result = {
            subName: titleSubName,
            userId: data[0].userId,
            subId: data[0].subId,
            semester: data[0].semester,
            year: data[0].year
        }
        await getExcel(result);
    }

    const handleSearchTextClear = () => {
        setSearchText('');
    };

    const handleSelectRows = (rowSelected: IUserClo[]) => {
        setRowsSelected(rowSelected);
    };

    const column: GridColDef[] = [
        createColumn("cloName", "STRING", "CLO", 400, {
            headerAlign: "center",
            align: "left",
            renderCell(params) {
                const cloNames = params.row?.clo?.map((item: IClo) => item.cloName + " " + item.cloDesc).map((item: string) => item);
                return (
                    <span>
                        {cloNames}
                    </span>
                );
            },
        }),
    ];

    const columnPlosForModal = Array.from(new Set(rows.flatMap(item => item.plo?.map((plo: any) => plo.ploName) || []))
    ).map(ploName => createColumn(ploName, "STRING", ploName, 150, {
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
            const isPloSelected = params.row?.plo?.some((plo: IUserPlo) =>
                plo.ploName === ploName && plo.cloId === params.row.id && plo.selected
            );

            return (
                <Checkbox
                    checked={isPloSelected || false}
                    onChange={() => handleModalPloChange(params.row, ploName)}
                    color="primary"
                />
            );
        },
    }));

    const columnPlosForMainTable = Array.from(
        new Set(rows.flatMap(item => item.plo?.map((plo: any) => plo.ploName) || []))
    ).map(ploName => createColumn(ploName, "STRING", ploName, 150, {
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
            const isPloSelected = params.row?.plo?.some((plo: IUserPlo) =>
                plo.ploName === ploName && plo.cloId === params.row.id && plo.selected
            );

            return (
                <>
                    <span>{isPloSelected ? <CheckIcon /> : `-`}</span>
                </>
            );
        },
    }));

    const mergeColumnEdit = [...column, ...columnPlosForModal];
    const mergeColumnShow = [...column, ...columnPlosForMainTable];

    const ExSearch = columnPlosForMainTable.map((item) => item.field);

    const extraSearchConfig = ExSearch.map((field) => ({
        field: field as keyof IUserPlo,
        option: [
            { value: "true", name: '✔' },
            { value: "false", name: '-' }
        ]
    }));

    const filteredRows = rows.filter((row) => {
        if (!searchText) return true;

        if (searchType === "cloName") {

            return row.clo?.some((clo: IClo) =>
                (clo.cloName + " " + clo.cloDesc).toLowerCase().includes(searchText.toLowerCase())
            ) || false;

        } else if (ExSearch.includes(searchType)) {

            const isChecked = searchText.toLowerCase() === "true";
            return row.plo?.some((plo: any) =>
                plo.ploName === searchType && plo.cloId === row.id && plo.selected === isChecked
            ) || false;
        }

        const value = row[searchType as keyof typeof row];
        if (!value) return false;

        return value.toString().toLowerCase().includes(searchText.toLowerCase());
    });

    const nowClo = userCloList?.data?.filter((item: any) => item.curriculumId === paramsCurId && item.subId === paramsSubId);

    const filteredNowClo = nowClo?.filter(
        (cloItem) => !filteredRows.some((row) =>
            row.clo?.some((filteredClo: any) => filteredClo.cloId === cloItem.id)
        )
    );

    const filteredNowPloIds = filteredRows.map((row) =>
        row.plo?.map((p: any) => p.ploId) || []
    )[0] || [];

    const filteredPastClo = nowClo?.filter(
        (cloItem) => filteredRows.some((row) =>
            row.clo?.every((filteredClo: any) => filteredClo.cloId !== cloItem.id)
        )
    );

    const missingRows = filteredRows.filter(row =>
        row.clo?.some((filteredClo: IPlo) =>
            !filteredPastClo?.some(cloItem => cloItem.id === filteredClo.cloId)
        )
    );

    const handleUpdateNewClo = async (data: IUserClo[]) => {
        try {

            const updatedCloIds: number[] = [];

            rows.forEach(clo => {
                if (clo.id) {
                    updatedCloIds.push(clo.id);
                }
            });

            const resUpdate: any = updatedCloIds.map((id, index) => ({
                id: id,
                userId: user?.id,
                curriculumId: paramsCurId,
                subId: paramsSubId,
                semester: data[index].semester,
                year: data[index].year,
                updatedBy: user?.name,
                updatedDate: new Date(),
            }));

            await updateNewUserClo(resUpdate);

            const resCreate = {
                ploIds: filteredNowPloIds,
                cloIds: filteredNowClo?.map((plo) => plo.id),
                userId: user?.id,
                subId: paramsSubId,
                curriculumId: paramsCurId,
                semester: data[0].semester,
                year: data[0].year,
                createdDate: new Date(),
                createdBy: user?.name
            }

            await createUserCloWithPloUpdate(resCreate);

            if (missingRows?.length > 0) {
                const ids = missingRows?.map((data) => data.id).join(',');
                await deleteUserClo({ ids });
            }

            setAnchorEl(null);
            setTypeAlertBox("success");
            setTextAlertBox("แก้ไขข้อมูลสำเร็จ");
            setIsOpenAlertBox(true);

            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);

        } catch (error) {
            setTypeAlertBox("warning");
            setTextAlertBox(error as string);
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500);
        }
    }

    const filteredModalRows = modalRows;

    const findSubName = subjectsData?.data?.find((item: ISubjects) => item.id === paramsSubId)?.subNameTh;
    const titleSubName = findSubName ? `${findSubName}` : "404 not found";

    const yearSemesterDisplay = yearValue && semesterValue
        ? `ปี ${yearValue} ภาคการศึกษาที่ ${semesterValue}`
        : "";

    useEffect(() => {
        setSearchType("cloName");
    }, [searchParams]);

    return (
        <>
            <PageContentLayout
                title={titleSubName}
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
                            <MenuItem sx={{ width: '150px', backgroundColor: "#FFF" }} onClick={() => handleDelete(filteredRows)}>ลบข้อมูลทั้งหมด</MenuItem>
                            <MenuItem sx={{ width: '150px', backgroundColor: "#FFF" }} onClick={handleNavigationEditPush}>แก้ไข PLO</MenuItem>
                            <MenuItem sx={{ width: '150px', backgroundColor: "#FFF" }} onClick={() => handleUpdateNewClo(filteredRows)}>อัพเดต CLO</MenuItem>
                        </Menu>
                        <ActionBtn
                            title="Export Excel"
                            icon={<FileDownloadIcon />}
                            color='#3FA26E'
                            onClick={() => handleExportExcel(filteredRows)}
                            disabled={filteredRows.length === 0}
                        />
                        <ActionBtn
                            title="Checked"
                            icon={<AddIcon />}
                            onClick={() => setIsOpenAlertForm(true)}
                        />
                        <ActionBtn
                            title="สร้าง PLO"
                            icon={<AddIcon />}
                            onClick={handleNavigationCreate}
                        />
                    </>
                }
            >
                <TableWithSearchNoCheck
                    idKey='id'
                    key={key}
                    columns={mergeColumnShow as GridColDef[]}
                    rows={filteredRows}
                    onViewRow={(rowSelected) => handleNavigationEditPush()}
                    searchType={searchType as string}
                    onSearchTypeChange={(newSearchType) => setSearchType(newSearchType)}
                    searchText={searchText}
                    onSearchTextChange={(newSearchText) => setSearchText(newSearchText)}
                    onSearchTextClear={handleSearchTextClear}
                    onSelectRows={(rowsSelected) => handleSelectRows(rowsSelected)}
                    extraSearchConfig={extraSearchConfig}
                    yearValue={yearValue}
                    onYearChange={(newYear) => setYearValue(newYear)}
                    yearOptions={yearOptions}
                    semesterValue={semesterValue}
                    onSemesterChange={(newSemester) => setSemesterValue(newSemester)}
                    semesterOptions={semesterOptions}
                    showViewButton={false}
                    showCheckboxColumn={false}
                    pageSizeOptions={[10, 20]}
                    initialPageSize={10}
                    isMultiSelectRow
                />

                <Alert
                    text={textAlertBox}
                    type={typeAlertBox}
                    isOpen={isOpenAlertBox}
                    setIsOpen={setIsOpenAlertBox}
                />

                <ModalForm
                    isOpen={isOpenAlertForm}
                    setIsOpen={setIsOpenAlertForm}
                    handleSaveAllChanges={handleSaveAllChanges}
                    headTitle={"ความสัมพันธ์ระหว่าง CLO และ PLO"}
                    titleSubName={titleSubName}
                    yearSemesterDisplay={yearSemesterDisplay}
                >
                    <Table2
                        idKey='id'
                        key={key}
                        columns={mergeColumnEdit as GridColDef[]}
                        rows={filteredModalRows}
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