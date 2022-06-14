import React from 'react';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import { SectionAlternate, CardBase } from '@/components/organisms';
import RequestList from '@/components/Admin/RequestList';
import Hero from '@/components/Admin/Hero';
import Main from '@/layouts/Main';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
    },
    section: {
        '& .section-alternate__content': {
            paddingTop: 0,
            marginTop: theme.spacing(-5),
            position: 'relative',
            zIndex: 1,
        }
    },
}));



const Requests = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Hero />
            <SectionAlternate className={classes.section}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <CardBase withShadow align="left">
                            <RequestList />
                        </CardBase>
                    </Grid>
                </Grid>
            </SectionAlternate>
        </div>
    );
};

export default Requests;

Requests.getLayout = function getLayout(Requests) {
    return (
        <Main>{Requests}</Main>
    )
}



