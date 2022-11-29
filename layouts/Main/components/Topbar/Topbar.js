import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Link from '@/components/Link'
import { makeStyles } from '@mui/styles';
import Logo from '@/public/images/logos/iSOAW_web.jpeg'
import {
    AppBar,
    Toolbar,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    Popover,
    Typography,
    IconButton,
    colors,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { useSession } from "next-auth/react"

const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: 'none',
        background: theme.palette.white,
        borderBottom: `1px solid ${colors.grey[200]}`,
    },
    flexGrow: {
        flexGrow: 1,
    },
    navigationContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toolbar: {
        maxWidth: 1100,
        width: '100%',
        margin: '0 auto',
        padding: theme.spacing(0, 2),
    },
    navLink: {
        fontWeight: 300,
        '&:hover': {
            color: theme.palette.primary.dark,
        },
    },
    listItem: {
        cursor: 'pointer',
        '&:hover > .menu-item': {
            borderBottom: `1px solid ${theme.palette.primary.dark}`
        },
        '&:hover > .menu-item, &:hover svg': {
            color: theme.palette.primary.dark
        },
    },
    listItemActive: {
        '&> .menu-item': {
            color: theme.palette.primary.dark,
            borderBottom: `1px solid ${theme.palette.primary.dark}`
        },
    },
    listItemText: {
        flex: '0 0 auto',
        marginRight: theme.spacing(2),
        whiteSpace: 'nowrap',
    },
    listItemIcon: {
        minWidth: 'auto',
    },
    popover: {
        padding: theme.spacing(4),
        border: theme.spacing(2),
        boxShadow: '0 0.5rem 2rem 2px rgba(116, 123, 144, 0.09)',
        minWidth: 200,
        marginTop: theme.spacing(2),
    },
    iconButton: {
        padding: 0,
        '&:hover': {
            background: 'transparent',
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
        color: theme.palette.primary.dark,
    },
    logoContainer: {
        position: 'relative',
        height: 80,
        width: 270,
        [theme.breakpoints.up('md')]: {
            
        },
    },
    menu: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    menuItem: {
        marginRight: theme.spacing(5),
        '&:last-child': {
            marginRight: 0,
        },
    },
    menuGroupItem: {
        paddingTop: 0,
    },
    menuGroupTitle: {
        textTransform: 'uppercase',
    },
}));

const CustomLink = forwardRef((props, ref) => (
    <div ref={ref}>
        <Link {...props} />
    </div>
));

const Topbar = props => {
    const { className, onSidebarOpen, pages, ...rest } = props;
    const { data: session, status } = useSession()
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [openedPopoverId, setOpenedPopoverId] = useState(null);

    const handleClick = (event, popoverId) => {
        setAnchorEl(event.target);
        setOpenedPopoverId(popoverId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenedPopoverId(null);
    };

    const request = pages.request;
    const admin = pages.admin;
    const account = pages.account;
    // const signin = pages.signin;
    // const signup = pages.signup;
    // const signout = pages.signout;

    const MenuGroup = props => {
        const { item } = props;
        return (
            <List disablePadding>
                {
                    <ListItem disableGutters className={classes.menuGroupItem}>
                        <Typography
                            variant="body1"
                            component={CustomLink}
                            to={item?.href}
                            className={clsx(classes.navLink, 'submenu-item')}
                            color="textSecondary"
                            onClick={item.onClick ? item.onClick : handleClose}
                        >
                            {item.title}
                        </Typography>
                    </ListItem>
                }
            </List>
        );
    };

    const RequestPages = () => {
        const { aidForm, resilienceForm, foodstampsForm, reapply, status } = request.children;
        return (
            <div className={classes.menu}>
                <div className={classes.menuItem}>
                    <MenuGroup item={aidForm} />
                    {/* <MenuGroup item={foodstampsForm} /> */}
                    {/* <MenuGroup item={resilienceForm} /> */}
                    <MenuGroup item={status} />
                    <MenuGroup item={reapply} />
                </div>
            </div>
        );


    };

    const AdminPages = () => {
        const { requests, googleMapsSearch, dashboard } = admin.children;
        return (
            <div className={classes.menu}>
                <div className={classes.menuItem}>
                    <MenuGroup item={requests} />
                    <MenuGroup item={dashboard} />
                    <MenuGroup item={googleMapsSearch} />
                </div>
            </div>
        );
    };

    const AccountPages = () => {
        const { signin, signout, signup } = account.children;
        return (
            <div className={classes.menu}>
                <div className={classes.menuItem}>
                    {
                        status === "authenticated" ?
                            (
                                <MenuGroup item={signout} />
                            ) :
                            (
                                <>
                                    <MenuGroup item={signup} />
                                    <MenuGroup item={signin} />
                                </>
                            )
                    }
                </div>

            </div>
        );
    };

    // const LoginPages = () => {
    //     return <div className={classes.menu}>
    //         <div className={classes.menuItem}>
    //             <MenuGroup item={signin} />
    //         </div>
    //     </div>
    // };
    // const SignupPages = () => {
    //     return <div className={classes.menu}>
    //         <div className={classes.menuItem}>
    //             <MenuGroup item={signup} />
    //         </div>
    //     </div>
    // };

    // const LogoutPages = () => {
    //     return <div className={classes.menu}>
    //         <div className={classes.menuItem}>
    //             <MenuGroup item={signout} />
    //         </div>
    //     </div>
    // };

    const renderPages = id => {
        if (id === 'admin') {
            return <AdminPages />;
        }
        if (id === 'request') {
            return <RequestPages />;
        }
        if (id === 'account') {
            return <AccountPages />;
        }
    };
    const menuPages = session?.user?.isAdmin ? [request, admin, account] : session?.user ? [request, account] : [account];

    return (
        <AppBar
            {...rest}
            position="sticky"
            className={clsx(classes.root, className)}
        >
            <Toolbar disableGutters className={classes.toolbar}>
                <Link href="/" title="soaw" className={classes.logoContainer}>
                    <Image
                        fill 
                        sizes="100vw"
                        src={Logo}
                        alt="soaw"
                        style={{
                            objectFit: 'contain',
                          }}
                          priority
                    />
                </Link>
                <div className={classes.flexGrow} />
                <Hidden smDown>
                    <List className={classes.navigationContainer}>
                        {menuPages.map((page, i) => (
                            <div key={page.id} >
                                <ListItem
                                    aria-describedby={page.id}
                                    onClick={e => handleClick(e, page.id)}
                                    className={clsx(
                                        classes.listItem,
                                        openedPopoverId === page.id ? classes.listItemActive : '',
                                    )}
                                >
                                    <Typography
                                        variant="body1"
                                        color="textSecondary"
                                        className={clsx(classes.listItemText, 'menu-item')}
                                    >
                                        {page.title}
                                    </Typography>
                                    <ListItemIcon className={classes.listItemIcon}>
                                        <ExpandMoreIcon
                                            className={clsx
                                                (openedPopoverId === page?.id ? classes.expandOpen : '',
                                                    page?.id === 'account' ? classes.accountItemIcon : '')
                                            }
                                            fontSize="small"
                                        />
                                    </ListItemIcon>
                                </ListItem>
                                <Popover
                                    elevation={1}
                                    id={page.id}
                                    open={openedPopoverId === page.id}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    classes={{ paper: classes.popover }}
                                >
                                    <div>{renderPages(page.id)}</div>
                                </Popover>
                            </div>
                        ))}
                    </List>
                </Hidden>
                <Hidden mdUp>
                    <IconButton
                        className={classes.iconButton}
                        onClick={onSidebarOpen}
                        aria-label="Menu"
                    >
                        <MenuIcon />
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar >
    );
};

Topbar.propTypes = {
    className: PropTypes.string,
    onSidebarOpen: PropTypes.func,
    pages: PropTypes.object.isRequired,
};

export default Topbar;
