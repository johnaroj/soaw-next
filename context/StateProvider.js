import React, { createContext, useContext, useState } from 'react';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const data = useStateProvider();
    return (
        <StateContext.Provider value={data}>
            {children}
        </StateContext.Provider>
    )
};

export const useStateValue = () => useContext(StateContext);

function useStateProvider() {
    const [request, setRequest] = useState({
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
        hasIncome: null,
        work: '',
        contractee: '',
        employerCompanyName: '',
        employerName: '',
        employerAddress: '',
        employerJobType: '',
        employerSalary: '',
        employerPayFrequency: '',
        reasonCannotWork: '',
        proofOfCannotWork: [],
        reason: '',
        otherReason: '',
        lastWork: '',
        lastEmployerCompanyName: '',
        lastEmployerName: '',
        lastEmployerAddress: '',
        lastEmployerWorkType: '',
        lastEmployerTimeAgo: '',
        proofOfIncomeLastEmployer: [],
        lastEmployerSalary: '',
        lastEmployerPayFrequency: '',
        activelyJobSeeking: null,
        jobSeekingMethod: '',
        proofOfJobSeeking: [],
        reasonNoJobSeeking: '',
        hasContract: null,
        proofOfContract: [],
        hasVehicle: null,
        vehicle: '',
        numberPlate: '',
        hasBoat: null,
        boatInformation: '',
        hasRentedHouse: null,
        hasBankAccount: null,
        bankAccountType: '',
        currentAccountStatements: [],
        savingsAccountStatements: [],
        hasMoreSourceOfIncome: null,
        moreSourceOfIncome: '',
        rentalMonthlyPrice: '',
        hasOwnHouse: null,
        notOwnHouse: '',
        houseAddress: '',
        payingMortgage: null,
        reasonNotPayingMortgage: '',
        houseMortgageDebt: '',
        houseRentalPrice: '',
        houseContribution: '',
        liveInDescription: '',
        houseResidents: [],
        proofOfRentalContract: [],
        proofOfRentalPayment: [],
        otherHousing: '',
        hasDependents: null,
        hasSignupFkp: null,
        signupFkpYear: 0,
        fkpPoints: 0,
        dependents: [],
        education: '',
        hasCertificate: null,
        certificateYear: 0,
        hasOtherCertificate: null,
        otherCertificateDescription: '',
        otherCertificateYear: '',
        hasCertificateWorkExperience: null,
        certificateWorkExperienceCompany: '',
        mobility: '',
        visibility: '',
        hearing: '',
        speakingAbility: '',
        hasAdiction: null,
        hasAdictionTreatment: null,
        adictionTreatmentCenter: '',
        hasDiseases: null,
        diseases: [],
        equipments: [],
        treatmentCenters: [],
        otherTreatmentCenter: '',
        hasPsychologicalLimitation: null,
        hasPsychologicalLimitationTreatment: null,
        psychologicalLimitationCenter: '',
        hasPsychologicalLimitationDiagnostic: null,
        psychologicalLimitationDiagnostician: '',
        psychologicalLimitationDiagnosticDate: null,
        hasPsychologicalLimitationDiagnosticReport: null,
        proofOfPsychologicalLimitationDiagnosticReport: [],
        hasMentalDisorder: null,
        hasMentalDisorderTreatment: null,
        hasMentalDisorderDiagnostic: null,
        mentalDisorderDiagnostician: '',
        mentalDisorderTreatmentCenter: '',
        mentalDisorderDiagnosticDate: null,
        hasMentalDisorderDiagnosticReport: null,
        proofOfMentalDisorderDiagnosticReport: [],
        hasPsychologicalLimitationChild: null,
        insurance: '',
        hasMedicalTreatment: null,
        medicalTreatment: '',
        medicalPractitionerName: '',
        otherMedicalTreatment: '',
        proofOfMedicalTreatment: [],
        useMedicalSupplies: null,
        medicalSupplies: '',
        hasWelfare: null,
        welfare: '',
        hasFuneralInsurance: null,
        funeralInsurance: '',
        created: null,
        updated: null,
        status: '',
        confirmation: false
    })

    const resetRequest = () => {
        setRequest({
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
            hasIncome: null,
            work: '',
            contractee: '',
            employerCompanyName: '',
            employerName: '',
            employerAddress: '',
            employerJobType: '',
            employerSalary: '',
            employerPayFrequency: '',
            reasonCannotWork: '',
            proofOfCannotWork: [],
            reason: '',
            otherReason: '',
            lastWork: '',
            lastEmployerCompanyName: '',
            lastEmployerName: '',
            lastEmployerAddress: '',
            lastEmployerWorkType: '',
            lastEmployerTimeAgo: '',
            proofOfIncomeLastEmployer: [],
            lastEmployerSalary: '',
            lastEmployerPayFrequency: '',
            activelyJobSeeking: null,
            jobSeekingMethod: '',
            proofOfJobSeeking: [],
            reasonNoJobSeeking: '',
            hasContract: null,
            proofOfContract: [],
            hasVehicle: null,
            vehicle: '',
            numberPlate: '',
            hasBoat: null,
            boatInformation: '',
            hasRentedHouse: null,
            hasBankAccount: null,
            bankAccountType: '',
            currentAccountStatements: [],
            savingsAccountStatements: [],
            hasMoreSourceOfIncome: null,
            moreSourceOfIncome: '',
            rentalMonthlyPrice: '',
            hasOwnHouse: null,
            notOwnHouse: '',
            houseAddress: '',
            payingMortgage: null,
            reasonNotPayingMortgage: '',
            houseMortgageDebt: '',
            houseRentalPrice: '',
            houseContribution: '',
            liveInDescription: '',
            houseResidents: [],
            proofOfRentalContract: [],
            proofOfRentalPayment: [],
            otherHousing: '',
            hasDependents: null,
            hasSignupFkp: null,
            signupFkpYear: 0,
            fkpPoints: 0,
            dependents: [],
            education: '',
            hasCertificate: null,
            certificateYear: 0,
            hasOtherCertificate: null,
            otherCertificateDescription: '',
            otherCertificateYear: '',
            hasCertificateWorkExperience: null,
            certificateWorkExperienceCompany: '',
            mobility: '',
            visibility: '',
            hearing: '',
            speakingAbility: '',
            hasAdiction: null,
            hasAdictionTreatment: null,
            adictionTreatmentCenter: '',
            hasDiseases: null,
            diseases: [],
            equipments: [],
            treatmentCenters: [],
            otherTreatmentCenter: '',
            hasPsychologicalLimitation: null,
            hasPsychologicalLimitationTreatment: null,
            psychologicalLimitationCenter: '',
            hasPsychologicalLimitationDiagnostic: null,
            psychologicalLimitationDiagnostician: '',
            psychologicalLimitationDiagnosticDate: null,
            hasPsychologicalLimitationDiagnosticReport: null,
            proofOfPsychologicalLimitationDiagnosticReport: [],
            hasMentalDisorder: null,
            hasMentalDisorderTreatment: null,
            hasMentalDisorderDiagnostic: null,
            mentalDisorderDiagnostician: '',
            mentalDisorderTreatmentCenter: '',
            mentalDisorderDiagnosticDate: null,
            hasMentalDisorderDiagnosticReport: null,
            proofOfMentalDisorderDiagnosticReport: [],
            hasPsychologicalLimitationChild: null,
            insurance: '',
            hasMedicalTreatment: null,
            medicalTreatment: '',
            medicalPractitionerName: '',
            otherMedicalTreatment: '',
            proofOfMedicalTreatment: [],
            useMedicalSupplies: null,
            medicalSupplies: '',
            hasWelfare: null,
            welfare: '',
            hasFuneralInsurance: null,
            funeralInsurance: '',
            created: null,
            updated: null,
            status: '',
            confirmation: false
        })
    }

    return {
        request,
        setRequest,
        resetRequest,
    };

}