
import prisma from '@/config/db'
import { admin } from '@/utils/rolesMiddleware';
import withProtect from '@/utils/withProtect';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};
const handler = async (req, res) => {
    if (req.method === 'GET') {

        let whereOr = undefined;
        let where = undefined;

        if (req.query.search) {
            if (!whereOr) {
                whereOr = {
                    OR: [
                        { firstName: { contains: req.query.search, }, },
                        { lastName: { contains: req.query.search }, },
                        { email: { contains: req.query.search }, },
                        { identificationNumber: { contains: req.query.search }, }
                    ]
                }
            }
        }

        try {
            const pageSize = Number(req.query.pageSize || 10);
            const page = Number(req.query.page || 0);

            const count = await prisma.requests.count({
                where: {
                    ...where,
                    ...whereOr
                },
            });

            const items = await prisma.requests.findMany({
                where: {
                    ...where,
                    ...whereOr
                },
                take: pageSize,
                skip: pageSize * page,
                include: {
                    images: true
                },
            })
            res.status(200).json({ items, page, count, pages: Math.ceil(count / pageSize) })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        } finally {
            await prisma.$disconnect()
        }
    }
    else if (req.method === 'POST') {
        try {
            // const {
            //     id,
            //     edited,
            //     userId,
            //     firstName,
            //     lastName,
            //     registeredAddress,
            //     registeredAddressNumber,
            //     currentAddress,
            //     currentAddressNumber,
            //     placeOfBirth,
            //     hasDutchNationality,
            //     dateOfBirth,
            //     gender,
            //     maritalStatus,
            //     phone1,
            //     phone2,
            //     whatsapp,
            //     email,
            //     identificationNumber,
            //     identificationType,
            //     expiryDate,
            //     firstNamePartner,
            //     lastNamePartner,
            //     identificationNumberPartner,
            //     hasRelationship,
            //     livingTogether,
            //     livingTogetherAddress,
            //     livingTogetherAddressNumber,
            //     hasChildren,
            //     ownChildren,
            //     notOwnChildren,
            //     hasIncome,
            //     work,
            //     contractee,
            //     employerCompanyName,
            //     employerName,
            //     employerAddress,
            //     employerJobType,
            //     employerSalary,
            //     employerPayFrequency,
            //     reasonCannotWork,
            //     reason,
            //     otherReason,
            //     lastWork,
            //     lastEmployerCompanyName,
            //     lastEmployerName,
            //     lastEmployerAddress,
            //     lastEmployerWorkType,
            //     lastEmployerTimeAgo,
            //     lastEmployerSalary,
            //     lastEmployerPayFrequency,
            //     activelyJobSeeking,
            //     jobSeekingMethod,
            //     reasonNoJobSeeking,
            //     hasContract,
            //     hasVehicle,
            //     vehicle,
            //     numberPlate,
            //     hasBoat,
            //     boatInformation,
            //     hasRentedHouse,
            //     hasBankAccount,
            //     bankAccountType,
            //     hasMoreSourceOfIncome,
            //     moreSourceOfIncome,
            //     rentalMonthlyPrice,
            //     hasOwnHouse,
            //     notOwnHouse,
            //     houseAddress,
            //     payingMortgage,
            //     reasonNotPayingMortgage,
            //     houseMortgageDebt,
            //     houseRentalPrice,
            //     houseContribution,
            //     liveInDescription,
            //     houseResidents,
            //     otherHousing,
            //     hasDependents,
            //     hasSignupFkp,
            //     signupFkpYear,
            //     fkpPoints,
            //     dependents,
            //     education,
            //     hasCertificate,
            //     certificateYear,
            //     hasOtherCertificate,
            //     otherCertificateDescription,
            //     otherCertificateYear,
            //     hasCertificateWorkExperience,
            //     certificateWorkExperienceCompany,
            //     mobility,
            //     visibility,
            //     hearing,
            //     speakingAbility,
            //     hasAdiction,
            //     hasAdictionTreatment,
            //     adictionTreatmentCenter,
            //     hasDiseases,
            //     diseases,
            //     equipments,
            //     treatmentCenters,
            //     otherTreatmentCenter,
            //     hasPsychologicalLimitation,
            //     hasPsychologicalLimitationTreatment,
            //     psychologicalLimitationCenter,
            //     hasPsychologicalLimitationDiagnostic,
            //     psychologicalLimitationDiagnostician,
            //     psychologicalLimitationDiagnosticDate,
            //     hasPsychologicalLimitationDiagnosticReport,
            //     hasMentalDisorder,
            //     hasMentalDisorderTreatment,
            //     hasMentalDisorderDiagnostic,
            //     mentalDisorderDiagnostician,
            //     mentalDisorderTreatmentCenter,
            //     mentalDisorderDiagnosticDate,
            //     hasMentalDisorderDiagnosticReport,
            //     hasPsychologicalLimitationChild,
            //     insurance,
            //     hasMedicalTreatment,
            //     medicalTreatment,
            //     medicalPractitionerName,
            //     otherMedicalTreatment,
            //     useMedicalSupplies,
            //     medicalSupplies,
            //     hasWelfare,
            //     welfare,
            //     hasFuneralInsurance,
            //     funeralInsurance,
            //     status,
            // } = req.body
            const { id, ...request } = req.body;
            const createdRequest = await prisma.requests.create({
                data: {
                    ...request,
                    houseResidents: request.houseResidents.join(', '),
                    diseases: request.diseases.join(', '),
                    equipments: request.equipments.join(', '),
                    treatmentCenters: request.treatmentCenters.join(', '),
                    createdBy: request.email,
                    updatedBy: request.email,
                    images: {
                        create: request.images.map(image => ({
                            category: { connect: { id: image.categoryId } },
                            type: image.type,
                            base64: image.base64,
                            name: image.name
                        }))
                    }
                }
            })

            res.status(201).json(createdRequest)
        } catch (error) {
            console.log(error.message)
            res.status(404).json({ success: false, message: error.message })
        } finally {
            await prisma.$disconnect();
        }


    }
    else {
        res.setHeader('Allow', ['POST', 'GET'])
        res.status(405).json({ success: false, message: `Method ${req.method} is not allowed` })
    }

}

export default withProtect(admin(handler))