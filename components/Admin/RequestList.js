import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx';
import MaterialTable, { Column } from "@material-table/core";
import { useMediaQuery, Grid, Select, MenuItem } from '@mui/material'
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles'
import { Alert } from '@mui/material/Alert';
import Request from 'components/Request';


const RequestList = props => {
    const { className, ...rest } = props;
    const [isError, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [type, setType] = useState(0);
    const tableRef = useRef();

    const useStyles = makeStyles(theme => ({
        root: {},
    }))
    const classes = useStyles();


    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
        return () => { setMounted(false) }
    }, [])
    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Grid container spacing={isMd ? 4 : 2}>
                {isError ? <Grid item xs={12}><Alert variant='outlined' severity='error'>{errorMessage}</Alert></Grid> : (mounted &&
                    <>
                        <Grid item xs={12}>
                            <MaterialTable
                                tableRef={tableRef}
                                title="Lista di Pedido"
                                columns={[
                                    { title: 'Fam', field: 'lastName' },
                                    { title: 'Nomber', field: 'firstName' },
                                    { title: 'Adrès kaminda ta registrá ofisialmente na Kranshi', field: 'registeredAddress' },
                                    { title: 'Number di adrès na Kranshi', field: 'registeredAddressNumber' },
                                    { title: 'Adrès kaminda bo ta biba aktualmente', field: 'currentAddress', hidden: true, export: true },
                                    { title: 'Number di adrès aktual', field: 'currentAddressNumber', hidden: true, export: true },
                                    { title: 'Pais di nasementu', field: 'placeOfBirth' },
                                    { title: 'Number di identifikashon', field: 'identificationNumber' },
                                    { title: 'Status', field: 'status', export: true },
                                    { title: 'Nashonalidat Hulandes', field: 'hasDutchNationality', hidden: true, export: true },
                                    { title: 'Prueba di Residensia', field: 'proofOfResident', hidden: true, export: true },
                                    { title: 'Prueba di ID', field: 'proofOfID', hidden: true, export: true },
                                    { title: 'Fecha di nasementu', field: 'dateOfBirth', hidden: true, export: true },
                                    { title: 'Sekso', field: 'gender', hidden: true, export: true },
                                    { title: 'Estado sivil', field: 'maritalStatus', hidden: true, export: true },
                                    { title: 'Number di telefòn di selular', field: 'phone1', hidden: true, export: true },
                                    { title: 'Number di telefòn di kas', field: 'phone2', hidden: true, export: true },
                                    { title: 'Number di telefòn di whatsapp', field: 'whatsapp', hidden: true, export: true },
                                    { title: 'E-mail', field: 'email', hidden: true, export: true },
                                    { title: 'Ki tipo di identifikashon lo bo bai usa, pa identifiká bo mes na kas di bario?', field: 'identificationType', hidden: true, export: true },
                                    { title: 'Fecha di vensementu', field: 'expiryDate', hidden: true, export: true },
                                    { title: 'Fam di pareha', field: 'firstNamePartner', hidden: true, export: true },
                                    { title: 'Nòmber di pareha', field: 'lastNamePartner', hidden: true, export: true },
                                    { title: 'Number di identifikashon riba sédula di pareha', field: 'identificationNumberPartner', hidden: true, export: true },
                                    { title: 'Prueba di entrada di bo pareha', field: 'proofOfPartnerIncome', hidden: true, export: true },
                                    { title: 'Prueba di matrimonio', field: 'proofOfMarriage', hidden: true, export: true },
                                    { title: 'Prueba di divorsio', field: 'proofOfDivorce', hidden: true, export: true },
                                    { title: 'Prueba di e veredicto', field: 'proofOfVerdict', hidden: true, export: true },
                                    { title: 'Prueba di fayesementu di bo kasá', field: 'proofOfDeath', hidden: true, export: true },
                                    { title: 'Bo ta den un relashon aktualmente?', field: 'hasRelationship', hidden: true, export: true },
                                    { title: 'Bo ta biba huntu ku bo pareha?', field: 'livingTogether', hidden: true, export: true },
                                    { title: 'Na kua adrès boso ta biba?', field: 'livingTogetherAddress', hidden: true, export: true },
                                    { title: 'Na kua number di adrès boso ta biba?', field: 'livingTogetherAddressNumber', hidden: true, export: true },
                                    { title: 'Bo tin yu?', field: 'hasChildren', hidden: true, export: true },
                                    { title: 'Akto di nasementu di bo yu(nan)/buki di famia', field: 'proofOfChildren', hidden: true, export: true },
                                    { title: 'Propio yu', field: 'ownChildren', hidden: true, export: true },
                                    { title: 'Yu di kriansa', field: 'notOwnChildren', hidden: true, export: true },
                                    { title: 'Bo tin entrada aktualmente?', field: 'hasIncome', hidden: true, export: true },
                                    { title: 'Kon bo a yega na e entrada aki ?', field: 'work', hidden: true, export: true },
                                    { title: 'Mi ta kue djòp', field: 'contractee', hidden: true, export: true },
                                    { title: 'Nòmber di kompania', field: 'employerCompanyName', hidden: true, export: true },
                                    { title: 'Nòmber i fam di e persona  dunadó di trabou', field: 'employerName', hidden: true, export: true },
                                    { title: 'Adrès di e trabou', field: 'employerAddress', hidden: true, export: true },
                                    { title: 'Tipo di trabou/job bo ta hasi', field: 'employerJobType', hidden: true, export: true },
                                    { title: 'Kuantu sèn bo tabata risibí pa bo trabou?', field: 'employerSalary', hidden: true, export: true },
                                    { title: 'Ku ki frekuensia bo ta risibí e sèn aki?', field: 'employerPayFrequency', hidden: true, export: true },
                                    { title: 'Kiko ta e motibu ku bo no por traha?', field: 'reasonCannotWork', hidden: true, export: true },
                                    { title: 'Prueba ku bo no por traha', field: 'proofOfCannotWork', hidden: true, export: true },
                                    { title: 'Motibu di petishon', field: 'reason', hidden: true, export: true },
                                    { title: 'Por fabor amplia bo motibu di petishon', field: 'otherReason', hidden: true, export: true },
                                    { title: 'Último bia ku bo a traha tabata pa kua persona òf kompania?', field: 'lastWork', hidden: true, export: true },
                                    { title: 'Nòmber di kompania', field: 'lastEmployerCompanyName', hidden: true, export: true },
                                    { title: 'Nòmber i fam di èks dunadó di trabou', field: 'lastEmployerName', hidden: true, export: true },
                                    { title: 'Adrès di e último lugá di trabou', field: 'lastEmployerAddress', hidden: true, export: true },
                                    { title: 'Ki tipo di trabou bo a traha último biaha?', field: 'lastEmployerWorkType', hidden: true, export: true },
                                    { title: 'Kuantu tempu pasá esaki tabata?', field: 'lastEmployerTimeAgo', hidden: true, export: true },
                                    { title: 'Si bo tin mas ku 1 aña ku bo a pèrdè bo trabou, ‘upload’ bo deklarashon di entrada.', field: 'proofOfIncomeLastEmployer', hidden: true, export: true },
                                    { title: 'Kuantu sèn bo tabata gana na bo último trabou?', field: 'lastEmployerSalary', hidden: true, export: true },
                                    { title: 'Ku ki frekuensia bo ta risibí e sèn aki?', field: 'lastEmployerPayFrequency', hidden: true, export: true },
                                    { title: 'Bo ta buska trabou aktivamente?', field: 'activelyJobSeeking', hidden: true, export: true },
                                    { title: 'Kon bo ta solisitá?', field: 'jobSeekingMethod', hidden: true, export: true },
                                    { title: 'Karta(nan) di solisitut', field: 'proofOfJobSeeking', hidden: true, export: true },
                                    { title: 'Dikon nò?', field: 'reasonNoJobSeeking', hidden: true, export: true },
                                    { title: 'Kontrakt', field: 'hasContract', hidden: true, export: true },
                                    { title: 'Prueba di Kontrakt', field: 'proofOfContract', hidden: true, export: true },
                                    { title: 'Bo tin vehíkulo?', field: 'hasVehicle', hidden: true, export: true },
                                    { title: 'Kiko ta e tipo di vehíkulo', field: 'vehicle', hidden: true, export: true },
                                    { title: 'Kiko ta e plachi number', field: 'numberPlate', hidden: true, export: true },
                                    { title: 'Bo tin boto', field: 'hasBoat', hidden: true, export: true },
                                    { title: 'Kiko ta su datos di registrashon?', field: 'boatInformation', hidden: true, export: true },
                                    { title: 'Bo tin kas ta hür', field: 'hasRentedHouse', hidden: true, export: true },
                                    { title: 'Kuantu esaki ta generá pa luna?', field: 'rentalMonthlyPrice', hidden: true, export: true },
                                    { title: 'Bo tin kuenta di banko?', field: 'hasBankAccount', hidden: true, export: true },
                                    { title: 'Ki tipo di kuenta di banko bo tin?', field: 'bankAccountType', hidden: true, export: true },
                                    { title: 'Kuenta koriente di bo banko', field: 'currentAccountStatements', hidden: true, export: true },
                                    { title: 'Kuenta di spar di bo banko', field: 'savingsAccountStatements', hidden: true, export: true },
                                    { title: 'Bo tin mas fuente di entrada?', field: 'hasMoreSourceOfIncome', hidden: true, export: true },
                                    { title: 'Por fabor spesifiká esaki', field: 'moreSourceOfIncome', hidden: true, export: true },
                                    { title: 'Bo ta biba den bo mes kas?', field: 'hasOwnHouse', hidden: true, export: true },
                                    { title: 'Kas no propio', field: 'notOwnHouse', hidden: true, export: true },
                                    { title: 'Adrès', field: 'houseAddress', hidden: true, export: true },
                                    { title: 'Bo ta paga hipotek?', field: 'payingMortgage', hidden: true, export: true },
                                    { title: 'Dikon nò?', field: 'reasonNotPayingMortgage', hidden: true, export: true },
                                    { title: 'Kuantu bo ta paga pa luna na hipotek?', field: 'houseMortgageDebt', hidden: true, export: true },
                                    { title: 'Kuantu sèn bo ta paga na hür?', field: 'houseRentalPrice', hidden: true, export: true },
                                    { title: 'Kiko ta bo kontribushon pa luna aki?', field: 'houseContribution', hidden: true, export: true },
                                    { title: 'Por fabor spesifiká na unda bo ta kedando', field: 'liveInDescription', hidden: true, export: true },
                                    { title: 'Ken mas ta biba den kas kubo?', field: 'houseResidents', hidden: true, export: true },
                                    { title: 'kòntrakt di hur of apoderashon', field: 'proofOfRentalContract', hidden: true, export: true },
                                    { title: 'prueba di pago', field: 'proofOfRentalPayment', hidden: true, export: true },
                                    { title: 'Otro', field: 'otherHousing', hidden: true, export: true },
                                    { title: 'Tin mas persona ta depende di bo finansieramente?', field: 'hasDependents', hidden: true, export: true },
                                    { title: 'Bo ta inskribí na FKP pa bo risibí un kas?', field: 'hasSignupFkp', hidden: true, export: true },
                                    { title: 'For di ki aña?', field: 'signupFkpYear', hidden: true, export: true },
                                    { title: 'Kuantu punto bo tin di spar?', field: 'fkpPoints', hidden: true, export: true },
                                    { title: 'Tin mas persona ta depende di bo finansieramente?', field: 'dependents', hidden: true, export: true },
                                    { title: 'Kua ta e nivel di skol mas haltu ku bo a kaba?', field: 'education', hidden: true, export: true },
                                    { title: 'Bo tin diploma?', field: 'hasCertificate', hidden: true, export: true },
                                    { title: 'Na ki aña bo a risibí e diploma?', field: 'certificateYear', hidden: true, export: true },
                                    { title: 'hasOtherCertificate', field: 'hasOtherCertificate', hidden: true, export: true },
                                    { title: 'Por fabor indiká sertifikado di kua kurso/workshòp', field: 'otherCertificateDescription', hidden: true, export: true },
                                    { title: 'Na ki aña bo a risibí e sertifikado?', field: 'otherCertificateYear', hidden: true, export: true },
                                    { title: 'Bo a yega di traha den e sektor ku bo a studia aden?', field: 'hasCertificateWorkExperience', hidden: true, export: true },
                                    { title: 'Na kua kompania?', field: 'certificateWorkExperienceCompany', hidden: true, export: true },
                                    { title: 'Kon bo mobilidat ta?', field: 'mobility', hidden: true, export: true },
                                    { title: 'Kon bo bista ta?', field: 'visibility', hidden: true, export: true },
                                    { title: 'Kon bo oidu ta?', field: 'hearing', hidden: true, export: true },
                                    { title: 'Kon bo abla ta?', field: 'speakingAbility', hidden: true, export: true },
                                    { title: 'Bo ta sufri di un òf mas adikshon?', field: 'hasAdiction', hidden: true, export: true },
                                    { title: 'Bo ta hañando yudansa di un instansia?', field: 'hasAdictionTreatment', hidden: true, export: true },
                                    { title: 'Por fabor indiká kua instansia', field: 'adictionTreatmentCenter', hidden: true, export: true },
                                    { title: 'Bo ta sufri di algun malesa', field: 'hasDiseases', hidden: true, export: true },
                                    { title: 'malesa', field: 'diseases', hidden: true, export: true },
                                    { title: 'Dor di bo limitashon bo ta hasi huzo di', field: 'equipments', hidden: true, export: true },
                                    { title: 'Kua instansia ta guia bo den esaki?', field: 'treatmentCenters', hidden: true, export: true },
                                    { title: 'Otro instansia', field: 'otherTreatmentCenter', hidden: true, export: true },
                                    { title: 'Bo tin problema sígiko?', field: 'hasPsychologicalLimitation', hidden: true, export: true },
                                    { title: 'Bo ta haña yudansa di un instansia?', field: 'hasPsychologicalLimitationTreatment', hidden: true, export: true },
                                    { title: 'Por fabor indiká kua instansia?', field: 'psychologicalLimitationCenter', hidden: true, export: true },
                                    { title: 'Tin un diagnóstiko?', field: 'hasPsychologicalLimitationDiagnostic', hidden: true, export: true },
                                    { title: 'Ken a hasi e diagnóstiko aki?', field: 'psychologicalLimitationDiagnostician', hidden: true, export: true },
                                    { title: 'echa di diagnóstiko', field: 'psychologicalLimitationDiagnosticDate', hidden: true, export: true },
                                    { title: 'Tin un rapòrt di e diagnóstiko?', field: 'hasPsychologicalLimitationDiagnosticReport', hidden: true, export: true },
                                    { title: 'Karta di diagnóstiko di bo médiko', field: 'proofOfPsychologicalLimitationDiagnosticReport', hidden: true, export: true },
                                    { title: 'Bo tin retardashon mental ?', field: 'hasMentalDisorder', hidden: true, export: true },
                                    { title: 'Bo ta haña yudansa di un instansia?', field: 'hasMentalDisorderTreatment', hidden: true, export: true },
                                    { title: 'Tin un diagnóstiko?', field: 'hasMentalDisorderDiagnostic', hidden: true, export: true },
                                    { title: 'Ken a hasi e diagnóstiko aki?', field: 'mentalDisorderDiagnostician', hidden: true, export: true },
                                    { title: 'Por fabor indiká kua instansia?', field: 'mentalDisorderTreatmentCenter', hidden: true, export: true },
                                    { title: 'Fecha di diagnóstiko', field: 'mentalDisorderDiagnosticDate', hidden: true, export: true },
                                    { title: 'Tin un rapòrt di e diagnóstiko?', field: 'hasMentalDisorderDiagnosticReport', hidden: true, export: true },
                                    { title: 'Karta di diagnóstiko di bo médiko', field: 'proofOfMentalDisorderDiagnosticReport', hidden: true, export: true },
                                    { title: 'Bo tin yu ku limitashon mental?', field: 'hasPsychologicalLimitationChild', hidden: true, export: true },
                                    { title: 'Ki tipo di seguro bo tin?', field: 'insurance', hidden: true, export: true },
                                    { title: 'Bo ta bou di tratamentu di un médiko òf paramédiko?', field: 'hasMedicalTreatment', hidden: true, export: true },
                                    { title: 'Ki tipo di médiko òf paramédiko?', field: 'medicalTreatment', hidden: true, export: true },
                                    { title: 'Ki ta e nòmber di e médiko òf paramédiko?', field: 'medicalPractitionerName', hidden: true, export: true },
                                    { title: 'Karta di bo specialista', field: 'proofOfMedicalTreatment', hidden: true, export: true },
                                    { title: 'Bo ta usa medikamentu?', field: 'useMedicalSupplies', hidden: true, export: true },
                                    { title: 'Ki tipo di medikamentu?', field: 'medicalSupplies', hidden: true, export: true },
                                    { title: 'Bo ta risibí yudansa sosial pa motibu di bo estado di salú?gender', field: 'hasWelfare', hidden: true, export: true },
                                    { title: 'Ki tipo di yudansa?', field: 'welfare', hidden: true, export: true },
                                    { title: 'Bo tin seguro di entiero?', field: 'hasFuneralInsurance', hidden: true, export: true },
                                    { title: 'Por fabor indiká na kua kompania', field: 'funeralInsurance', hidden: true, export: true },
                                    { title: 'Fecha di petishon', field: 'created', export: true, render: rowData => rowData.created.slice(0, 10) },
                                ]
                                }
                                data={
                                    query => new Promise((resolve, reject) => {
                                        setError(false);
                                        let pagination = null;
                                        //setLoading(true);
                                        fetch(`${process.env.REACT_APP_API}/api/request?type=${type}&pageSize=${query.pageSize}&page=${query.page + 1}${query.search && `&search=${query.search}`}`)
                                            .then(response => {
                                                pagination = JSON.parse(response.headers.get('X-Pagination'))
                                                return response.json()
                                            })
                                            .then(result => {
                                                //setLoading(
                                                resolve({
                                                    data: result,
                                                    page: pagination.CurrentPage - 1,
                                                    totalCount: pagination.TotalCount
                                                })
                                            }).catch(err => {
                                                //setLoading(false);
                                                setError(true);
                                                setErrorMessage(err)
                                            })

                                    })
                                }
                                detailPanel={data => {
                                    return <Request id={data.rowData.id} />
                                }}
                                options={{
                                    exportButton: true,
                                    search: true
                                }}
                                components={{
                                    Action: props => (
                                        <div style={{
                                            margin: '10px 10px 10px 2px',
                                            display: 'inline-flex',
                                            width: "150px"
                                        }}>
                                            <Select
                                                labelId="typelbl"
                                                id="typeSelect"
                                                value={type}
                                                onChange={(event) => {
                                                    setType(event.target.value);
                                                    props.action.onClick()
                                                }}
                                            >
                                                <MenuItem value={0}>
                                                    <em>Select Type</em>
                                                </MenuItem>
                                                <MenuItem value={1}>Onderstant</MenuItem>
                                                <MenuItem value={2}>Voedselpakket</MenuItem>
                                                <MenuItem value={3}>Karchi sosial</MenuItem>
                                            </Select>
                                        </div>
                                    )
                                }}
                                actions={[
                                    {
                                        onClick: () => tableRef.current && tableRef.current.onQueryChange(),
                                        isFreeAction: true
                                        // onClick: (event, rowData) => alert("You saved " + rowData.name),
                                    }
                                ]}
                            />
                        </Grid>
                    </>
                )}
            </Grid>
        </div>
    )
}

export default RequestList
