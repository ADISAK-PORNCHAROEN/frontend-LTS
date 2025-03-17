"use client";
import { useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid';
import { Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Table, { createColumn } from '#/components/table/Table';
import TableWithSearch from '#/components/table/TableWithSearch';
import ActionBtn from '#/components/button/ActionBtn';
import PageContentLayout from '#/components/layout/PageContentLayout';
import Alert from '#/components/modal/Alert';
import { useRouter, useSearchParams } from 'next/navigation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import { IClo } from '#/types/LTS/IPlo';
import useGetAllClo from '#/hooks/useGetAllClo';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import { ISubjects } from '#/types/LTS/ILts';
import useDeleteClo from '#/hooks/useDeleteClo';
import AlertConfirm from '#/components/modal/AlertConfirm';

export default function Home() {
    const [rows, setRows] = useState<IClo[]>([]);
    const [rowsSelected, setRowsSelected] = useState<IClo[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>("cloName");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: cloData, isLoading: isLoadingPloData } = useGetAllClo();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { mutateAsync: deleteClo, isLoading: isLoadingDeleteClo } = useDeleteClo();
    const router = useRouter();
    const [key, setKey] = useState(0);
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("id");
    const curriculumId = searchParams.get("cur");
    const { encode, decode } = useUrlSafeBase64();
    const paramsSubId = Number(encodedId ? decode(encodedId) : null);
    const paramsCurId = Number(curriculumId ? decode(curriculumId) : null);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);
    const [isOpenConfirmModalAlert, setIsOpenConfirmModalAlert] = useState(false);

    useEffect(() => {
        if (cloData?.data) {
            const transformedData = cloData?.data.map((item) => ({
                ...item
            }))
            setRows(transformedData.filter(item => item.subjects?.id === paramsSubId && item.curriculum?.id === paramsCurId));
        }
    }, [paramsSubId, cloData, paramsCurId])

    const handleConfirmDelete = () => {
        setAnchorEl(null);
        setIsOpenConfirmModalAlert(true);
    }

    const handleDelete = async (rowsSelected: IClo[]) => {
        setIsOpenConfirmModalAlert(false);
        try {
            const ids = rowsSelected.map((row: IClo) => row.id).join(',');
            const res = await deleteClo({ ids });

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

    const handleNavigationCreate = () => {
        const encodedId = encode((paramsSubId ?? '').toString());
        const curriculumId = encode((paramsCurId ?? '').toString());
        router.push(`/admin/clos/createClo?id=${encodedId}&cur=${curriculumId}`);
    };

    const handleNavigationEdit = (data: IClo) => {
        const pathname = encodeURIComponent(data?.cloName ?? '');
        const encodeCloId = encode((data.id ?? '').toString());
        const encodeSubId = encode((data.subjects?.id ?? '').toString());
        const encodeCurId = encode((data.curriculum?.id ?? '').toString());
        router.push(`/admin/clos/${pathname}?id=${encodeCloId}&sub1=${encodeSubId}&cur=${encodeCurId}`);
    }

    const column: GridColDef[] = [
        createColumn("cloName", "STRING", "CLOs", 350, {
            headerAlign: "center",
            align: "center",
            sortable: true
        }),
        createColumn("cloDesc", "STRING", "คําอธิบาย CLO", 350, {
            headerAlign: "center",
            align: "center",
        }),
    ]

    const filteredRows = rows.filter((row) => {
        let mainSearchMatch = true;
        if (searchText) {
            const value = row[searchType as keyof typeof row];
            mainSearchMatch = value?.toString().toLowerCase().includes(searchText.toLowerCase()) ?? false;
        }

        return mainSearchMatch;
    });

    const handleSelectRows = (rowSelected: IClo[]) => {
        setRowsSelected(rowSelected);
    };

    const handleSearchTextClear = () => {
        setSearchText('');
    };

    const subjectName = subjectsData?.data?.find((item: ISubjects) => item.id === paramsSubId && item.curriculum?.id === paramsCurId)?.subNameTh ?
        `CLOs ${subjectsData?.data?.find((item: ISubjects) => item.id === paramsSubId && item.curriculum?.id === paramsCurId)?.subNameTh}`
        : "404 not found";

    return (
        <>
            <PageContentLayout
                title={subjectName}
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
                            <MenuItem sx={{ width: '100px', backgroundColor: "#FFF" }} onClick={handleConfirmDelete}>ลบข้อมูล</MenuItem>
                        </Menu>
                        <ActionBtn
                            title="สร้าง CLOs"
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
                    onSelectRows={(rowsSelected) => handleSelectRows(rowsSelected)}
                    // pagination={pagination}
                    // setPagination={setPagination}
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

                <AlertConfirm
                    isOpen={isOpenConfirmModalAlert}
                    setIsOpen={setIsOpenConfirmModalAlert}
                    onConfirm={() => handleDelete(rowsSelected)}
                    description="ข้อมูลที่เกี่ยวข้องจะถูกลบด้วย"
                    title="คุณแน่ใจหรือไม่?"
                />
            </PageContentLayout>
        </>
    )
}