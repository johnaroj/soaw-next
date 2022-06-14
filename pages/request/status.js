import React from 'react';
import { makeStyles } from '@mui/styles';
import { SectionAlternate, CardBase } from '@/components/organisms';
import Hero from '@/components/RequestStatus/Hero';
import General from '@/components/RequestStatus/General';
import { validateAuth } from '@/utils/auth';

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



const RequestStatus = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Hero />
            <SectionAlternate className={classes.section}>
                <CardBase withShadow align="left">
                    <General />
                </CardBase>
            </SectionAlternate>
        </div>
    );
};

export default RequestStatus;

// export const getServerSideProps = async (ctx) => {
//     const auth = validateAuth(ctx.req);

//     //console.log(ctx.req.headers.cookie);

//     if (!auth) {
//         return {
//             redirect: {
//                 permanent: false,
//                 destination: "/login?redirect=request/status",
//             },
//         };
//     }
//}