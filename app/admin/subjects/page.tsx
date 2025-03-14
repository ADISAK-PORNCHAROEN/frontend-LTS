"use client";
import { useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Menu, MenuItem, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Table, { createColumn } from '#/components/table/Table';
import TableWithSearch from '#/components/table/TableWithSearch';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import { useRouter } from 'next/navigation';
import { ISubjects } from '#/types/LTS/ILts';
import useDeleteSubjects from '#/hooks/useDeleteSubjects';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import { stat } from 'node:fs/promises';

export default function Home() {
    const [rows, setRows] = useState<ISubjects[]>([]);
    const [rowsSelected, setRowsSelected] = useState<ISubjects[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>("subId");
    const [pagination, setPagination] = useState({ pageSize: 10, page: 0 });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { mutateAsync: deleteSubjects, isLoading: isLoadingDeleteSubjects } = useDeleteSubjects();
    const [alertOpen, setAlertOpen] = useState(false);
    const [addValueOpen, setAddValueOpen] = useState(false);
    const [editValueOpen, setEditValueOpen] = useState(false);
    const [detailPloOpen, setDetailPloOpen] = useState(false);
    const router = useRouter();
    const [key, setKey] = useState(0);
    const { encode, decode } = useUrlSafeBase64();

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    const status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    const handleDelete = async (rowsSelected: ISubjects[]) => {
        try {
            const ids = rowsSelected.map((row: ISubjects) => row.id).join(',');
            const res = await deleteSubjects({ ids });

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

    const handleNavigationCreate = () => {
        router.push(`/admin/subjects/createSubject`);
    };

    const handleNavigationEdit = (data: ISubjects) => {
        const pathname = encodeURIComponent(data?.subNameEn!)
        const encodedId = encode((data?.id ?? '').toString());
        router.push(`/admin/subjects/${pathname}?id=${encodedId}`);
    }

    const column: GridColDef[] = [
        createColumn("subId", "STRING", "รหัสวิชา", 150, {
            headerAlign: "center",
            align: "center",
            sortable: true
        }),
        createColumn("subNameTh", "STRING", "ชื่อวิชา (ภาษาไทย)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subNameEn", "STRING", "ชื่อวิชา (ภาษาอังกฤษ)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subClo", "STRING", "สมรรถนะรายวิชา", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subDescTh", "STRING", "คำอธิบายรายวิชา (ภาษาไทย)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subDescEn", "STRING", "คำอธิบายรายวิชา (ภาษาอังกฤษ)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subStatus", "STRING", "สถานะ", 150, {
            headerAlign: "center",
            align: "center",
            sortable: true,
            renderCell(params) {
                return (
                    <Typography variant="body2" color={params.row?.subStatus === status.isActive ? 'success.main' : 'error.main'}>
                        {params.row?.subStatus === status.isActive ? `🟢 ${status.isActive}` : `🔴 ${status.isInactive}`}
                    </Typography>
                );
            },
        }),
    ]

    // Add new curriculum state
    const [curriculumValue, setCurriculumValue] = useState<string>('');
    const [curriculumOptions, setCurriculumOptions] = useState<{ value: string, name: string }[]>([]);

    useEffect(() => {
        if (subjectsData?.data) {
            const transformedData = subjectsData?.data.map((item) => ({
                id: item.id,
                ...item
            }))
            setRows(transformedData)

            // Extract unique curriculum options
            const curriculums = new Set<string>();
            const options: { value: string, name: string }[] = [];

            transformedData.forEach(item => {
                if (item.curriculum && item.curriculum.degreeShortTh) {
                    const currName = item.curriculum.degreeShortTh;
                    const currId = item.curriculum?.id?.toString() ?? '';
                    if (!curriculums.has(currId)) {
                        curriculums.add(currId);
                        options.push({
                            value: currId,
                            name: currName
                        });
                    }
                }
            });

            // Add an option for items with no curriculum
            options.unshift({
                value: '',
                name: 'ทั้งหมด'
            });

            setCurriculumOptions(options);
        }
    }, [subjectsData])

    const filteredRows = rows.filter((row) => {
        // กรณีพิเศษสำหรับการค้นหา Active/Inactive
        if (searchType === "subStatus" && searchText) {
            const searchLower = searchText.toLowerCase();

            // ถ้าค้นหาด้วย "active"
            if (searchLower.includes("active") && !searchLower.includes("inactive")) {
                return row.subStatus === status.isActive;
            }

            // ถ้าค้นหาด้วย "inactive"
            if (searchLower.includes("inactive")) {
                return row.subStatus === status.isInactive;
            }
        }

        // โลจิกการค้นหาปกติสำหรับกรณีอื่นๆ
        if (searchText) {
            const value = row[searchType as keyof typeof row];
            return value?.toString().toLowerCase().includes(searchText.toLowerCase()) ?? false;
        }

        // กรองตามหลักสูตร
        let curriculumMatch = true;
        if (curriculumValue) {
            if (!row.curriculum) {
                curriculumMatch = false;
            } else {
                curriculumMatch = row.curriculum?.id?.toString() === curriculumValue;
            }
        }

        return curriculumMatch;
    });

    const handleSelectRows = (rowSelected: ISubjects[]) => {
        setRowsSelected(rowSelected);
    };

    const handleSearchTextClear = () => {
        setSearchText('');
    };

    const handleCurriculumChange = (value: string) => {
        setCurriculumValue(value);
    };

    const extraSearchConfig = [
        {
            field: 'subStatus' as keyof ISubjects,
            option: [
                { value: status.isActive, name: '🟢 Active' },
                { value: status.isInactive, name: '🔴 Inactive' }
            ]
        }
    ];

    return (
        <>
            <PageContentLayout
                title="รายวิชา"
                icon={<MenuBookIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="Action"
                            icon={<ExpandMoreIcon />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            disabled={rowsSelected.length === 0}
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
                            <MenuItem sx={{ width: '100px', backgroundColor: "#FFF" }} onClick={() => handleDelete(rowsSelected)}>ลบข้อมูล</MenuItem>
                        </Menu>
                        <ActionBtn
                            title="สร้างรายวิชา"
                            icon={<AddIcon />}
                            onClick={handleNavigationCreate}
                        />
                    </>
                }
            >
                <TableWithSearch
                    idKey='id'
                    key={key}
                    columns={column}
                    rows={filteredRows}
                    onViewRow={(rowSelected) => handleNavigationEdit(rowSelected)}
                    searchType={searchType as string}
                    onSearchTypeChange={(newSearchType) => setSearchType(newSearchType)}
                    searchText={searchText}
                    onSearchTextChange={(newSearchText) => setSearchText(newSearchText)}
                    onSearchTextClear={handleSearchTextClear}
                    curriculumValue={curriculumValue}
                    onCurriculumChange={handleCurriculumChange}
                    curriculumOptions={curriculumOptions}
                    onSelectRows={(rowsSelected) => handleSelectRows(rowsSelected)}
                    extraSearchConfig={extraSearchConfig}
                    pagination={pagination}
                    setPagination={setPagination}
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
            </PageContentLayout>
        </>
    )
}