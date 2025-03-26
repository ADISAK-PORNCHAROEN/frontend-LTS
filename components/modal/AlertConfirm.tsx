import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Typography } from '@mui/material';

type Props = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    onConfirm: () => void
    description?: string
    title: string
}
export default function AlertConfirm({ isOpen, title, description, setIsOpen, onConfirm }: Props) {
    const closeModal = () => setIsOpen(false)

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                                <div className="mt-2 flex items-center justify-center">
                                    <ErrorOutlineRoundedIcon sx={{ fontSize: "150px", color: '#ffaa00' }} />
                                </div>
                                <div className="text-2xl text-center text-gray-800 break-words px-10">
                                    {title}
                                </div>
                                <div className="text-md text-center text-gray-500 break-words px-10">
                                    {description}
                                </div>
                                <div className="mt-4 flex items-center justify-evenly">
                                    <div className="flex justify-center items-center bg-white rounded-lg">
                                        <div className=" cursor-pointer bg-[#ff2828] border-l-2 border-y-2 border-[#ff2828] rounded-l-lg w-8 h-10 flex justify-center items-center">
                                            <ClearRoundedIcon className="text-white" />
                                        </div>
                                        <button className=" w-24 h-10 hover:bg-[#ff2828] hover:text-white duration-300 border-2 border-[#ff2828] rounded-r-lg text-[#ff2828]"
                                            type="button"
                                            tabIndex={0}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Typography variant="button">
                                                Cancel
                                            </Typography>
                                        </button>
                                    </div>
                                    <div className="flex justify-center items-center bg-white rounded-lg">
                                        <div className=" cursor-pointer bg-[#153448] border-l-2 border-y-2 border-[#153448] rounded-l-lg w-8 h-10 flex justify-center items-center">
                                            <CheckRoundedIcon className="text-white" />
                                        </div>
                                        <button className=" w-24 h-10 hover:bg-[#153448] hover:text-white duration-300 border-2 border-[#153448] rounded-r-lg text-[#153448]"
                                            type="button"
                                            tabIndex={0}
                                            onClick={() => onConfirm()}                                    >
                                            <Typography variant="button">
                                                Confirm
                                            </Typography>
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}