import React, { useEffect, useState } from 'react'
import Image from "next/image";
import PlusIcon from '#/public/assets/icon-svg/plus.svg';
import ActionBtn from '../button/ActionBtn'

import { GridColDef, GridValidRowModel } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Clear from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search';
import { AdvancedSearchCondition, AdvancedSearchType, IAdvancedSearchPayload } from '#/types/other/IPayload';
import DynamicSearchInput from './DynamicSearchInput';

const conditionOptionsString: { name: string, value: AdvancedSearchCondition }[] = [
    { name: "Equal", value: "EQUAL" },
    { name: "Not Equal", value: "NOT_EQUAL" },
    { name: "Contain", value: "CONTAIN" },
    { name: "Not Contain", value: "NOT_CONTAIN" },
    { name: "Begin With", value: "BEGIN_WITH" },
    { name: "Not Begin With", value: "NOT_BEGIN_WITH" },
    { name: "End With", value: "END_WITH" },
]
const conditionOptionsNumber: { name: string, value: AdvancedSearchCondition }[] = [
    { name: "Equal", value: "EQUAL_NUMBER" },
    { name: "Not Equal", value: "NOT_EQUAL_NUMBER" },
    { name: "Greater Than", value: "GREATER_THAN" },
    { name: "Less Than", value: "LESS_THAN" },
    { name: "Greater Than Or Equal To", value: "GREATER_THAN_OR_EQUAL_TO" },
    { name: "Less Than Or Equal To", value: "LESS_THAN_OR_EQUAL_TO" },
]
const conditionOptionsDate: { name: string, value: AdvancedSearchCondition }[] = [
    { name: "Equal", value: "EQUAL" },
    { name: "Not Equal", value: "NOT_EQUAL" },
]

const conditionOptions: Record<AdvancedSearchType, { name: string, value: AdvancedSearchCondition }[]> = {
    STRING: conditionOptionsString,
    NUMBER: conditionOptionsNumber,
    DATE: conditionOptionsDate,
}

export type AdvanceSearchProps<R extends GridValidRowModel> = {
    isOpenAdvanceSearch: boolean;
    setOpenAdvanceSearch: React.Dispatch<React.SetStateAction<boolean>>;
    searchTypesOptions: GridColDef<R>[];

    searchFilters?: IAdvancedSearchPayload<R>[];
    onAdvanceSearch?: (search: IAdvancedSearchPayload<R>[]) => void;

    extraSearchConfig?: { field: keyof R, option: { value: string, name: string }[] }[]

}

export default function AdvanceSearch<R extends GridValidRowModel>({
    searchTypesOptions, isOpenAdvanceSearch, setOpenAdvanceSearch, searchFilters, onAdvanceSearch, extraSearchConfig
}: AdvanceSearchProps<R>) {

    const emptyAdvanceSearch: IAdvancedSearchPayload<R> = { columnName: '', type: 'STRING', conditionName: 'CONTAIN', value: '' }

    const [advanceSearch, setAdvanceSearch] = useState<IAdvancedSearchPayload<R>[]>([emptyAdvanceSearch])

    const onCloseAdvanceSearch = () => {
        ("[TableWithSearch] @onCloseAdvanceSearch >>>")
        if (onAdvanceSearch) {
            const trimAdvanceSearch = advanceSearch.filter(item => item.columnName && item.conditionName && item.value)
            const lowerStringInAdvanceSearch = trimAdvanceSearch.map(item => {
                if (item.type === 'STRING') return { ...item, value: item.value.toLowerCase() }
                else return item
            })
            onAdvanceSearch(lowerStringInAdvanceSearch)
        }
        setOpenAdvanceSearch(false)
    }

    const handleClickAdd = () => {
        ("[TableWithSearch] @handleClickAdd >>>")
        setAdvanceSearch([
            ...advanceSearch,
            { ...emptyAdvanceSearch }
        ])
    }

    const handleClickClearAll = () => {
        if (onAdvanceSearch) {
            setAdvanceSearch([{ ...emptyAdvanceSearch }])
            onAdvanceSearch([]) ///clear advance search
        }
    }

    const handleAdvanceSearchChange = () => {
        if (isOpenAdvanceSearch) {
            if (searchFilters) {
                if (searchFilters.length === 0) {
                    setAdvanceSearch([emptyAdvanceSearch])
                } else {
                    setAdvanceSearch([...searchFilters])
                }
            }
        }
    }

    useEffect(() => {
        handleAdvanceSearchChange()
    }, [isOpenAdvanceSearch])


    return (
        <>
            <Box className={`avs-container border rounded p-4 mb-4 ${isOpenAdvanceSearch ? "block" : "hidden"}`}>
                <Box className=" avs-content mt-2">
                    {advanceSearch.map((avs, index) => (
                        <Box className=" avs-item mt-4" key={index}>
                            <Box className=" w-full flex flex-wrap">
                                <Box className=" w-11/12 lg:w-5/12 p-2">
                                    <FormControl className=' w-full' variant="outlined" size='small'>
                                        <InputLabel>Select Topic</InputLabel>
                                        <Select
                                            label="Select Topic"
                                            value={avs.columnName}
                                            onChange={(e) => setAdvanceSearch(prev => {
                                                const newAvs = [...prev]
                                                newAvs[index].columnName = e.target.value || ''
                                                newAvs[index].value = ''

                                                const findColumn = searchTypesOptions.find(item => item.field === e.target.value) as (GridColDef<R> & { dataType: AdvancedSearchType })
                                                if (findColumn.dataType !== newAvs[index].type) {
                                                    newAvs[index].type = findColumn.dataType || 'STRING'
                                                    newAvs[index].conditionName = findColumn.dataType === 'STRING' ? 'CONTAIN' : findColumn.dataType === 'NUMBER' ? 'EQUAL_NUMBER' : 'EQUAL'
                                                }
                                                return newAvs
                                            })}
                                        >
                                            {searchTypesOptions.map((item, index) => (
                                                <MenuItem key={index} value={item.field}>{item.headerName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box className=" w-4/12 lg:w-2/12 p-2">
                                    <FormControl className='w-full' variant="outlined" size='small'>
                                        <Select
                                            value={avs.conditionName}
                                            onChange={(e) => setAdvanceSearch(prev => {
                                                const newAvs = [...prev]
                                                newAvs[index].conditionName = (e.target.value || '') as AdvancedSearchCondition
                                                return newAvs
                                            })}
                                        >
                                            {conditionOptions[avs.type].map((item, index) => (
                                                <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box className=" w-7/12 lg:w-4/12 p-2">
                                    <DynamicSearchInput
                                        searchValue={avs.value}
                                        onSearchChange={(newSearchValue) => setAdvanceSearch(prev => {
                                            const newAvs = [...prev]
                                            newAvs[index].value = newSearchValue || ''
                                            return newAvs
                                        })}
                                        inputType={avs.type}
                                        option={extraSearchConfig?.find(item => item.field === avs.columnName)?.option}
                                        hideSearchIcon
                                        onSearchClear={()=>{
                                            setAdvanceSearch(prev => {
                                                const newAvs = [...prev]
                                                newAvs[index].value = ''
                                                return newAvs
                                            })
                                        }}
                                    />
                                </Box>

                                <Box className=" w-1/12 lg:w-1/12 p-2 content-center">
                                    {index !== 0 && <IconButton aria-label="delete-file" size="small"
                                        className='rounded bg-[#FF7E7E] hover:bg-[#ff6c6c]'
                                        onClick={(e) => setAdvanceSearch(prev => {
                                            const newAvs = [...prev]
                                            newAvs.splice(index, 1)
                                            return newAvs
                                        })}>
                                        <Clear className=' text-white' />
                                    </IconButton>}
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box className=" avs-action mt-4 flex justify-end gap-4">
                    <ActionBtn
                        title='Add Filter'
                        icon={<Image src={PlusIcon} alt="Plus Icon" />}
                        onClick={handleClickAdd}
                        color='#3190ff'
                    />
                    <ActionBtn
                        title='Search'
                        icon={<SearchIcon className=' text-white' />}
                        onClick={onCloseAdvanceSearch}
                        color='#3190ff'
                    />
                    <ActionBtn
                        title='Clear Filter'
                        icon={<Clear className=' text-white' />}
                        onClick={handleClickClearAll}
                        color='#3190ff'
                    />

                </Box>
            </Box>
        </>
    )
}