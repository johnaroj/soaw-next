import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { SectionAlternate, CardBase } from '@/components/organisms';
import Hero from '@/components/Admin/Hero';
import Main from '@/layouts/Main';
import { NEXT_URL } from '@/config/index.js';
import { getSession } from 'next-auth/react';
import General from '@/components/Admin/General';
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
        }
    },
}));



const Requests = ({ requests }) => {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const { getAllRequests, setRequests, requests: requestList, loading, error } = useRequest();
    useEffect(() => {
        setRequests(requests)
    }, [requests])

    const classes = useStyles();

    useEffect(() => {
        if (page > 0) {
            getAllRequests(search, page);
        }

    }, [page, search])

    return (
        <div className={classes.root}>
            <Hero />
            <SectionAlternate className={classes.section}>
                <CardBase withShadow align="left">
                    <General error={error} loading={loading} requests={requestList} setPage={(page) => setPage(page)} setSearch={search => setSearch(search)} />
                </CardBase>
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

export const getServerSideProps = async ({ req, resolvedUrl }) => {
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/signin?redirect=admin/request`,
                permanent: false
            }
        }
    }

    const requests = await fetch(`${NEXT_URL}/api/admin/request`, {
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

