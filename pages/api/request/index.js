import prisma from "@/config/db";
import withProtect from "@/utils/withProtect";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
const handler = async (req, res) => {
  if (req.method === "GET") {
    let whereOr = undefined;
    let where = undefined;

    if (req.user?.id) {
      if (!where) {
        where = {
          userId: req.user.id,
        };
      }
    }
    if (req.query.search) {
      if (!whereOr) {
        whereOr = {
          OR: [
            { firstName: { contains: req.query.search } },
            { lastName: { contains: req.query.search } },
            { email: { contains: req.query.search } },
            { identificationNumber: { contains: req.query.search } },
          ],
        };
      }
    }

    try {
      const pageSize = Number(req.query.pageSize || 10);
      const page = Number(req.query.page || 0);

      // const count = await prisma.requests.count({
      //     where: {
      //         ...where,
      //         ...whereOr
      //     },
      // });

      const items = await prisma.requests.findMany({
        where: {
          NOT: { email: null },
        },
        distinct: ["email"],
        // take: pageSize,
        // skip: pageSize * page,
        include: {
          images: !!req.user.id,
        },
      });
      //console.log(items)

      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "POST") {
    try {
      const createdRequest = await prisma.requests.create({
        data: {
          userId: req.body.userId,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          registeredAddress: req.body.registeredAddress,
          registeredAddressNumber: req.body.registeredAddressNumber,
          currentAddress: req.body.currentAddress,
          currentAddressNumber: req.body.currentAddressNumber,
          placeOfBirth: req.body.placeOfBirth,
          hasDutchNationality: JSON.parse(req.body.hasDutchNationality),
          dateOfBirth: new Date(req.body.dateOfBirth),
          gender: req.body.gender,
          maritalStatus: req.body.maritalStatus,
          mobile: String(req.body.mobile),
          phone: String(req.body.phone),
          whatsapp: String(req.body.whatsapp),
          email: req.body.email,
          identificationNumber: String(req.body.identificationNumber),
          identificationType: req.body.identificationType,
          expiryDate: new Date(req.body.expiryDate),
          firstNamePartner: req.body.firstNamePartner,
          lastNamePartner: req.body.lastNamePartner,
          identificationNumberPartner: String(
            req.body.identificationNumberPartner
          ),
          hasRelationship: req.body.hasRelationship,
          livingTogether: req.body.livingTogether,
          livingTogetherAddress: req.body.livingTogetherAddress,
          livingTogetherAddressNumber: req.body.livingTogetherAddressNumber,
          hasChildren: req.body.hasChildren,
          ownChildren: req.body.ownChildren,
          notOwnChildren: req.body.notOwnChildren,
          hasIncome: req.body.hasIncome,
          work: req.body.work,
          contractee: req.body.contractee,
          employerCompanyName: req.body.employerCompanyName,
          employerName: req.body.employerName,
          employerAddress: req.body.employerAddress,
          employerJobType: req.body.employerJobType,
          employerSalary: req.body.employerSalary,
          employerPayFrequency: req.body.employerPayFrequency,
          reasonCannotWork: req.body.reasonCannotWork,
          reason: req.body.reason,
          otherReason: req.body.otherReason,
          lastWork: req.body.lastWork,
          lastEmployerCompanyName: req.body.lastEmployerCompanyName,
          lastEmployerName: req.body.lastEmployerName,
          lastEmployerAddress: req.body.lastEmployerAddress,
          lastEmployerWorkType: req.body.lastEmployerWorkType,
          lastEmployerTimeAgo: req.body.lastEmployerTimeAgo,
          lastEmployerSalary: req.body.lastEmployerSalary,
          lastEmployerPayFrequency: req.body.lastEmployerPayFrequency,
          activelyJobSeeking: req.body.activelyJobSeeking,
          jobSeekingMethod: req.body.jobSeekingMethod,
          reasonNoJobSeeking: req.body.reasonNoJobSeeking,
          hasContract: req.body.hasContract,
          hasVehicle: req.body.hasVehicle,
          vehicle: req.body.vehicle,
          numberPlate: req.body.numberPlate,
          hasBoat: req.body.hasBoat,
          boatInformation: req.body.boatInformation,
          hasRentedHouse: req.body.hasRentedHouse,
          hasBankAccount: req.body.mohasBankAccountbile,
          bankAccountType: req.body.bankAccountType,
          hasMoreSourceOfIncome: req.body.hasMoreSourceOfIncome,
          moreSourceOfIncome: req.body.moreSourceOfIncome,
          rentalMonthlyPrice: req.body.rentalMonthlyPrice,
          hasOwnHouse: req.body.hasOwnHouse,
          notOwnHouse: req.body.notOwnHouse,
          houseAddress: req.body.houseAddress,
          payingMortgage: req.body.payingMortgage,
          reasonNotPayingMortgage: req.body.reasonNotPayingMortgage,
          houseMortgageDebt: req.body.houseMortgageDebt,
          houseRentalPrice: req.body.houseRentalPrice,
          houseContribution: req.body.houseContribution,
          liveInDescription: req.body.liveInDescription,
          houseResidents: req.body.houseResidents.join(","),
          otherHousing: req.body.otherHousing,
          hasDependents: req.body.hasDependents,
          hasSignupFkp: req.body.hasSignupFkp,
          signupFkpYear: String(req.body.signupFkpYear),
          fkpPoints: String(req.body.fkpPoints),
          dependents: req.body.dependents.join(","),
          education: req.body.education,
          hasCertificate: req.body.hasCertificate,
          certificateYear: String(req.body.certificateYear),
          hasOtherCertificate: req.body.hasOtherCertificate,
          otherCertificateDescription: req.body.otherCertificateDescription,
          otherCertificateYear: req.body.otherCertificateYear,
          hasCertificateWorkExperience: req.body.hasCertificateWorkExperience,
          certificateWorkExperienceCompany:
            req.body.certificateWorkExperienceCompany,
          mobility: req.body.mobility,
          visibility: req.body.visibility,
          hearing: req.body.hearing,
          speakingAbility: req.body.speakingAbility,
          hasAdiction: req.body.hasAdiction,
          hasAdictionTreatment: req.body.hasAdictionTreatment,
          adictionTreatmentCenter: req.body.adictionTreatmentCenter,
          hasDiseases: req.body.hasDiseases,
          diseases: req.body.diseases.join(","),
          equipments: req.body.equipments.join(","),
          treatmentCenters: req.body.treatmentCenters.join(","),
          otherTreatmentCenter: req.body.otherTreatmentCenter,
          hasPsychologicalLimitation: req.body.hasPsychologicalLimitation,
          hasPsychologicalLimitationTreatment:
            req.body.hasPsychologicalLimitationTreatment,
          psychologicalLimitationCenter: req.body.psychologicalLimitationCenter,
          hasPsychologicalLimitationDiagnostic:
            req.body.hasPsychologicalLimitationDiagnostic,
          psychologicalLimitationDiagnostician:
            req.body.psychologicalLimitationDiagnostician,
          psychologicalLimitationDiagnosticDate: new Date(
            req.body.psychologicalLimitationDiagnosticDate
          ),
          hasPsychologicalLimitationDiagnosticReport:
            req.body.hasPsychologicalLimitationDiagnosticReport,
          hasMentalDisorder: req.body.hasMentalDisorder,
          hasMentalDisorderTreatment: req.body.hasMentalDisorderTreatment,
          hasMentalDisorderDiagnostic: req.body.hasMentalDisorderDiagnostic,
          mentalDisorderDiagnostician: req.body.mentalDisorderDiagnostician,
          mentalDisorderTreatmentCenter: req.body.mentalDisorderTreatmentCenter,
          mentalDisorderDiagnosticDate: new Date(
            req.body.mentalDisorderDiagnosticDate
          ),
          hasMentalDisorderDiagnosticReport:
            req.body.hasMentalDisorderDiagnosticReport,
          hasPsychologicalLimitationChild:
            req.body.hasPsychologicalLimitationChild,
          insurance: req.body.insurance,
          hasMedicalTreatment: req.body.hasMedicalTreatment,
          medicalTreatment: req.body.medicalTreatment,
          medicalPractitionerName: req.body.medicalPractitionerName,
          otherMedicalTreatment: req.body.otherMedicalTreatment,
          useMedicalSupplies: req.body.useMedicalSupplies,
          medicalSupplies: req.body.medicalSupplies,
          hasWelfare: req.body.hasWelfare,
          welfare: req.body.welfare,
          hasFuneralInsurance: req.body.hasFuneralInsurance,
          funeralInsurance: req.body.funeralInsurance,
          status: req.body.status,
          createdBy: req.body.createdBy,
          created: req.body.created,
          updatedBy: req.body.updatedBy,
          updated: req.body.updated,
          images: {
            create: req.body.images.map((image) => ({
              categoryId: image.categoryId,
              type: image.type,
              base64: image.base64,
              name: image.name,
            })),
          },
        },
      });

      res.status(201).json(createdRequest);
    } catch (error) {
      console.log(error.message);
      res.status(404).json({ success: false, message: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} is not allowed` });
  }
};

export default handler;
