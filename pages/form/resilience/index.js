import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import { SectionAlternate, CardBase } from "@/components/organisms";
import Hero from "@/components/ResilienceForm/Hero";
import General from "@/components/ResilienceForm/General";
import Main from "@/layouts/Main";
import { useRequest } from "@/context/RequestProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  section: {
    "& .section-alternate__content": {
      paddingTop: 0,
      marginTop: theme.spacing(-5),
      position: "relative",
      zIndex: 1,
    },
    "& .card-base__content": {
      padding: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        padding: theme.spacing(3),
      },
    },
  },
}));

const ResilienceForm = ({ initialRequest }) => {
  const classes = useStyles();
  const { setRequest } = useRequest();

  useEffect(() => {
    setRequest(initialRequest);
  }, [initialRequest]);

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

export default ResilienceForm;

ResilienceForm.getLayout = function getLayout(ResilienceForm) {
  return <Main>{ResilienceForm}</Main>;
};

export const getServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/signin?redirect_url=form/aid`,
        permanent: false,
      },
    };
  }
  let requestListData = null;
  if (query.id) {
    requestListData = await fetch(`${NEXT_URL}/api/request/${query.id}`, {
      headers: {
        cookie: req.headers.cookie,
      },
    }).then((result) => result.json());
  } else {
    requestListData = await fetch(
      `${NEXT_URL}/api/request/user/${session.user.id}`,
      {
        headers: {
          cookie: req.headers.cookie,
        },
      }
    ).then((result) => result.json());
  }

  let initialRequest = {
    id: 0,
    edited: false,
    images: [],
    userId: "",
    firstName: "",
    lastName: "",
    registeredAddress: "",
    registeredAddressNumber: "",
    currentAddress: "",
    currentAddressNumber: "",
    placeOfBirth: "Curaçao",
    hasDutchNationality: null,
    proofOfResident: [],
    dateOfBirth: null,
    gender: "",
    maritalStatus: null,
    phone1: 0,
    phone2: 0,
    whatsapp: 5999,
    email: "",
    confirmEmail: "",
    identificationNumber: 0,
    identificationType: "",
    expiryDate: null,
    proofOfID: [],
    hasLostJobDueCorona: null,
    monthlyRedCrossDonation: "",
    identificationNumberPartner: 0,
    proofOfLostJobDueCovid: [],
    sourceOfIncome: "",
    hasChildren: null,
    proofOfChildren: [],
    ownChildren: 0,
    notOwnChildren: 0,
    amountOfResidents: 0,
    status: "INISIO",
    confirmation: false,
  };

  if (requestListData || !!requestListData.length) {
    const original = !!requestListData.length
      ? requestListData.find((request) => request.id === +query.id)
      : requestListData.find((request) => request.type === 3);

    initialRequest = {
      ...original,
      edited: true,
      status: "MODIFIKA",
      proofOfResident: await convertImagesToFile(
        original?.images?.filter((image) => image.categoryId === 1)
      ),
      proofOfLostJobDueCovid: await convertImagesToFile(
        original?.images?.filter((image) => image.categoryId === 23)
      ),
      proofOfChildren: await convertImagesToFile(
        original?.images?.filter((image) => image.categoryId === 7)
      ),
      proofOfID: await convertImagesToFile(
        original?.images?.filter((image) => image.categoryId === 22)
      ),
    };
  }

  return {
    props: {
      initialRequest,
    },
  };
};
