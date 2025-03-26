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
import { ICurriculum, ISubjects } from '#/types/LTS/ILts';
import useDeleteClo from '#/hooks/useDeleteClo';
import AlertConfirm from '#/components/modal/AlertConfirm';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';

export default function Home() {
    const [rows, setRows] = useState<ISubjects[]>([]);
    const [rowsSelected, setRowsSelected] = useState<IClo[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>("subId");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: cloData, isLoading: isLoadingPloData } = useGetAllClo();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const { mutateAsync: deleteClo, isLoading: isLoadingDeleteClo } = useDeleteClo();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const router = useRouter();
    const [key, setKey] = useState(0);
    const searchParams = useSearchParams();
    const curriculumId = searchParams.get("cur");
    const { encode, decode } = useUrlSafeBase64();
    const paramsCurId = Number(curriculumId ? decode(curriculumId) : null);

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);
    const [isOpenConfirmModalAlert, setIsOpenConfirmModalAlert] = useState(false);

    useEffect(() => {
        if (subjectsData?.data) {
            const transformedData = subjectsData?.data.map((item) => ({
                ...item
            }))
            setRows(transformedData.filter(item => item.curriculum?.id === paramsCurId));
        }
    }, [paramsCurId, subjectsData])

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

    // const handleNavigationCreate = () => {
    //     const encodedId = encode((paramsSubId ?? '').toString());
    //     const curriculumId = encode((paramsCurId ?? '').toString());
    //     router.push(`/admin/clos/createClo?id=${encodedId}&cur=${curriculumId}`);
    // };

    const handleNavigation = (data: ISubjects) => {
        const pathname = encodeURIComponent(data?.subNameEn ?? '');
        const encodeSubId = encode((data.id ?? '').toString());
        const encodeCurId = encode((data.curriculum?.id ?? '').toString());
        router.push(`/admin/clos/${pathname}?sub=${encodeSubId}&cur=${encodeCurId}`);
    }

    const column: GridColDef[] = [
        createColumn("subId", "STRING", "รหัสวิชา", 150, {
            headerAlign: "center",
            align: "center",
            sortable: true
        }),
        createColumn("subNameTh", "STRING", "ชื่อวิชา (ภาษาไทย)", 350, {
            headerAlign: "center",
            align: "center",
            sortable: true
        }),
        createColumn("subNameEn", "STRING", "ชื่อวิชา (ภาษาอังกฤษ)", 350, {
            headerAlign: "center",
            align: "center",
            sortable: true
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

    return (
        <>
            <PageContentLayout
                title={`${curriculumData?.data?.find((item: ICurriculum) => item.id === paramsCurId)?.degreeFullTh}`}
                icon={<MenuBookIcon />}
            >
                <TableWithSearch
                    idKey='id'
                    key={key}
                    columns={column}
                    rows={filteredRows}
                    onViewRow={(rowSelected) => handleNavigation(rowSelected)}
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
            </PageContentLayout>
        </>
    )
}