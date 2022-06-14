import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { Topbar } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    paddingTop: 56,
    [theme.breakpoints.up('lg')]: {
      paddingTop: 64,
    },
  },
  content: {
    height: '100%',
  },
}));

const Minimal = props => {
  const { children, className } = props;

  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Topbar />
      <main className={classes.content}>{children}</main>
    </div>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Minimal;
