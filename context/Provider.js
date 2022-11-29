import React, { createContext, useContext, useState } from "react";

export const Context = createContext();

export const Provider = ({ children }) => {
  const data = useRequestProvider();
  return <Context.Provider value={data}>{children}</Context.Provider>;
};

export const useRequest = () => useContext(Context);

function useRequestProvider() {
  const [allRequests, setAllRequests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [request, setRequest] = useState({
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
    proofOfMedicalTreatment: [],
    useMedicalSupplies: null,
    medicalSupplies: "",
    hasWelfare: null,
    welfare: "",
    hasFuneralInsurance: null,
    funeralInsurance: "",
    created: null,
    updated: null,
    status: "",
    confirmation: false,
  });

  const updateRequest = async (data) => {
    try {
      setLoading(true);
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/request/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const updated = await result.json();
      setRequest((prev) => ({ ...updated, prev }));
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
      setSuccess(false);
    }
  };

  const addRequest = async (data) => {
    try {
      setLoading(true);
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      setRequest(result);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
      setSuccess(false);
    }
  };

  const getAllRequests = async (search, page) => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/request?page=${page}`;
      if (search) {
        url = url + `&search=${search}`;
      }
      const result = await fetch(url).then((result) => result.json());
      setAllRequests(result);
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
      setSuccess(false);
    }
  };

  const reset = () => {
    setRequest({
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
      proofOfMedicalTreatment: [],
      useMedicalSupplies: null,
      medicalSupplies: "",
      hasWelfare: null,
      welfare: "",
      hasFuneralInsurance: null,
      funeralInsurance: "",
      created: null,
      updated: null,
      status: "",
      confirmation: false,
    });
  };

  return {
    allRequests,
    setAllRequests,
    loading,
    error,
    success,
    request,
    addRequest,
    getAllRequests,
    updateRequest,
    setRequest,
    reset,
  };
}
