"use client";
import Image from 'next/image'
import { SetStateAction, use, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { IAccount, IUser } from '#/types/IResponse/IResponse';
import useDeleteUser from '#/hooks/useDeleteUser';
import { Button, Grid, Menu, MenuItem, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import Table, { createColumn } from '#/components/table/Table';
import TableWithSearch from '#/components/table/TableWithSearch';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useRouter } from 'next/navigation';
import AlertConfirm from '#/components/modal/AlertConfirm';
import PersonIcon from '@mui/icons-material/Person';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';

export default function Home() {
    const [rows, setRows] = useState<IUser[]>([]);
    const [rowsSelected, setRowsSelected] = useState<IUser[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>("name");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: userData, isLoading: isLoadinguserData } = useGetAllUsers();
    const { mutateAsync: deleteUser, isLoading: isLoadingDeleteUser } = useDeleteUser();
    const [alertOpen, setAlertOpen] = useState(false);
    const [addValueOpen, setAddValueOpen] = useState(false);
    const [editValueOpen, setEditValueOpen] = useState(false);
    const [detailPloOpen, setDetailPloOpen] = useState(false);
    const [key, setKey] = useState(0);
    const router = useRouter();
    const { encode, decode } = useUrlSafeBase64();

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

    const [isOpenConfirmModalAlert, setIsOpenConfirmModalAlert] = useState(false);

    const handleConfirmDelete = () => {
        setAnchorEl(null);
        setIsOpenConfirmModalAlert(true);
    }

    const handleDelete = async (rowsSelected: IUser[]) => {
        setIsOpenConfirmModalAlert(false);
        try {
            const ids = rowsSelected.map((row: IUser) => row.id).join(',');
            const res = await deleteUser({ ids });

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
                setTextAlertBox("Delete fail");
                setTypeAlertBox("warning");
                setIsOpenAlertBox(true);
                setTimeout(() => {
                    setIsOpenAlertBox(false);
                }, 1500)
            }
        } catch (error) {
            setTextAlertBox("Api error");
            setTypeAlertBox("error");
            setIsOpenAlertBox(true);
            setTimeout(() => {
                setIsOpenAlertBox(false);
            }, 1500)
        }
    }

    const handleNavigationEdit = (data: IUser) => {
        const pathname = encodeURIComponent(data?.name!);
        const encodedId = encode((data?.id ?? '').toString());
        router.push(`./accounts/${pathname}?id=${encodedId}`);
    }


    const column: GridColDef[] = [
        createColumn("name", "STRING", "ชื่อ", 400, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("role", "STRING", "ตำแหน่ง", 400, {
            headerAlign: "center",
            align: "center",
        }),
        createColumn("subjects", "STRING", "วิชาที่รับผิดชอบ", 400, {
            headerAlign: "center",
            align: "center",
            renderCell(params) {
                return params.value?.length > 0 ? params.value.length.toString() : '-'
            }
        })
    ]

    useEffect(() => {
        if (userData && Array.isArray(userData?.data)) {
            const transformedData = userData?.data.map((item) => ({
                id: item.id,
                ...item,
            }))
            setRows(transformedData)
        }
    }, [userData])
    // console.log("rows", rows);

    const filteredRows = rows.filter((row) => {
        if (!searchText) return true;

        const value = row[searchType as keyof typeof row];

        if (searchType === "subjects") {
            const subjectCount = Array.isArray(value) ? value.length : 0;
            const noSubjectsText = "No subjects".toLowerCase(); // แปลงเป็น lowercase
            const searchLower = searchText.toLowerCase(); // แปลง input เป็น lowercase

            // ถ้าค้นหาด้วยคำที่คล้าย "No subjects" (เช่น "no", "sub", "suj")
            if (noSubjectsText.includes(searchLower)) return subjectCount === 0;

            // ถ้าค้นหาด้วยตัวเลข
            return subjectCount.toString().includes(searchLower);
        }

        return value?.toString().toLowerCase().includes(searchText.toLowerCase());
    });

    const handleSelectRows = (rowSelected: IUser[]) => {
        setRowsSelected(rowSelected);
    };

    return (
        <>
            <PageContentLayout
                title="บัญชีผู้ใช้"
                icon={<PersonIcon />}
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
                            sx={{
                                "& .MuiMenu-list": { paddingY: '0px', backgroundColor: "#FFF" },
                            }}
                        >
                            <MenuItem sx={{ width: '100px', backgroundColor: "#FFF" }} onClick={handleConfirmDelete}>Delete</MenuItem>
                        </Menu>
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
                    description="Delete this account."
                    title="Are you sure?"
                />

            </PageContentLayout>
        </>
    )
}