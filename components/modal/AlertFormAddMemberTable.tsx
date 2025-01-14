import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import ActionBtn from "#/components/button/ActionBtn";
import SearchIcon from "@mui/icons-material/Search";
import { Add } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Props = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    children?: React.ReactNode
    selectedMembers?: any
    filteredOptions?: any
    handleSelectMember?: any
    inputValue?: string
    setInputValue?: any

    refreshKey?: any
    actionButtonColor?: any
    rowsSelectedPermission?: any
    handleClickPermissionMenu?: any
    handleAddMember?: any
    handleCancelAddMember?: any
    handleSaveAddMember?: any
}
export default function AlertFormAddMemberTest({
    isOpen,
    setIsOpen,
    children,
    selectedMembers,
    filteredOptions,
    handleSelectMember,
    inputValue,
    setInputValue,

    refreshKey,
    actionButtonColor,
    rowsSelectedPermission,
    handleClickPermissionMenu,
    handleAddMember,
    handleCancelAddMember,
    handleSaveAddMember,
}: Props) {

    const closeModal = () => setIsOpen(false)
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-4/5 h-full transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                                <Box>

                                    <Typography
                                        sx={{
                                            fontSize: "30px",
                                            color: "#8286FF",
                                            fontWeight: "700",
                                            textAlign: "center",
                                            paddingBottom: "20px",
                                        }}
                                    >
                                        Member
                                    </Typography>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingBottom: "40px",
                                        }}
                                    >
                                        <Autocomplete
                                            key={refreshKey}
                                            size="small"
                                            value={selectedMembers}
                                            multiple
                                            popupIcon={<SearchIcon />}
                                            id="tags-outlined"
                                            options={filteredOptions}
                                            getOptionLabel={(option) => option.firstName + " " + option.lastName}
                                            onChange={(event, newValue) => {
                                                handleSelectMember(event, newValue);
                                            }}
                                            filterSelectedOptions
                                            inputValue={inputValue}
                                            onInputChange={(event, value) => setInputValue(value)}
                                            isOptionEqualToValue={(option, value) => option.userId === value.userId}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.userId}>
                                                    {option.firstName} {option.lastName}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Add member"
                                                    placeholder="Search"
                                                />
                                            )}
                                            sx={{
                                                width: "500px",
                                                marginRight: "12px",
                                                "& .MuiAutocomplete-popupIndicator": { transform: "none" },
                                            }}
                                        />

                                        <div className="flex justify-center items-center gap-3">
                                            <ActionBtn
                                                title="Action"
                                                icon={<ExpandMoreIcon />}
                                                color={actionButtonColor}
                                                disabled={rowsSelectedPermission}
                                                onClick={handleClickPermissionMenu}
                                            />

                                            <ActionBtn
                                                title="Add Member"
                                                icon={<Add />}
                                                onClick={handleAddMember}
                                            />
                                        </div>
                                    </div>

                                    {children}

                                    <div className="flex justify-center items-center mt-10 gap-3">
                                        <ActionBtn
                                            title="Cancel"
                                            icon={<CloseIcon />}
                                            color='#FF2828'
                                            onClick={handleCancelAddMember}
                                        />
                                        <ActionBtn
                                            title="Confirm"
                                            icon={<CheckIcon />}
                                            color='#8286FF'
                                            onClick={handleSaveAddMember}
                                        />
                                    </div>

                                </Box>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}