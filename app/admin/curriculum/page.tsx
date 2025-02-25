"use client";
import Image from 'next/image'
import { SetStateAction, use, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { IUser } from '#/types/IResponse/IResponse';
import useDeleteUser from '#/hooks/useDeleteUser';
import { Button, Chip, Grid, Menu, MenuItem, Stack, Typography } from '@mui/material';
import useUpdateUser from '#/hooks/useUpdateUser';
import { set, SubmitHandler, useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Table, { createColumn } from '#/components/table/Table';
import TableWithSearch from '#/components/table/TableWithSearch';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import { hash, hashSync } from 'bcryptjs';
import { useRouter } from 'next/navigation';
import { ICurriculum, ISubjects } from '#/types/LTS/ILts';
import useDeleteSubjects from '#/hooks/useDeleteSubjects';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import useDeleteCurruculum from '#/hooks/useDeleteCurruculum';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

export default function Home() {
    const [rows, setRows] = useState<ISubjects[]>([]);
    const [rowsSelected, setRowsSelected] = useState<ISubjects[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>("curriculumCode");
    const [pagination, setPagination] = useState({ pageSize: 5, page: 0 });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const { mutateAsync: deleteCurrriculum, isLoading: isLoadingDeleteCurrriculum } = useDeleteCurruculum();
    const router = useRouter();
    const [key, setKey] = useState(0);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    const handleDelete = async (rowsSelected: ISubjects[]) => {
        try {
            const ids = rowsSelected.map((row: ISubjects) => row.id).join(',');
            const res = await deleteCurrriculum({ ids });

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
        router.push(`/admin/curriculum/createCurriculum`);
    };

    const handleNavigationEdit = (data: ICurriculum) => {
        sessionStorage.setItem('subjectData', JSON.stringify(data));
        const pathname = encodeURIComponent(data?.degreeFullEn!)
        router.push(`/admin/curriculum/${pathname}`);
    }

    const column: GridColDef[] = [
        createColumn("curriculumCode", "STRING", "รหัสหลักสูตร", 150, {
            headerAlign: "center",
            align: "center",
            sortable: true
        }),
        createColumn("nameTh", "STRING", "ชื่อหลักสูตร (ภาษาไทย)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("nameEn", "STRING", "ชื่อหลักสูตร (ภาษาอังกฤษ)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("degreeFullTh", "STRING", "ชื่อปริญญาเต็ม (ภาษาไทย)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("degreeShortTh", "STRING", "ชื่อปริญญาย่อ (ภาษาไทย)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("degreeFullEn", "STRING", "ชื่อปริญญาเต็ม (ภาษาอังกฤษ)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("degreeShortEn", "STRING", "ชื่อปริญญาย่อ (ภาษาอังกฤษ)", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("major", "STRING", "วิชาเอก", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("totalCredits", "STRING", "จำนวนหน่วยกิตตลอดหลักสูตร", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("programType", "STRING", "5.1 รูปแบบของหลักสูตร", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("degreeCategory", "STRING", "5.2 ประเภทของหลักสูตร", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("language", "STRING", "5.3 ภาษาที่ใช้ในหลักสูตร", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("acceptance", "STRING", "5.4 การรับเข้าศึกษา", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("integration", "STRING", "5.5 การบูรณาการหลักสูตร", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("collaboration", "STRING", "5.6 ความร่วมมือกับสถาบันอื่น", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("degreeGranted", "STRING", "5.7 การให้ปริญญาแก่ผู้สำเร็จการศึกษา", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("approvalCurriculum", "STRING", "หลักสูตรใหม่", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("previousCurriculum", "STRING", "หลักสูตรปรับปรุง", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("qualityAssurance", "STRING", "ความพร้อมในการเผยแพร่หลักสูตรคุณภาพและมาตรฐาน", 250, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("career", "STRING", "อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา", 250, {
            headerAlign: "center",
            align: "center",
        }),
    ]

    useEffect(() => {
        if (curriculumData?.data) {
            const transformedData = curriculumData?.data.map((item) => ({
                id: item.id,
                ...item
            }))
            setRows(transformedData)
        }
    }, [curriculumData])

    const filteredRows = rows.filter((row) => {
        if (!searchText) return true;

        const value = row[searchType as keyof typeof row];
        return value?.toString().toLowerCase().includes(searchText.toLowerCase());
    });

    const handleSelectRows = (rowSelected: ISubjects[]) => {
        setRowsSelected(rowSelected);
    };

    return (
        <>
            <PageContentLayout
                title="หลักสูตรรายวิชา"
                icon={<LibraryBooksIcon />}
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
                            title="สร้างหลักสูตร"
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
                    onSelectRows={(rowsSelected) => handleSelectRows(rowsSelected)}
                    pagination={pagination}
                    setPagination={setPagination}
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