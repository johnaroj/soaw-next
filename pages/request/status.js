import React from 'react';
import { makeStyles } from '@mui/styles';
import { SectionAlternate, CardBase } from '@/components/organisms';
import Hero from '@/components/RequestStatus/Hero';
import General from '@/components/RequestStatus/General';
import { getSession } from 'next-auth/react';
import { NEXT_URL } from '@/config/index.js';
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



const RequestStatus = ({ requests }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Hero />
            <SectionAlternate className={classes.section}>
                <CardBase withShadow align="left">
                    <General requests={requests} />
                </CardBase>
            </SectionAlternate>
        </div>
    );
};

export default RequestStatus;

RequestStatus.getLayout = function getLayout(RequestStatus) {
    return (
        <Main>{RequestStatus}</Main>
    )
}
export const getServerSideProps = async ({ req, query: { page = 0 }, resolvedUrl }) => {
    const session = await getSession({ req });
    if (!session) {
        return {
            redirect: {
                destination: `/signin?redirect=admin/request`,
                permanent: false
            }
        }
    }

    const requests = await fetch(`${NEXT_URL}/api/request?page=${page}`, {
        headers: {
            cookie: req.headers.cookie,
        }
    }).then(result => result.json())

    return {
        props: {
            requests
        }
    }
}