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
import { ICurriculum } from '#/types/LTS/ILts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import useGetAllPlo from '#/hooks/useGetAllPlo';
import { IPlo } from '#/types/LTS/IPlo';
import useDeletePlo from '#/hooks/useDeletePlo';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import AlertConfirm from '#/components/modal/AlertConfirm';

export default function Home() {
    const [rows, setRows] = useState<IPlo[]>([]);
    const [rowsSelected, setRowsSelected] = useState<IPlo[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [searchType, setSearchType] = useState<string>("ploName");
    const [pagination, setPagination] = useState({ pageSize: 10, page: 0 });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: ploData, isLoading: isLoadingPloData } = useGetAllPlo();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const { mutateAsync: deletePlo, isLoading: isLoadingDeletePlo } = useDeletePlo();
    const router = useRouter();
    const [key, setKey] = useState(0);
    const [curriculumValue, setCurriculumValue] = useState<string>('');
    const [curriculumOptions, setCurriculumOptions] = useState<{ value: string, name: string }[]>([]);
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("cur");
    const { encode, decode } = useUrlSafeBase64();
    const paramsId = encodedId ? decode(encodedId) : null;

    // modal
    const [textAlertBox, setTextAlertBox] = useState("");
    const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
    const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);
    const [isOpenConfirmModalAlert, setIsOpenConfirmModalAlert] = useState(false);

    const handleConfirmDelete = () => {
        setAnchorEl(null);
        setIsOpenConfirmModalAlert(true);
    }

    const handleDelete = async (rowsSelected: IPlo[]) => {
        setIsOpenConfirmModalAlert(false);
        try {
            const ids = rowsSelected.map((row: IPlo) => row.id).join(',');
            const res = await deletePlo({ ids });

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
        const encodedId = encode((paramsId ?? '').toString());
        router.push(`/admin/plos/createPlo?cur=${encodedId}`);
    };

    const handleNavigationEdit = (data: IPlo) => {
        const pathname = encodeURIComponent(data?.ploName!)
        const encodedId = encode((paramsId ?? '').toString());
        const encodedPloId = encode((data.id ?? '').toString());
        router.push(`/admin/plos/${pathname}?cur=${encodedId}&plo=${encodedPloId}`);
    }

    const column: GridColDef[] = [
        createColumn("ploName", "STRING", "PLOs", 350, {
            headerAlign: "center",
            align: "center",
            sortable: true
        }),
        createColumn("ploDesc", "STRING", "คําอธิบาย PLO", 350, {
            headerAlign: "center",
            align: "center",
        }),
    ]

    useEffect(() => {
        if (ploData?.data) {
            const transformedData = ploData?.data.map((item) => ({
                id: item.id,
                ...item
            }))
            setRows(transformedData.filter(item => item.curriculum?.id == paramsId));

            const curriculums = new Set<string>();
            const options: { value: string, name: string }[] = [];

            transformedData.filter(item => item.curriculum?.id == paramsId).forEach(item => {
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

            options.unshift({
                value: '',
                name: 'ทั้งหมด'
            });

            setCurriculumOptions(options);
        }
    }, [paramsId, ploData])

    const filteredRows = rows.filter((row) => {
        let mainSearchMatch = true;
        if (searchText) {
            const value = row[searchType as keyof typeof row];
            mainSearchMatch = value?.toString().toLowerCase().includes(searchText.toLowerCase()) ?? false;
        }

        let curriculumMatch = true;
        if (curriculumValue) {
            if (!row.curriculum) {
                curriculumMatch = false;
            } else {
                curriculumMatch = row.curriculum?.id?.toString() === curriculumValue;
            }
        }

        return mainSearchMatch && curriculumMatch;
    });

    const handleSelectRows = (rowSelected: IPlo[]) => {
        setRowsSelected(rowSelected);
    };

    const handleSearchTextClear = () => {
        setSearchText('');
    };

    const handleCurriculumChange = (value: string) => {
        setCurriculumValue(value);
    };

    return (
        <>
            <PageContentLayout
                title={`${curriculumData?.data?.find((item: ICurriculum) => item.id === Number(paramsId))?.degreeShortTh}`}
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
                            title="สร้าง PLO"
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
                    // กรองตามหลักสูตร
                    // curriculumValue={curriculumValue}
                    // onCurriculumChange={handleCurriculumChange}
                    // curriculumOptions={curriculumOptions}
                    onSelectRows={(rowsSelected) => handleSelectRows(rowsSelected)}
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