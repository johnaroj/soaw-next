import React from 'react';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import { SectionAlternate, CardBase } from '@/components/organisms';
import Hero from '@/components/FoodPackage/Hero';
import General from '@/components/FoodPackage/General';
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



const FoodPackageForm = ({ initialRequest }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Hero />
            <SectionAlternate className={classes.section}>

                <CardBase withShadow align="left">
                    <General initialRequest={initialRequest} />
                </CardBase>

            </SectionAlternate>
        </div>
    );
};

export default FoodPackageForm;

FoodPackageForm.getLayout = function getLayout(FoodPackageForm) {
    return (
        <Main>{FoodPackageForm}</Main>
    )
}

export const getServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/signin?redirect_url=form/aid`,
                permanent: false
            }
        }
    }
    let requestListData = null
    if (query.id) {
        requestListData = await fetch(`${NEXT_URL}/api/request/${query.id}`, {
            headers: {
                cookie: req.headers.cookie
            }
        }).then(result => result.json())
    } else {
        requestListData = await fetch(`${NEXT_URL}/api/request/user/${session.user.id}`, {
            headers: {
                cookie: req.headers.cookie
            }
        }).then(result => result.json())
    }

    let initialRequest = {
        id: 0,
        edited: false,
        images: [],
        userId: '',
        firstName: '',
        lastName: '',
        registeredAddress: '',
        registeredAddressNumber: '',
        currentAddress: '',
        currentAddressNumber: '',
        placeOfBirth: 'Curaçao',
        hasDutchNationality: null,
        proofOfResident: [],
        dateOfBirth: null,
        gender: '',
        maritalStatus: null,
        phone1: 0,
        phone2: 0,
        whatsapp: 5999,
        email: '',
        confirmEmail: '',
        identificationNumber: 0,
        identificationType: '',
        expiryDate: null,
        proofOfID: [],
        firstNamePartner: '',
        lastNamePartner: '',
        identificationNumberPartner: 0,
        proofOfPartnerIncome: [],
        proofOfMarriage: [],
        proofOfDivorce: [],
        proofOfVerdict: [],
        proofOfDeath: [],
        hasRelationship: null,
        livingTogether: null,
        livingTogetherAddress: '',
        livingTogetherAddressNumber: '',
        hasChildren: null,
        proofOfChildren: [],
        ownChildren: 0,
        notOwnChildren: 0,
        amountOfResidents: 0,
        created: null,
        updated: null,
        status: 'INISIO',
        confirmation: false
    }

    if (requestListData || !!requestListData.length) {
        const original = !!requestListData.length ? requestListData.find(request => request.id === +query.id)
            : requestListData.find(request => request.type === 2);

        initialRequest = {
            ...original,
            edited: true,
            status: 'MODIFIKA',
            proofOfResident: await convertImagesToFile(original?.images?.filter(image => image.categoryId === 1)),
            proofOfPartnerIncome: await convertImagesToFile(original?.images?.filter(image => image.categoryId === 2)),
            proofOfMarriage: await convertImagesToFile(original?.images?.filter(image => image.categoryId === 3)),
            proofOfRegisteredPartner: await convertImagesToFile(original?.images?.filter(image => image.categoryId === 4)),
            proofOfDivorce: await convertImagesToFile(original?.images?.filter(image => image.categoryId === 5)),
            proofOfDeath: await convertImagesToFile(original?.images?.filter(image => image.categoryId === 6)),
            proofOfChildren: await convertImagesToFile(original?.images?.filter(image => image.categoryId === 7)),
            proofOfID: await convertImagesToFile(original?.images?.filter(image => image.categoryId === 22)),
        };




    }



    return {
        props: {
            initialRequest
        }
    }

}

