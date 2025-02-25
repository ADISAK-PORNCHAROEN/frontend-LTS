"use client"
import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MailIcon from '@mui/icons-material/Mail';
import ClassIcon from '@mui/icons-material/Class';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportIcon from '@mui/icons-material/Report';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Collapse, Menu, MenuItem } from '@mui/material';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { ISubjects } from '#/types/LTS/ILts';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
        },
    }),
    ...(!open && {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up('sm')]: {
            width: `calc(${theme.spacing(8)} + 1px)`,
        },
        '& .MuiDrawer-paper': {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: `calc(${theme.spacing(7)} + 1px)`,
            [theme.breakpoints.up('sm')]: {
                width: `calc(${theme.spacing(8)} + 1px)`,
            },
        },
    }),
}));

interface Props {
    children?: React.ReactNode;
}

const menuItems = [
    { text: 'แดชบอร์ด', icon: <DashboardIcon />, path: 'dashboard' },
    { text: 'บัญชีผู้ใช้', icon: <PersonIcon />, path: 'accounts' },
    { text: 'หลักสูตรรายวิชา', icon: <LibraryBooksIcon />, path: 'curriculum' },
    { text: 'รายวิชา', icon: <MenuBookIcon />, path: 'subjects' },
];

export default function SidebarLayout({ children }: Props) {
    const [open, setOpen] = useState(false);
    const [subjectOpen, setSubjectOpen] = useState(false);
    const { data: session } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
    const { data: userData } = useGetAllUsers();
    const [userSubjects, setUserSubjects] = useState<ISubjects[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!userData?.data || !session?.user?.email) return;

        const currentUser = userData.data.find((u: any) => u.email === session.user.email);
        if (!currentUser?.subjects) return;

        const flattenedSubjects = currentUser.subjects.flatMap((s: any) =>
            s.subjects?.map((sub: ISubjects) => ({
                id: sub.id,
                ...sub
            })) ?? []
        );
        setUserSubjects(flattenedSubjects);
    }, [userData, session?.user?.email]);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const handleSubjectClick = () => setSubjectOpen(!subjectOpen);

    const handleNavigate = (path: string, data?: ISubjects) => {
        const currentPath = pathname.startsWith(`/admin`) ? `/admin` : `/member`;
        if (!currentPath) return;

        if (data?.subNameEn) {
            router.push(`${currentPath}/teaching/${decodeURIComponent(data.subNameEn)}?id=${data.id}`);
        } else {
            router.push(`${currentPath}/${path.toLowerCase()}`);
        }
    };

    if (!mounted || !session) {
        return <>{children}</>;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{ /* backgroundColor: '#1a3f61' */ }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="เปิดเมนู"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                        <AccountCircleIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                            {session?.user?.name}
                        </Typography>
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => signOut({ callbackUrl: `${basePath}/api/auth/signIn` })}>
                            ออกจากระบบ
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    ...(pathname.includes(`/${item.path.toLowerCase()}`) && {
                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    })
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider />

                {session?.user?.role === 'admin' && (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleSubjectClick}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    ...(pathname.includes(`/teaching`) && {
                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    })
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ClassIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="วิชาที่รับผิดชอบ"
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                                {open && (subjectOpen ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={open && subjectOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {userSubjects.map((subject: ISubjects) => (
                                    <ListItemButton
                                        key={subject.id}
                                        sx={{
                                            pl: 4,
                                            minHeight: 40,
                                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                            ...(pathname.includes(`/teaching/${encodeURIComponent(subject.subNameEn as string)}`) && {
                                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                            }),
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                            },
                                        }}
                                        onClick={() => handleNavigate('teaching', subject)}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <MenuBookIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={subject.subNameTh}
                                            secondary={subject.subNameEn}
                                            primaryTypographyProps={{
                                                fontSize: '0.9rem',
                                                sx: {
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '150px',
                                                },
                                            }}
                                            secondaryTypographyProps={{
                                                fontSize: '0.8rem',
                                                sx: {
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '150px',
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>

                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleNavigate('trash')}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="ถังขยะ"
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleNavigate('spam')}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ReportIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="สแปม"
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                )}
            </Drawer>

            {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box> */}
        </Box>
    );
}