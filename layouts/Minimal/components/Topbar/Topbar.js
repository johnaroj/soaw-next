import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { colors, AppBar, Toolbar } from '@mui/material';

import Image from '@/components/atoms/Image';

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
    objectFit: 'contain',
    width: 300,
    [theme.breakpoints.up('md')]: {
      objectFit: 'contain',
      width: 320,
    },
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
}));

const Topbar = props => {
  const { onSidebarOpen, className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoContainer}>
          <a href="/" title="thefront">
            <Image
              className={classes.logoImage}
              src="/images/logos/iSOAW_web.jpeg"
              alt="thefront"
              lazy={false}
            />
          </a>
        </div>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
};

export default Topbar;
