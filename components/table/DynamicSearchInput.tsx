import React from 'react'
import { FormControl, Select, MenuItem, TextField, InputAdornment, IconButton, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Clear } from '@mui/icons-material';
import { AdvancedSearchType } from '#/types/other/IPayload';
import { DatePicker, DateView, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export type DynamicSearchInputProps = {
  inputType: AdvancedSearchType
  searchValue: string
  onSearchChange: (newSearchValue: string) => void;
  onSearchClear?: () => void; // TODO after all page implement > change to not optional
  disabled?: boolean
  option?: { value: string; name: string; }[]; // NOTE: for inputType = "STRING" with select options
  hideSearchIcon?: boolean;
  dateFormat?: { input: string; output: string; views?: DateView[] | undefined }; // NOTE: for inputType = "DATE" with some different date format
}

export default function DynamicSearchInput({
  searchValue,
  onSearchChange,
  onSearchClear,
  disabled,
  inputType,
  option,
  hideSearchIcon,
  dateFormat = {
    input: "MM/YYYY",
    output: 'YYYY-MM',
    views: ['month', 'year']
  },
}: DynamicSearchInputProps) {
  const handleSearchClear = () => {
    onSearchChange('');
    if (onSearchClear) onSearchClear();
  };

  return (
    <>
      {inputType === 'DATE'
        ? <div className="w-full" >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="w-full"
              views={dateFormat.views}
              format={dateFormat.input}
              value={dayjs(searchValue) || null || Date}
              onChange={(newValue) => {
                const newDate = dayjs(newValue).format(dateFormat.output)
                // ('newDate', newDate === 'Invalid Date')
                onSearchChange(newDate === 'Invalid Date' ? '' : newDate)
              }}
              defaultValue={undefined}
              disabled={disabled}
              slotProps={{
                textField: {
                  variant: "outlined",
                  error: false,
                  size: "small",
                  InputLabelProps: { shrink: true },
                  // TODO: try to set clearable input
                },
                field: {
                  clearable: true
                }
              }}
            />
          </LocalizationProvider>
        </div>
        : inputType === 'NUMBER'
          ? <div>
            <TextField
              className="w-full"
              variant="outlined"
              onChange={(e) => onSearchChange(e.target.value || '')}
              value={searchValue}
              disabled={disabled}
              size='small'
              label="Search"
              type='number'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchValue && <IconButton aria-label="clear-search" size="small" onClick={() => onSearchChange('')}>
                      <Clear className=' text-[#B2B2B2]' />
                    </IconButton>}
                    {!hideSearchIcon && <SearchIcon className={`${disabled ? " text-gray-300" : "text-ats-icon"}`} />}
                  </InputAdornment>
                ),
              }}
            />
          </div>
          : option
            ? <div>
              <Autocomplete
                className="w-full"
                size='small'
                filterSelectedOptions
                getOptionKey={(option) => option.value}
                onChange={(e, value) => {
                  if (value) onSearchChange(value.value || '')
                  else if (onSearchClear) onSearchClear()
                }}
                disableClearable={!searchValue}
                disabled={disabled}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select"
                    placeholder="Select"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.value} value={option.value!!}>{option.name}</li>
                )}
                getOptionLabel={(option) => option.name!!}
                value={option.find(it => it.value.toLowerCase() === searchValue.toLowerCase()) || null}
                options={option}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
            </div>
            : <div>
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                className="w-full"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value || '')}
                disabled={disabled}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchValue && <IconButton aria-label="clear-search" size="small" onClick={() => onSearchChange('')}>
                        <Clear className=' text-[#B2B2B2]' />
                      </IconButton>}
                      {!hideSearchIcon && <SearchIcon className={`${disabled ? " text-gray-300" : "text-ats-icon"}`} />}
                    </InputAdornment>
                  ),
                }}
              /></div>
      }
    </>
  )
}