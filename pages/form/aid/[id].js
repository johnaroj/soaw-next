import React from 'react';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import { SectionAlternate, CardBase } from '@/components/organisms';
import MultipleStepForm from '@/components/RequestFormStepper/MultipleStepForm';
import Hero from '@/components/RequestFormStepper/Hero';
import { useRouter } from 'next/router';
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
    const router = useRouter();
    const classes = useStyles();
    const { id } = router.query;
    return (
        <div className={classes.root}>
            <Hero />
            <SectionAlternate className={classes.section}>
                <Grid container spacing={4}>

                    <Grid item xs={12}>
                        <CardBase withShadow align="left">
                            <MultipleStepForm id={id} />
                        </CardBase>
                    </Grid>
                </Grid>
            </SectionAlternate>
        </div>
    );
};

export default RequestFormStepper;

RequestFormStepper.getLayout = function getLayout(RequestFormStepper) {
    return (
        <Main>{RequestFormStepper}</Main>
    )
}
