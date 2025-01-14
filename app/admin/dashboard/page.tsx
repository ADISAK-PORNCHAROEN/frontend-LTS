"use client";
import Image from 'next/image'
import { SetStateAction, use, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { IUser } from '#/types/IResponse/IResponse';
import useDeleteUser from '#/hooks/useDeleteUser';
import { Button, Grid, Menu, MenuItem, Stack, Typography } from '@mui/material';
import useUpdateUser from '#/hooks/useUpdateUser';
import useCreateUser from '#/hooks/useCreateUser';
import CreateUserModal from '#/components/CreateUserModal';
import { set, SubmitHandler, useForm } from 'react-hook-form';
import EditUserModal from '#/components/EditUserModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Table, { createColumn } from '#/components/table/Table';
import TableProject from '#/components/table/TableProject';
import TableWithSearch from '#/components/table/TableWithSearch';
import ActionBtn from '#/components/button/ActionBtn';
import DetailPLO from '#/components/DetailPLOModal';
import DetailPLOModal from '#/components/DetailPLOModal';
import { IClo, IPlo, IPloClo, IPloRows } from '#/types/LTS/IPlo';
import PageContentLayout from '#/components/layout/PageContentLayout';
import useGetAllPloRows from '#/hooks/useGetAllPloRows';
import useGetAllPlo from '#/hooks/useGetAllPlo';
import useGetAllClo from '#/hooks/useGetAllClo';
import { signOut } from 'next-auth/react';
import Alert from '#/components/modal/Alert';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function Home() {
    const [rows, setRows] = useState<IUser[]>([]);
    const [rowsSelected, setRowsSelected] = useState<[]>([]);
    const [ploColumns, setPloColumns] = useState<IPlo[]>([]);
    const [ploRows, setPloRows] = useState<IPloRows[]>([]);
    const [cloRows, setCloRows] = useState<IClo[]>([]);
    // const [editRows, setEditRows] = useState<IUser>({});
    const [detailPlo, setDetailPlo] = useState<IPlo>({});
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<keyof (IClo & IPloRows)>("cloDesc");
    const { data: ploData, isLoading: isLoadingploData } = useGetAllPlo();
    const { data: cloData, isLoading: isLoadingcloData } = useGetAllClo();
    const { data: ploRowsData, isLoading: isLoadingPloRowsData } = useGetAllPloRows();
    // const { data: userData, isLoading: isLoadinguserData } = useGetAllUsers();
    const { mutateAsync: deleteUser, isLoading: isLoadingDeleteUser } = useDeleteUser();
    const { mutateAsync: updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();
    const { mutateAsync: createUser, isLoading: isLoadingCreateUser } = useCreateUser();
    const [alertOpen, setAlertOpen] = useState(false);
    const [addValueOpen, setAddValueOpen] = useState(false);
    const [editValueOpen, setEditValueOpen] = useState(false);
    const [detailPloOpen, setDetailPloOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    // const handleDelete = async (id: number) => {
    //   try {
    //     await deleteUser({ id });
    //   } catch (error) {
    //     console.error("Error deleting user:", error);
    //   }
    // }

    // const handleUpdate = async (data: IPlo) => {
    //   console.log("Update button clicked! 1", data);
    //   setEditRows(data);
    //   setEditValueOpen(true);
    // }

    const handleDetailPLO = async (data: any) => {
        setDetailPlo(data);
        setDetailPloOpen(true);
    }

    // const hookform = useForm<IUser>({
    //   defaultValues: {
    //     id: Number(0),
    //     username: '',
    //     email: ''
    //   },
    // });

    // const hookformEdit = useForm<IUser>({
    //   defaultValues: {
    //     id: Number(0),
    //     username: '',
    //     email: ''
    //   },
    // });

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

    const handleSubmitEdit: SubmitHandler<IUser> = async (data: IUser) => {
        // console.log("Update button clicked! 1", data);
        try {
            const updateUserData = {
                ...data
            }
            // console.log("Update user data 2:", updateUserData);
            await updateUser(updateUserData);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    useEffect(() => {
        if (cloData && Array.isArray(cloData)) {
            const transformedData = cloData.map((clo) => ({
                id: clo.id,
                cloDesc: clo.cloDesc
            }))
            setCloRows(transformedData)
        }
    }, [cloData])

    useEffect(() => {
        if (ploData && Array.isArray(ploData)) {
            const transformedData = ploData.map((plo: IPlo) => ({
                id: plo.id,
                ploName: plo.ploName,
                ploDesc: plo.ploDesc,
                ploStatus: plo.ploStatus
            }))
            setPloColumns(transformedData);
        }
    }, [ploData]);

    useEffect(() => {
        if (ploRowsData && Array.isArray(ploRowsData)) {
            const transformedData = ploRowsData.map((plo) => ({
                id: plo.id,
                ...plo.ploData
            }))
            setPloRows(transformedData);
        }
    }, [ploRowsData]);

    const columnClo = createColumn("cloDesc", "STRING", "Clo", 200, {
        headerAlign: "center"
    })

    const column2 = ploColumns.map((item) => {
        return createColumn(`${item.ploName}`, 'STRING', item.ploName, 200, {
            headerAlign: 'center',
            renderHeader(params) {
                return (
                    <>
                        <Typography
                            className='cursor-pointer'
                            onClick={() => handleDetailPLO(item)}>
                            {params.colDef.headerName}
                        </Typography>
                    </>
                )
            },
        })
    })

    const mergedColumns = [columnClo, ...column2];

    const mergedRows = cloRows.map((cloRow) => ({
        ...cloRow,
        ...ploRows.find((ploRow) => ploRow.id === cloRow.id)
    }));

    const filteredRows = mergedRows.filter((row) => {
        if (!searchText) return true;

        const value = row[searchType as keyof typeof row];
        return value?.toString().toLowerCase().includes(searchText.toLowerCase());
    });

    const handleSelectRows = (rowSelected: any) => {
        setRowsSelected(rowSelected);
    };

    return (
        <>
            <PageContentLayout
                title="Dashboard"
                icon={<DashboardIcon />}
                actions={
                    <>
                        <ActionBtn
                            title="Action"
                            icon={<AddIcon />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            disabled={rowsSelected.length === 0}
                        />
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            className='this-menu'
                            sx={{
                                "& .MuiMenu-list": { paddingY: '0px', backgroundColor: "#FFF" },
                            }}
                        >
                            <MenuItem sx={{ width: '100px', backgroundColor: "#FFF" }} onClick={() => console.log("delete")}>Delete</MenuItem>
                        </Menu>
                    </>
                }
            >

                <TableWithSearch
                    idKey='id'
                    columns={mergedColumns}
                    rows={filteredRows}
                    onViewRow={(rowSelected) => console.log(rowSelected)}
                    searchType={searchType as string}
                    onSearchTypeChange={(newSearchType) => setSearchType(newSearchType)}
                    searchText={searchText}
                    onSearchTextChange={(newSearchText) => setSearchText(newSearchText)} // อัปเดต searchText เมื่อผู้ใช้เปลี่ยนค่า
                    onSelectRows={(rowsSelected) => handleSelectRows(rowsSelected)}
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
                />

                <DetailPLOModal
                    isOpen={detailPloOpen}
                    setIsOpen={setDetailPloOpen}
                    hook={hookformEdit}
                    title={detailPlo?.ploName || ""}
                    plo={detailPlo}
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