"use client"
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material';

const FooterWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1, 0), // ลดขนาดให้เล็กลง
    width: '100%',
    zIndex: theme.zIndex.drawer - 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
}));

const FooterContent = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
}));

const DeveloperInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: theme.spacing(0.5),
    },
}));

export default function Footer() {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <FooterWrapper>
            <FooterContent maxWidth="md">
                <Typography variant="caption" sx={{ mb: 0.5 }}>
                    © {currentYear}
                </Typography>

                <DeveloperInfo>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                        <Typography variant="caption">
                            <Link href="mailto:adisakporncharoen@gmail.com" color="inherit" underline="hover">
                                พัฒนาโดย อดิศักดิ์ พรเจริญ (adisakporncharoen@gmail.com)
                            </Link>
                        </Typography>

                        <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>•</Typography>

                        <Typography variant="caption">
                            <Link href="mailto:weerapat.dearr@gmail.com" color="inherit" underline="hover">
                                วีรภัทร อินทร (weerapat.dearr@gmail.com)
                            </Link>
                        </Typography>
                    </Box>
                </DeveloperInfo>
            </FooterContent>
        </FooterWrapper>
    );
}