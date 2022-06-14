/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import Link from '@/components/Link'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { useKeycloak } from "@react-keycloak/ssr";
import {
    List,
    ListItem,
    Typography,
    ListItemIcon,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { authorizedFunction } from '@/utils/auth';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    listItem: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    navLink: {
        fontWeight: 300,
        '&:hover': {
            color: theme.palette.primary.dark,
        },
    },
    listItemIcon: {
        minWidth: 'auto',
    },
    closeIcon: {
        justifyContent: 'flex-end',
        cursor: 'pointer',
    },
    menu: {
        display: 'flex',
    },
    menuItem: {
        marginRight: theme.spacing(8),
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
    divider: {
        width: '100%',
    },
}));

const CustomLink = forwardRef((props, ref) => (
    <div ref={ref} style={{ flexGrow: 1 }}>
        <Link {...props} />
    </div>
));

const SidebarNav = props => {
    const { pages, onClose, className, ...rest } = props;
    const classes = useStyles();
    const { keyCloak } = useKeycloak();

    const admin = pages.admin;
    const request = pages.request;
    const account = pages.account;

    const MenuGroup = props => {
        const { item } = props;
        return (
            <List disablePadding>

                <ListItem disableGutters className={classes.menuGroupItem}>
                    <Typography
                        variant="body2"
                        component={CustomLink}
                        to={item.href}
                        className={clsx(classes.navLink, 'submenu-item')}
                        color="textPrimary"
                        onClick={item.onClick ? item.onClick : onClose}
                    >
                        {item.title}
                    </Typography>
                </ListItem>
            </List>
        );
    };

    const RequestPages = () => {
        const { aidForm, resilienceForm, foodstampsForm, status } = request.children;
        return (
            <div className={classes.menu}>
                <div className={classes.menuItem}>
                    <MenuGroup item={aidForm} />
                    {/* <MenuGroup item={foodstampsForm} /> */}
                    {/* <MenuGroup item={resilienceForm} /> */}
                    <MenuGroup item={status} />
                </div>
            </div>
        );


    };

    const AdminPages = () => {
        const { requests, dashboard, googleMapsSearch } = admin.children;
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
        const { signup, signin, signout } = account.children;
        return (
            <div className={classes.menu}>
                <div className={classes.menuItem}>
                    {
                        keyCloak.authenticated ?
                            <MenuGroup item={signout} />
                            :
                            <>
                                <MenuGroup item={signin} />
                                <MenuGroup item={signup} />
                            </>
                    }
                </div>
            </div>
        );
    };

    return (
        <List {...rest} className={clsx(classes.root, className)}>
            <ListItem className={classes.closeIcon} onClick={onClose}>
                <ListItemIcon className={classes.listItemIcon}>
                    <CloseIcon fontSize="small" />
                </ListItemIcon>
            </ListItem>
            <ListItem className={classes.listItem}>
                <Typography variant="h6" color="textPrimary" gutterBottom>
                    Kuenta
                </Typography>
                <AccountPages />
            </ListItem>
            <ListItem className={classes.listItem}>
                <Divider className={classes.divider} />
            </ListItem>
            {
                authorizedFunction(['SoawAdmin']) ?
                    <>
                        <ListItem className={classes.listItem}>
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                                Admin
                            </Typography>
                            <AdminPages />
                        </ListItem>
                        <ListItem className={classes.listItem}>
                            <Divider className={classes.divider} />
                        </ListItem>
                    </>
                    : null
            }
            {
                authorizedFunction(['SoawClient']) ?
                    <>
                        <ListItem className={classes.listItem}>
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                                Petishon
                            </Typography>
                            <RequestPages />
                        </ListItem>
                        <ListItem className={classes.listItem}>
                            <Divider className={classes.divider} />
                        </ListItem>
                    </>
                    : null
            }


        </List>
    );
};

SidebarNav.propTypes = {
    className: PropTypes.string,
    pages: PropTypes.object.isRequired,
    onClose: PropTypes.func,
};

export default SidebarNav;
