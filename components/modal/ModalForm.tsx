import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    IconButton,
    Box,
    Paper,
    Divider,
    useTheme,
    alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import React from 'react';

type Props = {
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    handleSaveAllChanges?: () => void;
    headTitle?: string;
    titleSubName?: string;
    yearSemesterDisplay?: string;
    children?: React.ReactNode;
    loading?: boolean;
};

function ModalForm({
    isOpen,
    setIsOpen,
    handleSaveAllChanges,
    headTitle,
    titleSubName,
    yearSemesterDisplay,
    children,
    loading = false
}: Props) {
    const theme = useTheme();

    return (
        <Dialog
            open={isOpen || false}
            onClose={() => setIsOpen && setIsOpen(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }
            }}
        >
            <Paper elevation={0}>
                <DialogTitle sx={{
                    p: 3,
                    pb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                }}>
                    <Box>
                        <Typography variant="h6" component="div" fontWeight="600">
                            {headTitle}
                        </Typography>

                        {(titleSubName || yearSemesterDisplay) && (
                            <Typography
                                variant="subtitle2"
                                component="div"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                {titleSubName} {yearSemesterDisplay}
                            </Typography>
                        )}
                    </Box>

                    <IconButton
                        onClick={() => setIsOpen && setIsOpen(false)}
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.grey[500], 0.1),
                            '&:hover': {
                                bgcolor: alpha(theme.palette.grey[500], 0.2),
                            }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ p: 3 }}>
                    {children}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2, justifyContent: 'flex-end' }}>
                    <Button
                        onClick={() => setIsOpen && setIsOpen(false)}
                        color="inherit"
                        variant="outlined"
                        sx={{
                            minWidth: '100px',
                            borderRadius: 1,
                            mr: 1
                        }}
                    >
                        ยกเลิก
                    </Button>

                    <Button
                        onClick={handleSaveAllChanges}
                        color="primary"
                        variant="contained"
                        // startIcon={<SaveIcon />}
                        disabled={loading}
                        sx={{
                            minWidth: '100px',
                            boxShadow: 2,
                            borderRadius: 1,
                            fontWeight: 'medium'
                        }}
                    >
                        {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                </DialogActions>
            </Paper>
        </Dialog>
    );
}

export default ModalForm;