import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { SectionAlternate, CardBase } from "@/components/organisms";
import MultipleStepForm from "@/components/RequestFormStepper/MultipleStepForm";
import Hero from "@/components/RequestFormStepper/Hero";
import Main from "@/layouts/Main";
import { getSession } from "next-auth/react";
import { NEXT_URL } from "@/config/index.js";
import { convertImagesToFile } from "@/utils/convertImages";

import prisma from "@/config/db";
import { useRequest } from "@/context/Provider";

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

const RequestFormStepper = ({ initialRequest }) => {
  const { setRequest, request } = useRequest();
  useEffect(() => {
    setRequest((prevRequest) => ({ ...initialRequest, ...prevRequest }));
  }, [initialRequest]);
  console.log(request.proofOfID);
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

RequestFormStepper.getLayout = function getLayout(RequestFormStepper) {
  return <Main>{RequestFormStepper}</Main>;
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
    requestListData = await prisma.requests.findUnique({
      where: {
        id: Number(req.query.id),
      },
      include: {
        images: true,
      },
    });
  } else {
    requestListData = await prisma.requests.findMany({
      where: {
        userId: session.user.id,
      },
    });
  }

  let initialRequest = {
    id: 0,
    reApply: false,
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
    mobile: "",
    phone: "",
    whatsapp: 5999,
    email: "",
    confirmEmail: "",
    identificationNumber: "",
    identificationType: "",
    expiryDate: null,
    proofOfID: [],
    firstNamePartner: "",
    lastNamePartner: "",
    identificationNumberPartner: "",
    proofOfPartnerIncome: [],
    proofOfMarriage: [],
    proofOfDivorce: [],
    proofOfVerdict: [],
    proofOfDeath: [],
    hasRelationship: null,
    livingTogether: null,
    livingTogetherAddress: "",
    livingTogetherAddressNumber: "",
    hasChildren: null,
    proofOfChildren: [],
    ownChildren: 0,
    notOwnChildren: 0,
    hasIncome: null,
    work: "",
    contractee: "",
    employerCompanyName: "",
    employerName: "",
    employerAddress: "",
    employerJobType: "",
    employerSalary: "",
    employerPayFrequency: "",
    reasonCannotWork: "",
    proofOfCannotWork: [],
    reason: "",
    otherReason: "",
    lastWork: "",
    lastEmployerCompanyName: "",
    lastEmployerName: "",
    lastEmployerAddress: "",
    lastEmployerWorkType: "",
    lastEmployerTimeAgo: "",
    proofOfIncomeLastEmployer: [],
    lastEmployerSalary: "",
    lastEmployerPayFrequency: "",
    activelyJobSeeking: null,
    jobSeekingMethod: "",
    proofOfJobSeeking: [],
    reasonNoJobSeeking: "",
    hasContract: null,
    proofOfContract: [],
    hasVehicle: null,
    vehicle: "",
    numberPlate: "",
    hasBoat: null,
    boatInformation: "",
    hasRentedHouse: null,
    hasBankAccount: null,
    bankAccountType: "",
    currentAccountStatements: [],
    savingsAccountStatements: [],
    hasMoreSourceOfIncome: null,
    moreSourceOfIncome: "",
    rentalMonthlyPrice: "",
    hasOwnHouse: null,
    notOwnHouse: "",
    houseAddress: "",
    payingMortgage: null,
    reasonNotPayingMortgage: "",
    houseMortgageDebt: "",
    houseRentalPrice: "",
    houseContribution: "",
    liveInDescription: "",
    houseResidents: [],
    proofOfRentalContract: [],
    proofOfRentalPayment: [],
    otherHousing: "",
    hasDependents: null,
    hasSignupFkp: null,
    signupFkpYear: 0,
    fkpPoints: 0,
    dependents: [],
    education: "",
    hasCertificate: null,
    certificateYear: 0,
    hasOtherCertificate: null,
    otherCertificateDescription: "",
    otherCertificateYear: "",
    hasCertificateWorkExperience: null,
    certificateWorkExperienceCompany: "",
    mobility: "",
    visibility: "",
    hearing: "",
    speakingAbility: "",
    hasAdiction: null,
    hasAdictionTreatment: null,
    adictionTreatmentCenter: "",
    hasDiseases: null,
    diseases: [],
    equipments: [],
    treatmentCenters: [],
    otherTreatmentCenter: "",
    hasPsychologicalLimitation: null,
    hasPsychologicalLimitationTreatment: null,
    psychologicalLimitationCenter: "",
    hasPsychologicalLimitationDiagnostic: null,
    psychologicalLimitationDiagnostician: "",
    psychologicalLimitationDiagnosticDate: null,
    hasPsychologicalLimitationDiagnosticReport: null,
    proofOfPsychologicalLimitationDiagnosticReport: [],
    hasMentalDisorder: null,
    hasMentalDisorderTreatment: null,
    hasMentalDisorderDiagnostic: null,
    mentalDisorderDiagnostician: "",
    mentalDisorderTreatmentCenter: "",
    mentalDisorderDiagnosticDate: null,
    hasMentalDisorderDiagnosticReport: null,
    proofOfMentalDisorderDiagnosticReport: [],
    hasPsychologicalLimitationChild: null,
    insurance: "",
    hasMedicalTreatment: null,
    medicalTreatment: "",
    medicalPractitionerName: "",
    otherMedicalTreatment: "",
    proofOfMedicalTreatment: [],
    useMedicalSupplies: null,
    medicalSupplies: "",
    hasWelfare: null,
    welfare: "",
    hasFuneralInsurance: null,
    funeralInsurance: "",
    created: null,
    updated: null,
    status: "INISIO",
    confirmation: false,
  };

  if (requestListData || !!requestListData.length) {
    const original = query.id
      ? requestListData.find((request) => request.id === +query.id)
      : requestListData.find((request) => request.type === 1);

    if (!!query?.reapply) {
      initialRequest = {
        ...initialRequest,
        reApply: !!query.reapply,
        id: original.id,
        edited: true,
        status: "MODIFIKA",
        created: original.created,
      };
    } else {
      initialRequest = {
        ...original,
        edited: !!query.id,
        reApply: !!query.reapply,
        status: "MODIFIKA",
        proofOfResident: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 1)
        ),
        proofOfPartnerIncome: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 2)
        ),
        proofOfMarriage: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 3)
        ),
        proofOfRegisteredPartner: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 4)
        ),
        proofOfDivorce: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 5)
        ),
        proofOfDeath: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 6)
        ),
        proofOfChildren: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 7)
        ),
        proofOfCannotWork: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 9)
        ),
        proofOfIncomeLastEmployer: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 15)
        ),
        proofOfJobSeeking: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 8)
        ),
        currentAccountStatements: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 10)
        ),
        savingsAccountStatements: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 11)
        ),
        proofOfMedicalTreatment: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 12)
        ),
        proofOfRentalContract: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 16)
        ),
        proofOfRentalPayment: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 17)
        ),
        proofOfPsychologicalLimitationDiagnosticReport:
          await convertImagesToFile(
            original?.images?.filter((image) => image.categoryId === 18)
          ),
        proofOfMentalDisorderDiagnosticReport: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 19)
        ),
        proofOfContract: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 20)
        ),
        proofOfVerdict: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 21)
        ),
        proofOfID: await convertImagesToFile(
          original?.images?.filter((image) => image.categoryId === 22)
        ),
      };
    }
  }

  return {
    props: {
      initialRequest,
    },
  };
};
