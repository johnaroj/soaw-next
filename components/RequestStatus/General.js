import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles'


import {
    useMediaQuery,
    Grid,
} from '@mui/material';
import RequestStatusList from '@/components/RequestStatusList';



const useStyles = makeStyles(theme => ({
    root: {
    },
    inputTitle: {
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
}));


const General = props => {
    const { className, requests, loading, ...rest } = props;

    const classes = useStyles

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });


    return (
        <div className={clsx(classes.root, className)} {...rest} style={{ width: '100%' }}>
            <Grid container spacing={isMd ? 4 : 2}>
                <RequestStatusList requests={requests} loading={loading} />
            </Grid>
        </div>
    );
};

General.propTypes = {
    /**
     * External classes
     */
    className: PropTypes.string,
};

export default General;
