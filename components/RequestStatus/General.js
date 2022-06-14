import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles'
import { useQuery } from 'react-query';


import {
    useMediaQuery,
    Grid,
    CircularProgress
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import { Alert } from '@mui/material/Alert';
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
    const { className, ...rest } = props;
    const { initialized, keycloak } = useKeycloak();
    const [loading, setLoading] = useState(false);
    const [requestList, setRequestList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequest();
    }, [])

    const fectchRequest = async () => {
        try {
            const result = await fetch(`${process.env.REACT_APP_API}/api/request/user?id=${keycloak.idTokenParsed.sub}`)
            const data = await result.json()
            return data;
        } catch (error) {
            setError(error.message);
        }

    }
    const classes = useStyles

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    if (error) return (<Grid container spacing={isMd ? 4 : 2}><Grid item xs={12}><Alert severity='error'>{error ? error : requestList?.title}</Alert></Grid></Grid>)

    return (
        <div className={clsx(classes.root, className)} {...rest} style={{ width: '100%' }}>
            <Grid container spacing={isMd ? 4 : 2}>
                {loading ? <CircularProgress color="primary" /> : <RequestStatusList requests={requestList} />}
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
