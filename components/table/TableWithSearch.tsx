import React, { ReactNode, useState } from 'react'
import { Box, IconButton, Autocomplete, TextField } from '@mui/material';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import FilterIcon from '#/public/assets/icon-svg/filter.svg';
import Image from "next/image";
import Table, { TableProps } from './Table';
import AdvanceSearch from './AdvanceSearch';
import { AdvancedSearchType, IAdvancedSearchPayload } from '#/types/other/IPayload';
import DynamicSearchInput from './DynamicSearchInput';
import { DateView } from '@mui/x-date-pickers';

export type TableWithSearchProps<R extends GridValidRowModel> = {
  searchType: string;
  onSearchTypeChange: (newSearchType: string) => void;
  searchText: string
  onSearchTextChange: (newSearchText: string) => void;
  onSearchTextClear?: () => void; // TODO after all page implement > change to not optional
  // New curriculum search props
  curriculumValue?: string;
  onCurriculumChange?: (newValue: string) => void;
  curriculumOptions?: { value: string, name: string }[];
  // Year and semester search props
  yearValue?: string;
  onYearChange?: (newValue: string) => void;
  yearOptions?: { value: string, name: string }[];
  semesterValue?: string;
  onSemesterChange?: (newValue: string) => void;
  semesterOptions?: { value: string, name: string }[];
  // End of new props
  extraSearchConfig?: { field: keyof R, option: { value: string, name: string }[], dateFormat?: { input: string; output: string; views?: DateView[] | undefined } }[]
  slotOppositeSearch?: ReactNode;
  slotAboveTable?: ReactNode;
  searchFilters?: IAdvancedSearchPayload<R>[];
  onAdvanceSearch?: (search: IAdvancedSearchPayload<R>[]) => void;
  slotHeader?: ReactNode; // Add this to accept CustomHeader
  slotFooter?: ReactNode; // Add this to accept CustomFooter
};

export default function TableWithSearch<R extends GridValidRowModel>({
  searchType,
  onSearchTypeChange,
  searchText,
  onSearchTextChange,
  onSearchTextClear,
  // New curriculum search props
  curriculumValue = '',
  onCurriculumChange,
  curriculumOptions = [],
  // Year and semester search props
  yearValue = '',
  onYearChange,
  yearOptions = [],
  semesterValue = '',
  onSemesterChange,
  semesterOptions = [],
  // End of new props
  extraSearchConfig,
  slotOppositeSearch,
  slotAboveTable,
  searchFilters,
  onAdvanceSearch,
  slotHeader,
  slotFooter,
  ...tableProps
}: TableWithSearchProps<R> & TableProps<R>) {
  ("*****************")

  const excludedFields = ['detail', 'trackingStatus', 'curriculum'];
  const searchTypesOptions = tableProps.columns.filter(item =>
    item.field !== 'concatenatedstages' && !excludedFields.includes(item.field as string)
  ) as (GridColDef<R> & { dataType: AdvancedSearchType })[];
  // ("[TableWithSearch] searchTypesOptions >>>", searchTypesOptions)
  const [hiddenColumns, setHiddenColumns] = useState<(keyof R)[]>([]);
  const [isOpenAdvanceSearch, setOpenAdvanceSearch] = useState<boolean>(false)
  const [currentDataType, setCurrentDataType] = useState<AdvancedSearchType>('STRING')

  const searchOption = extraSearchConfig?.find(item => item.field === searchType)
  // ("[TableWithSearch] searchOption >>>", searchOption)

  const onClickAdvanceSearch = () => {
    // ("[TableWithSearch] @onClickAdvanceSearch >>>")
    setOpenAdvanceSearch(!isOpenAdvanceSearch)
  }

  const onTypeChange = (newSearchType: string) => {
    onSearchTypeChange(newSearchType)

    if (newSearchType) {
      const findColumn = searchTypesOptions.find(item => item.field === newSearchType) as (GridColDef<R> & { dataType: AdvancedSearchType })
      if (findColumn) {
        setCurrentDataType(findColumn.dataType)
      }
    }
  }

  const handleCurriculumChange = (value: string) => {
    if (onCurriculumChange) {
      onCurriculumChange(value);
    }
  }

  const handleYearChange = (value: string) => {
    if (onYearChange) {
      onYearChange(value);
    }
  }

  const handleSemesterChange = (value: string) => {
    if (onSemesterChange) {
      onSemesterChange(value);
    }
  }

  return (
    <>
      <Box className="flex items-center justify-between mb-4">
        <Box>
          {slotOppositeSearch && <>{slotOppositeSearch}</>}
        </Box>
        <Box className="flex items-center justify-end gap-4">

          {/* Semester search dropdown */}
          {semesterOptions.length > 0 && (
            <Autocomplete
              className="w-56"
              size='small'
              options={semesterOptions}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (<TextField {...params} label="ภาคการศึกษา" />)}
              onChange={(_, newValue) => handleSemesterChange(newValue ? newValue.value : '')}
              value={semesterOptions.find(option => option.value === semesterValue) || null}
              disabled={isOpenAdvanceSearch}
            />
          )}

          {/* Year search dropdown */}
          {yearOptions.length > 0 && (
            <Autocomplete
              className="w-32"
              size='small'
              options={yearOptions}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (<TextField {...params} label="ปีการศึกษา" />)}
              onChange={(_, newValue) => handleYearChange(newValue ? newValue.value : '')}
              value={yearOptions.find(option => option.value === yearValue) || null}
              disabled={isOpenAdvanceSearch}
            />
          )}

          {/* New Curriculum search dropdown */}
          {curriculumOptions.length > 0 && (
            <Autocomplete
              className="w-56"
              size='small'
              options={curriculumOptions}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (<TextField {...params} label="หลักสูตร" />)}
              onChange={(_, newValue) => handleCurriculumChange(newValue ? newValue.value : '')}
              value={curriculumOptions.find(option => option.value === curriculumValue) || null}
              disabled={isOpenAdvanceSearch}
            />
          )}

          <Autocomplete
            className="w-48"
            size='small'
            filterSelectedOptions
            getOptionKey={(option) => option.field + option.headerName}
            onChange={(e, value) => onTypeChange(value.field || '')}
            disableClearable
            disabled={isOpenAdvanceSearch}
            renderInput={(params) => (<TextField  {...params} />)}
            renderOption={(props, option) => (
              <li {...props} key={option.field} value={option.field!!}>{option.headerName}</li>
            )}
            getOptionLabel={(option) => option.headerName!!}
            value={searchTypesOptions.find(it => it.field === searchType)}
            options={searchTypesOptions.reduce((sum, next) => {
              return hiddenColumns.includes(next.field) ? sum : [...sum, next]
            }, [] as GridColDef<R>[]) || []}
          />
          <div className='w-64'>
            <DynamicSearchInput
              searchValue={searchText}
              onSearchChange={onSearchTextChange}
              onSearchClear={onSearchTextClear}
              disabled={isOpenAdvanceSearch}
              inputType={currentDataType}
              option={searchOption?.option}
              dateFormat={searchOption?.dateFormat}
            />
          </div>
          {/* <IconButton
            color="secondary"
            aria-label="Filter"
            onClick={() => onClickAdvanceSearch()}
            sx={{
              bgcolor: "#3190ff",
              '&:hover': {
                bgcolor: "#3190ff"
              }
            }}>
            <Image src={FilterIcon} alt="Filter Icon" />
          </IconButton> */}
        </Box>
      </Box>

      {searchFilters && !!onAdvanceSearch && <AdvanceSearch
        searchTypesOptions={searchTypesOptions.reduce((sum, next) => {
          return hiddenColumns.includes(next.field) ? sum : [...sum, next]
        }, [] as GridColDef<R>[]) || []}
        isOpenAdvanceSearch={isOpenAdvanceSearch}
        setOpenAdvanceSearch={setOpenAdvanceSearch}
        searchFilters={searchFilters}
        onAdvanceSearch={onAdvanceSearch}
        extraSearchConfig={extraSearchConfig} />}

      {slotAboveTable && <>{slotAboveTable}</>}

      {/* Render header slot if provided */}
      {slotHeader && <>{slotHeader}</>}

      {/* Existing components */}
      {slotAboveTable && <>{slotAboveTable}</>}

      <Table {...tableProps} onHideColumn={setHiddenColumns} />

      {/* Render footer slot if provided */}
      {slotFooter && <>{slotFooter}</>}

    </>
  )
}