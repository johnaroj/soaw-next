import React from 'react';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import { SectionAlternate, CardBase } from '@/components/organisms';
import MultipleStepForm from '@/components/RequestFormStepper/MultipleStepForm';
import Hero from '@/components/RequestFormStepper/Hero';
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
        },
        '& .card-base__content': {
            padding: theme.spacing(2),
            [theme.breakpoints.up('md')]: {
                padding: theme.spacing(3),
            },
        },
    },
}));



const RequestFormStepper = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Hero />
            <SectionAlternate className={classes.section}>
                <CardBase withShadow align="left">
                    <MultipleStepForm />
                </CardBase>
            </SectionAlternate>
        </div>
    );
};

export default RequestFormStepper;

RequestFormStepper.getLayout = function getLayout(Home) {
    return (
        <Main>{Home}</Main>
    )
}

