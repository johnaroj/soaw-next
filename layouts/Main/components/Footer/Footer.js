import React, { forwardRef } from 'react';
import Link from '@/components/Link'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import {
    Typography,
    IconButton,
    Grid,
    List,
    ListItem,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';

//import Image from '@/components/Image';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(6, 0),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(12, 0),
        },
        background: '#c04a7a',
    },
    footerContainer: {
        maxWidth: 1100,
        width: '100%',
        margin: '0 auto',
        padding: theme.spacing(0, 2),
    },
    logoContainerItem: {
        paddingTop: 0,
    },
    logoContainer: {
        width: 120,
        height: 32,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    groupTitle: {
        textTransform: 'uppercase',
        color: theme.palette.primary.dark,
        marginBottom: theme.spacing(1),
    },
    socialIcon: {
        padding: 0,
        marginRight: theme.spacing(1),
        color: 'rgba(255,255,255,.6)',
        '&:hover': {
            background: 'transparent',
        },
        '&:last-child': {
            marginRight: 0,
        },
    },
    icon: {
        fontSize: 24,
    },
    menuListContainer: {
        padding: '0 !important',
    },
    menu: {
        display: 'flex',
    },
    menuItem: {
        margin: theme.spacing(2),
        '&:last-child': {
            marginBottom: 0,
        },
    },
    menuGroupItem: {
        paddingTop: 0,
        paddingBottom: theme.spacing(1 / 2),
        '&:last-child': {
            paddingBottom: 0,
        },
    },
    menuGroupTitle: {
        textTransform: 'uppercase',
        color: 'white',
    },
    divider: {
        width: '100%',
    },
    navLink: {
        color: 'rgba(255,255,255,.6)',
    },
}));

const CustomLink = forwardRef((props, ref) => (
    <div ref={ref} style={{ flexGrow: 1 }}>
        <Link {...props} />
    </div>
));

const Footer = props => {
    const { pages, className, ...rest } = props;

    const classes = useStyles();

    const landings = pages.landings;
    const supportedPages = pages.pages;
    const account = pages.account;

    const MenuGroup = props => {
        const { item } = props;
        return (
            <List disablePadding className={classes.menuItem}>
                <ListItem disableGutters className={classes.menuGroupItem}>
                    <Typography variant="body2" className={classes.menuGroupTitle}>
                        {item.groupTitle}
                    </Typography>
                </ListItem>
                {item.pages.map((page, i) => (
                    <ListItem disableGutters key={i} className={classes.menuGroupItem}>
                        <Typography
                            variant="body2"
                            component={CustomLink}
                            to={page.href}
                            className={clsx(classes.navLink, 'submenu-item')}
                        >
                            {page.title}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        );
    };

    const LandingPages = () => {
        const { services, apps, web } = landings.children;
        return (
            <div className={classes.menu}>
                <div>
                    <MenuGroup item={services} />
                    <MenuGroup item={apps} />
                </div>
                <div>
                    <MenuGroup item={web} />
                </div>
            </div>
        );
    };

    const SupportedPages = () => {
        const {
            career,
            helpCenter,
            company,
            contact,
            blog,
            portfolio,
        } = supportedPages.children;
        return (
            <div className={classes.menu}>
                <div>
                    <MenuGroup item={career} />
                    <MenuGroup item={helpCenter} />
                </div>
                <div>
                    <MenuGroup item={company} />
                    <MenuGroup item={contact} />
                </div>
                <div>
                    <MenuGroup item={blog} />
                    <MenuGroup item={portfolio} />
                </div>
            </div>
        );
    };

    const AccountPages = () => {
        const { settings, signup, signin, password, error } = account.children;
        return (
            <div className={classes.menu}>
                <div>
                    <MenuGroup item={settings} />
                    <MenuGroup item={signup} />
                </div>
                <div>
                    <MenuGroup item={signin} />
                    <MenuGroup item={password} />
                    <MenuGroup item={error} />
                </div>
            </div>
        );
    };

    return (
        <div {...rest} className={clsx(classes.root, className)}>
            <div className={classes.footerContainer}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={2}>
                        <List disablePadding>
                            <ListItem disableGutters className={classes.logoContainerItem}>
                            <Link href="/" title="thefront" className={classes.logoContainer}>
                                        {/* <Image
                                            className={classes.logoImage}
                                            src="/images/logos/logo-negative.svg"
                                            alt="thefront"
                                            lazy={false}
                                        /> */}
                                    </Link>
                            </ListItem>
                            <ListItem disableGutters>
                                <IconButton className={classes.socialIcon}>
                                    <FacebookIcon className={classes.icon} />
                                </IconButton>
                                <IconButton className={classes.socialIcon}>
                                    <InstagramIcon className={classes.icon} />
                                </IconButton>
                                <IconButton className={classes.socialIcon}>
                                    <TwitterIcon className={classes.icon} />
                                </IconButton>
                                <IconButton className={classes.socialIcon}>
                                    <PinterestIcon className={classes.icon} />
                                </IconButton>
                            </ListItem>
                        </List>
                    </Grid>
                    {/* <Grid item xs={12} md={10} className={classes.menuListContainer}>
                        <Grid container spacing={0}>
                            <Grid item className={classes.listItem}>
                                <LandingPages />
                            </Grid>
                            <Grid item className={classes.listItem}>
                                <SupportedPages />
                            </Grid>
                            <Grid item className={classes.listItem}>
                                <AccountPages />
                            </Grid>
                        </Grid>
                    </Grid> */}
                </Grid>
            </div>
        </div>
    );
};

Footer.propTypes = {
    className: PropTypes.string,
    pages: PropTypes.object.isRequired,
};

export default Footer;
