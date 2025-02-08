"use client";
import Image from 'next/image'
import { SetStateAction, use, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { IUser } from '#/types/IResponse/IResponse';
import useDeleteUser from '#/hooks/useDeleteUser';
import { Button, Grid, Menu, MenuItem, Stack, Typography } from '@mui/material';
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
import { ISubjects } from '#/types/LTS/ILts';
import useDeleteSubjects from '#/hooks/useDeleteSubjects';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export default function Home() {
    const [rows, setRows] = useState<ISubjects[]>([]);
    const [rowsSelected, setRowsSelected] = useState<ISubjects[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>("subId");
    const [pagination, setPagination] = useState({ pageSize: 5, page: 0 });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { mutateAsync: deleteSubjects, isLoading: isLoadingDeleteSubjects } = useDeleteSubjects();
    const [alertOpen, setAlertOpen] = useState(false);
    const [addValueOpen, setAddValueOpen] = useState(false);
    const [editValueOpen, setEditValueOpen] = useState(false);
    const [detailPloOpen, setDetailPloOpen] = useState(false);
    const router = useRouter();
    const [key, setKey] = useState(0);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

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

    const handleDetailPLO = async (data: any) => {
        // setDetailPlo(data);
        setDetailPloOpen(true);
    }

    // const handleSubmit: SubmitHandler<IUser> = async (data: IUser) => {
    //   // console.log("Create button clicked! 1", data);
    //   try {
    //     const createUserData = {
    //       username: data.username,
    //       email: data.email
    //     }
    //     // console.log("Create user data 2:", createUserData);
    //     await createUser(createUserData);
    //   } catch (error) {
    //     console.error("Error creating user:", error);
    //   }
    // }

    // const handleSubmitEdit: SubmitHandler<IUser> = async (data: IUser) => {
    //     // console.log("Update button clicked! 1", data);
    //     try {
    //         const updateUserData = {
    //             ...data
    //         }
    //         // console.log("Update user data 2:", updateUserData);
    //         await updateUser(updateUserData);
    //     } catch (error) {
    //         console.error("Error creating user:", error);
    //     }
    // }

    const handleNavigationCreate = () => {
        router.push(`/admin/subjects/createSubject`);
    };

    const handleNavigationEdit = (data: ISubjects) => {
        sessionStorage.setItem('subjectData', JSON.stringify(data));
        const pathname = encodeURIComponent(data?.subNameTh!)
        router.push(`/admin/subjects/${pathname}`);
    }

    const column: GridColDef[] = [
        createColumn("subId", "STRING", "รหัสวิชา", 150, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subNameTh", "STRING", "ชื่อวิชา (ภาษาไทย)", 150, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subNameEn", "STRING", "ชื่อวิชา (ภาษาอังกฤษ)", 150, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subClo", "STRING", "สมรรถนะรายวิชา", 150, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subDescTh", "STRING", "คำอธิบายรายวิชา (ภาษาไทย)", 150, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subDescEn", "STRING", "คำอธิบายรายวิชา (ภาษาอังกฤษ)", 150, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subStatus", "STRING", "สถานะ", 150, {
            headerAlign: "center",
            align: "center",
        }),
    ]

    useEffect(() => {
        if (subjectsData?.data) {
            const transformedData = subjectsData?.data.map((item) => ({
                id: item.id,
                ...item
            }))
            setRows(transformedData)
        }
    }, [subjectsData])

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
                title="Subjects"
                icon={<AccountBoxIcon />}
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
                            <MenuItem sx={{ width: '100px', backgroundColor: "#FFF" }} onClick={() => handleDelete(rowsSelected)}>Delete</MenuItem>
                        </Menu>
                        <ActionBtn
                            title="Create Subject"
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

                {/* <CreateUserModal
                    isOpen={addValueOpen}
                    setIsOpen={setAddValueOpen}
                    hook={hookform}
                    handleSubmit={handleSubmit}
                    title="Create User"
                />

                <EditUserModal
                    isOpen={editValueOpen}
                    setIsOpen={setEditValueOpen}
                    hook={hookformEdit}
                    title="Edit User"
                    handleSubmitEdit={handleSubmitEdit}
                    plo={editRows}
                    ploColumn={ploColumns}
                /> */}

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