import React from 'react';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import { SectionAlternate, CardBase } from '@/components/organisms';
import Hero from '@/components/RequestDetails/Hero'
import General from '@/components/RequestDetails/General'
import Main from '@/layouts/Main';
import { getSession } from 'next-auth/react';
import { NEXT_URL } from '@/config/index.js';
import { useRequest } from '@/context/Provider';

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



const RequestDetails = ({ request }) => {
    const classes = useStyles();
    const { setRequest } = useRequest();
    useEffect(() => { setRequest(request) }, [setRequest])
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

export default RequestDetails;
RequestDetails.getLayout = function getLayout(RequestDetails) {
    return (
        <Main>{RequestDetails}</Main>
    )
}
export const getServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req });
    if (!session) {
        return {
            redirect: {
                destination: `/signin?redirect=admin/request`,
                permanent: false
            }
        }
    }

    const request = await fetch(`${NEXT_URL}/api/request/${params.id}`, {
        headers: {
            cookie: req.headers.cookie,
        }
    }).then(result => result.json())

    return {
        props: {
            request
        }
    }
}