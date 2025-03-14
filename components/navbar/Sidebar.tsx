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
import ClassIcon from '@mui/icons-material/Class';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Chip, Collapse, Menu, MenuItem } from '@mui/material';
import { signOut } from 'next-auth/react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { ICurriculum, ISubjects } from '#/types/LTS/ILts';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';
import ArticleIcon from '@mui/icons-material/Article';
import { IUser } from '#/types/IResponse/IResponse';

const drawerWidth = 280;

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
    // { text: 'CLOs', icon: <ClassIcon />, path: 'clos' },
    // { text: 'PLOs', icon: <ClassIcon />, path: 'plos' },
];

const menuItemsIsProfessor = [
    { text: 'แดชบอร์ด', icon: <DashboardIcon />, path: 'dashboard' },
]

export default function SidebarLayout({ children }: Props) {
    const [open, setOpen] = useState(false);
    const [subjectOpen, setSubjectOpen] = useState(false);
    const [plosOpen, setPlosOpen] = useState(false);
    const [closOpen, setClosOpen] = useState(false);
    const { data: session } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pathId = searchParams.get('id');
    const subId = searchParams.get("sub");
    const sub1Id = searchParams.get("sub1");
    const curId = searchParams.get("cur");
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
    const { data: userData } = useGetAllUsers();
    const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
    const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
    const [userSubjects, setUserSubjects] = useState<ISubjects[]>([]);
    const [curriculumList, setCurriculumList] = useState<ICurriculum[]>([]);
    const [subjectList, setSubjectList] = useState<ISubjects[]>([]);
    const [mounted, setMounted] = useState(false);
    const { encode, decode } = useUrlSafeBase64();
    const paramsSubId = Number(pathId ? decode(pathId) : null);
    const paramsSUBId = Number(subId ? decode(subId) : null);
    const paramsSubEditId = Number(sub1Id ? decode(sub1Id) : null);
    const paramsCurId = Number(curId ? decode(curId) : null);
    // console.log("paramsSubId", paramsSubId, "paramsSubEditId", paramsSubEditId, "paramsCurId", paramsCurId);
    // เพิ่ม state สำหรับเก็บสถานะการแสดงผลของแต่ละ curriculum
    const [expandedCurriculums, setExpandedCurriculums] = useState<{ [key: string]: boolean }>({});
    // เพิ่ม state นี้ในส่วนของ hooks ของ component
    const [expandedSubjectEvals, setExpandedSubjectEvals] = useState<Record<string, boolean>>({});

    const status = {
        isActive: "Active",
        isInactive: "Inactive"
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!curriculumData?.data) return;
        setCurriculumList(curriculumData.data);

        if (!subjectsData?.data) return;
        setSubjectList(subjectsData.data);

        if (!userData?.data || !session?.user?.email) return;

        const currentUser = userData.data.find((u: IUser) => u.email === session.user.email);

        if (!currentUser?.subjects) {
            setUserSubjects([]);
            return;
        }

        const flattenedSubjects = currentUser.subjects.flatMap((s: any) =>
            s.subjects?.map((sub: ISubjects) => ({
                id: sub.id,
                ...sub
            })) ?? []
        );
        setUserSubjects(flattenedSubjects);


    }, [userData, session?.user.email, curriculumData, subjectsData?.data, userData?.data]);

    useEffect(() => {
        // if (!curriculumData?.data) return;
        // setCurriculumList(curriculumData.data);

        // if (!subjectsData?.data) return;
        // setSubjectList(subjectsData.data);

        // const expandedCurriculums: { [key: string]: boolean } = {};
        // curriculumData.data.forEach((curriculum: ICurriculum) => {
        //     expandedCurriculums[curriculum.id!] = false;
        // });
        // setExpandedCurriculums(expandedCurriculums);
    }, [curriculumData, subjectsData?.data]);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const handleSubjectClick = () => setSubjectOpen(!subjectOpen);
    const handlePlosClick = () => setPlosOpen(!plosOpen);
    const handleClosClick = () => setClosOpen(!closOpen);

    const handleNavigate = (path: string, data?: ISubjects | ICurriculum) => {
        // console.log("data", data);
        // console.log("path", path);

        let currentPath = "/instructor";
        if (pathname.startsWith("/admin")) {
            currentPath = "/admin";
        } else if (pathname.startsWith("/coordinator")) {
            currentPath = "/coordinator";
        }

        if (!currentPath) return;

        let targetPath = `${currentPath}/${path.toLowerCase()}`;

        if (data) {
            if ("subNameEn" in data && data.subNameEn) {
                const encodedId = encode((data?.id ?? '').toString());
                const subId = encode((data?.id ?? '').toString());
                const curriculumId = encode((data?.curriculum?.id ?? '').toString());
                if (path === 'teaching') {
                    targetPath = `${currentPath}/teaching?sub=${subId}&cur=${curriculumId}`;
                } else {
                    targetPath = `${currentPath}/${path}?id=${encodedId}&cur=${curriculumId}`;
                }
                if (path === 'evaluation') {
                    targetPath = `${currentPath}/teaching/evaluation?sub=${subId}&cur=${curriculumId}`;
                }
            } else if ("degreeShortEn" in data && data.degreeShortEn) {
                const encodedId = encode((data?.id ?? '').toString());
                targetPath = `${currentPath}/${path}?id=${encodedId}`;
            }
        }

        router.push(targetPath);
    };

    if (!mounted || !session) {
        return <>{children}</>;
    }

    const Role = {
        isAdmin: "admin",
        isCoordinator: "program_coordinator",
        isInstructor: "instructor"
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

                {(session?.user?.role === Role.isAdmin) && (
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

                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleClosClick}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    ...(pathname.includes(`/clos`) && {
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
                                    primary="CLOs"
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                                {open && curriculumList && curriculumList.length > 0 && (closOpen ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={open && closOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {curriculumList.map((curriculum: ICurriculum) => {
                                    const isCurriculumExpanded = expandedCurriculums[curriculum?.id ?? 'default-id'];
                                    const isCurriculumActive = pathname.includes("/clos") && paramsCurId === curriculum?.id;

                                    const curriculumSubjects = subjectList.filter(subject => subject.curriculum?.id === curriculum.id && subject.subStatus === status.isActive);

                                    return (
                                        <React.Fragment key={curriculum?.id}>
                                            <ListItemButton
                                                sx={{
                                                    pl: 4,
                                                    minHeight: 40,
                                                    backgroundColor: isCurriculumActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                    },
                                                }}
                                                onClick={(event) => {
                                                    // Toggle expansion if subjects exist
                                                    if (curriculumSubjects && curriculumSubjects.length > 0) {
                                                        event.stopPropagation();
                                                        setExpandedCurriculums(prev => ({
                                                            ...prev,
                                                            [curriculum.id ?? 'default-id']: !prev[curriculum.id ?? 'default-id']
                                                        }));
                                                    }
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    <MenuBookIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={curriculum?.degreeShortTh}
                                                    secondary={curriculum?.degreeShortEn}
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
                                                {curriculumSubjects && curriculumSubjects.length > 0 &&
                                                    (isCurriculumExpanded ? <ExpandLess sx={{ mr: 0.5 }} /> : <ExpandMore sx={{ mr: 0.5 }} />)
                                                }
                                            </ListItemButton>

                                            {/* Nested Collapse for subjects under this curriculum */}
                                            {curriculumSubjects && curriculumSubjects.length > 0 && (
                                                <Collapse in={isCurriculumExpanded} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {curriculumSubjects?.filter(subject => subject?.subStatus === status.isActive).map((subject: ISubjects) => {

                                                            const isEditPage = pathname.split("/").length >= 4 && !pathname.includes("/createClo");
                                                            const isCreatePage = pathname.includes("/createClo");
                                                            const isSubjectActive = pathname.includes("/clos") && (
                                                                (!isEditPage && !isCreatePage && paramsSubId === subject.id && paramsCurId === subject.curriculum?.id) ||
                                                                (isEditPage && paramsSubEditId === subject.id && paramsCurId === subject.curriculum?.id) ||
                                                                (isCreatePage && paramsSubId === subject.id && paramsCurId === subject.curriculum?.id) ||
                                                                (pathname.includes(`/clos/${subject.subNameEn}`) || pathname.includes(`/clos/${encodeURIComponent(subject.subNameEn as string)}`))
                                                            );

                                                            return (
                                                                <ListItemButton
                                                                    key={subject?.id}
                                                                    sx={{
                                                                        pl: 6,
                                                                        minHeight: 40,
                                                                        backgroundColor: isSubjectActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                                        },
                                                                    }}
                                                                    onClick={() => handleNavigate('clos', subject)}
                                                                >
                                                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                                                        <ArticleIcon fontSize="small" />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={subject?.subNameTh}
                                                                        secondary={subject?.subNameEn}
                                                                        primaryTypographyProps={{
                                                                            fontSize: '0.85rem',
                                                                            sx: {
                                                                                whiteSpace: 'nowrap',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                maxWidth: '150px',
                                                                            },
                                                                        }}
                                                                        secondaryTypographyProps={{
                                                                            fontSize: '0.75rem',
                                                                            sx: {
                                                                                whiteSpace: 'nowrap',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                maxWidth: '150px',
                                                                            },
                                                                        }}
                                                                    />
                                                                </ListItemButton>
                                                            );
                                                        })}
                                                    </List>
                                                </Collapse>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        </Collapse>

                        {/* PLOs */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handlePlosClick}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    ...(pathname.includes(`/plos`) && {
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
                                    primary="PLOs"
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                                {open && curriculumList && curriculumList.length > 0 && (plosOpen ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={open && plosOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {curriculumList.map((curriculum: ICurriculum) => {
                                    const isActive = pathname.includes("/plos") && paramsSubId === curriculum.id;

                                    return (
                                        <ListItemButton
                                            key={curriculum?.id}
                                            sx={{
                                                pl: 4,
                                                minHeight: 40,
                                                backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                },
                                            }}
                                            onClick={() => handleNavigate('plos', curriculum)}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <MenuBookIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={curriculum?.degreeShortTh}
                                                secondary={curriculum?.degreeShortEn}
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
                                    )
                                })}
                            </List>
                        </Collapse>
                    </List>
                )}

                <Divider />

                {(session?.user?.role === Role.isAdmin || session?.user?.role === Role.isInstructor || session?.user?.role === Role.isCoordinator) && (

                    <List>
                        {(session?.user?.role === Role.isInstructor || session?.user?.role === Role.isCoordinator) && (
                            menuItemsIsProfessor.map((item) => (
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
                            ))
                        )}

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
                                {open && userSubjects.length > 0 && (subjectOpen ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={open && subjectOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {userSubjects.map((subject: ISubjects) => {
                                    // Add a new state to track each subject's evaluation collapse state
                                    const isSubjectEvalExpanded = expandedSubjectEvals[subject.id!];
                                    const isActive = pathname.includes("/teaching") && paramsSUBId === subject.id;
                                    const isActiveEval = pathname.includes("/evaluation") && paramsSUBId === subject.id;

                                    return (
                                        <React.Fragment key={subject.id}>
                                            <ListItemButton
                                                sx={{
                                                    pl: 4,
                                                    minHeight: 40,
                                                    backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
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
                                                {/* Add expand toggle button that stops propagation to prevent navigation */}
                                                <IconButton
                                                    size="small"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setExpandedSubjectEvals(prev => ({
                                                            ...prev,
                                                            [subject.id!]: !prev[subject.id!]
                                                        }));
                                                    }}
                                                >
                                                    {isSubjectEvalExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                                                </IconButton>
                                            </ListItemButton>

                                            {/* Nested Collapse for evaluations under this subject */}
                                            <Collapse in={isSubjectEvalExpanded} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    <ListItemButton
                                                        sx={{
                                                            pl: 6,
                                                            minHeight: 10,
                                                            backgroundColor: isActiveEval ? "rgba(0, 0, 0, 0.08)" : "transparent",
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                            },
                                                        }}
                                                        onClick={() => handleNavigate('evaluation', subject)}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                                            <AssessmentIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="ประเมินรายวิชา"
                                                            secondary="Course Evaluation"
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
                                                </List>
                                            </Collapse>
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        </Collapse>

                    </List>

                )}
            </Drawer >

            {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box> */}
        </Box >
    );
}