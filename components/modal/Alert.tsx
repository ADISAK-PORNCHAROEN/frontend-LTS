import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


type Props = {
    text: String;
    desc?: String;
    type: String;
    // Type: success, error, warning, info
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function AlertBox({ text, desc, type, isOpen, setIsOpen }: Props) {
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
                                <div className='flex justify-end'>
                                    {/* <button onClick={closeModal} className='focus:outline-none'>
                                        <CloseRoundedIcon sx={{ fontSize: "30px", color: '#515151' }} />
                                    </button> */}
                                </div>
                                <div className="mt-2 flex items-center justify-center">
                                    {
                                        type == 'success' ? (
                                            <CheckCircleOutlineRoundedIcon sx={{ fontSize: "150px", color: '#00cc88' }} />
                                        ) : type == 'error' ? (
                                            <HighlightOffRoundedIcon sx={{ fontSize: "150px", color: '#ff2828' }} />
                                        ) : type == 'warning' ? (
                                            <ErrorOutlineRoundedIcon sx={{ fontSize: "150px", color: '#ffaa00' }} />
                                        ) : type == 'info' ? (
                                            <HelpOutlineRoundedIcon sx={{ fontSize: "150px", color: '#00aaff' }} />
                                        ) : null
                                    }
                                </div>
                                <div className="text-center text-gray-500 break-words px-10">
                                    <Typography variant="titleModal">
                                        {text}
                                    </Typography>
                                </div>
                                <div className="text-gray-400">
                                    <Typography variant="descModal">{desc}</Typography>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}