'use client';
import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CloseIcon from '@mui/icons-material/Close';



type Props = {
    message: string;

    /**
     * "success" , "warning" , "failed"
     * default is success
     * @default
     */
    type: string;

    /** 
     * for close ModalBox when it's open for 1000 ms.
     * @default 
    */
    duration?: number;

    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

    /**
     * medium
     * @default 
     */
    size?: 'small' | 'medium' | 'large';

    onClose?: () => void;
};

const ModalBox: React.FC<Props> = ({ message, type, isOpen, setIsOpen, size = 'medium', duration = 1000, onClose }) => {
    let IconComponent;
    let iconColor;
    
    switch (type) {
        case 'success':
            IconComponent = CheckCircleRoundedIcon;
            iconColor = '#00cc88';
            break;
        case 'warning':
            IconComponent = WarningRoundedIcon;
            iconColor = '#ffaa00';
            break;
        case 'failed':
            IconComponent = CancelRoundedIcon;
            iconColor = '#ff0055';
            break;
        default:
            IconComponent = null;
            iconColor = 'red';
    }
    

    const handleClose = () => {
        
        setIsOpen(false);
        if (onClose) {
            onClose();
        }
    };

    const getSize = (size: 'small' | 'medium' | 'large') => {
        switch (size) {
            case 'small':
                return { width: '300px', height: '200px' };
            case 'medium':
                return { width: '550px', height: '290px' };
            case 'large':
                return { width: '700px', height: '400px' };
            default:
                return { width: '500px', height: '280px' };
        }
    };

    // useEffect(() => {
    //     if (isOpen && duration > 0) {
    //         const timer = setTimeout(() => {
    //             handleClose();
    //         }, duration);

    //         return () => clearTimeout(timer);
    //     }
    // }, [isOpen, duration]);

    return (
        <Dialog open={isOpen} onClose={handleClose} aria-labelledby="modal-title" maxWidth="md" PaperProps={{ style: getSize(size) }}>
            {/* <DialogTitle id="modal-title" sx={{ m: 0, p: 2,ml: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,fontWeight: 'normal',fontSize: 24}}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
            
                <button
                    onClick={handleClose}
                    style={{
                        backgroundColor: '#8286FF',
                        borderRadius: '15%',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <CloseIcon style={{ color: 'white' }} />
                </button>
            </DialogTitle> */}
            <DialogContent dividers sx={{ textAlign: 'center', p: 3 ,typography: 'body1'}}>
                {IconComponent && <IconComponent sx={{ fontSize: 125, color: iconColor }} />}
                <Typography variant="body1" sx={{ mt: 1 ,fontWeight: '1500',fontSize: 18}}>
                    {message}
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default ModalBox;
