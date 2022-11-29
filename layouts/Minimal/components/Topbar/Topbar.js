import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { colors, AppBar, Toolbar } from '@mui/material';
import Logo from '@/public/images/logos/iSOAW_web.jpeg'

import Image from 'next/image';
import Link from 'next/link';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    background: theme.palette.white,
    borderBottom: `1px solid ${colors.grey[200]}`,
  },
  toolbar: {
    maxWidth: 1100,
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(0, 2),
  },
  logoContainer: {
    position: 'relative',
    width: 300,
    height: 80,
    [theme.breakpoints.up('md')]: {
      width: 320,
      height: 80,
    },
  },
}));

const Topbar = props => {
  const { onSidebarOpen, className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar className={classes.toolbar}>
          <Link href="/" title="thefront" className={classes.logoContainer}>
            <Image
              src={Logo}
              fill
              sizes="100vw"
              alt="SOAW"
              quality={100}
              style={{
                objectFit: 'contain',
              }}
              priority
            />
          </Link>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
};

export default Topbar;
