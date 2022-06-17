import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@mui/styles';
import { useMediaQuery } from '@mui/material';
import { Topbar, Footer, Sidebar } from '@/layouts/Main/components';
import {
    useSession, signIn, signOut
} from 'next-auth/react'

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
}));

const Main = props => {
    const { children } = props;
    const { data: session, status } = useSession()
    const classes = useStyles();

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    const pages = {
        admin: {
            title: 'Admin',
            id: 'admin',
            role: 'SoawAdmin',
            children: {
                requests: {
                    title: 'Lista di Petishon',
                    href: '/admin/request'
                },
                googleMapsSearch: {
                    title: 'Google Maps',
                    href: '/admin/google-maps-search'
                },
                dashboard: {
                    title: 'Dashboard',
                    href: '/admin/dashboard'
                },
            }
        },
        request: {
            title: 'Petishon',
            id: 'request',
            role: 'SoawClient',
            children: {
                resilienceForm: {
                    title: 'Karchi sosial 2',
                    href: '/form/resilience'
                },
                aidForm: {
                    title: 'Bijstand',
                    href: '/form/aid'
                },
                foodstampsForm: {
                    title: 'Voedselpakket',
                    href: '/form/foodpackage'
                },
                status: {
                    title: 'Estado Bijstand',
                    href: '/request/status'
                },
                reapply: {
                    title: 'Aplíka di nobo',
                    href: '/form/aid?reapply=true'
                }
            }

        },
        signup: {
            title: 'Registra',
            id: 'signup',
            href: '/signup',
            //onClick: () => newUser()
        },
        signin: {
            title: 'Login',
            id: 'login',
            href: '/signin',
            onClick: () => signIn('keycloak', { callbackUrl: 'http://localhost:3000' })
        },
        signout: {
            title: 'Logout',
            id: 'logout',
            href: '/signout',
            onClick: () => signOut()
        },
        account: {
            title: 'Kuenta',
            id: 'account',
            children: {
                signup: {
                    title: 'Registra',
                    href: '/',
                    //onClick: () => new('keycloak', { callbackUrl: 'http://localhost:3000' })
                },
                signin: {
                    title: 'Login',
                    href: '/',
                    onClick: () => signIn('keycloak', { callbackUrl: 'http://localhost:3000' })
                },
                signout: {
                    title: 'Logout',
                    href: '/',
                    onClick: () => signOut({ callbackUrl: "/api/auth/logout", })
                }
            },
        },
    };

    const [openSidebar, setOpenSidebar] = useState(false);
    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    const open = isMd ? false : openSidebar;

    return (
        <div
            className={clsx({
                [classes.root]: true,
            })}
        >
            <Topbar onSidebarOpen={handleSidebarOpen} pages={pages} />

            <Sidebar
                onClose={handleSidebarClose}
                open={open}
                variant="temporary"
                pages={pages}
            />
            <main>{children}</main>
            <Footer pages={pages} />
        </div>
    );
};

Main.propTypes = {
    children: PropTypes.node,
};

export default Main;
