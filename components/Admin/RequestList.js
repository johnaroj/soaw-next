import React from 'react'
import clsx from 'clsx';
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';

const useStyles = makeStyles({
    root: {
        '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
    }
});

const RequestList = ({ requests, setPage, error, loading, setSearch }) => {

    const classes = useStyles();
    const onFilterChange = React.useCallback((filterModel) => {
        // Here you save the data you need from the filter model
        setSearch(filterModel.quickFilterValues.toString());
    }, []);

    return (

        <Grid item xs={12}>
            <DataGrid
                className={classes.root}
                autoHeight
                columns={[
                    { headerName: 'Fam', field: 'lastName' },
                    { headerName: 'Nomber', field: 'firstName' },
                    { headerName: 'Adrès kaminda ta registrá ofisialmente na Kranshi', field: 'registeredAddress' },
                    { headerName: 'Number di adrès na Kranshi', field: 'registeredAddressNumber' },
                    { headerName: 'Adrès kaminda bo ta biba aktualmente', field: 'currentAddress', hideable: true, export: true },
                    { headerName: 'Number di adrès aktual', field: 'currentAddressNumber', hideable: true, export: true },
                    { headerName: 'Pais di nasementu', field: 'placeOfBirth' },
                    { headerName: 'Number di identifikashon', field: 'identificationNumber' },
                    { headerName: 'Status', field: 'status', export: true },
                    { headerName: 'Nashonalidat Hulandes', field: 'hasDutchNationality', hideable: true, export: true, valueGetter: params => params.row.hasDutchNationality ? "Sí" : "Nó" },
                    { headerName: 'Prueba di Residensia', field: 'proofOfResident', hideable: true, export: true },
                    { headerName: 'Prueba di ID', field: 'proofOfID', hideable: true, export: true },
                    { headerName: 'Fecha di nasementu', field: 'dateOfBirth', hideable: true, export: true },
                    { headerName: 'Sekso', field: 'gender', hideable: true, export: true },
                    { headerName: 'Estado sivil', field: 'maritalStatus', hideable: true, export: true },
                    { headerName: 'Number di telefòn di selular', field: 'phone1', hideable: true, export: true },
                    { headerName: 'Number di telefòn di kas', field: 'phone2', hideable: true, export: true },
                    { headerName: 'Number di telefòn di whatsapp', field: 'whatsapp', hideable: true, export: true },
                    { headerName: 'E-mail', field: 'email', hideable: true, export: true },
                    { headerName: 'Ki tipo di identifikashon lo bo bai usa, pa identifiká bo mes na kas di bario?', field: 'identificationType', hideable: true, export: true },
                    { headerName: 'Fecha di vensementu', field: 'expiryDate', hideable: true, export: true },
                    { headerName: 'Fam di pareha', field: 'firstNamePartner', hideable: true, export: true },
                    { headerName: 'Nòmber di pareha', field: 'lastNamePartner', hideable: true, export: true },
                    { headerName: 'Number di identifikashon riba sédula di pareha', field: 'identificationNumberPartner', hideable: true, export: true },
                    { headerName: 'Prueba di entrada di bo pareha', field: 'proofOfPartnerIncome', hideable: true, export: true },
                    { headerName: 'Prueba di matrimonio', field: 'proofOfMarriage', hideable: true, export: true },
                    { headerName: 'Prueba di divorsio', field: 'proofOfDivorce', hideable: true, export: true },
                    { headerName: 'Prueba di e veredicto', field: 'proofOfVerdict', hideable: true, export: true },
                    { headerName: 'Prueba di fayesementu di bo kasá', field: 'proofOfDeath', hideable: true, export: true },
                    { headerName: 'Bo ta den un relashon aktualmente?', field: 'hasRelationship', hideable: true, export: true, valueGetter: params => params.row.hasRelationship ? "Sí" : "Nó" },
                    { headerName: 'Bo ta biba huntu ku bo pareha?', field: 'livingTogether', hideable: true, export: true },
                    { headerName: 'Na kua adrès boso ta biba?', field: 'livingTogetherAddress', hideable: true, export: true },
                    { headerName: 'Na kua number di adrès boso ta biba?', field: 'livingTogetherAddressNumber', hideable: true, export: true },
                    { headerName: 'Bo tin yu?', field: 'hasChildren', hideable: true, export: true, valueGetter: params => params.row.hasChildren ? "Sí" : "Nó" },
                    { headerName: 'Akto di nasementu di bo yu(nan)/buki di famia', field: 'proofOfChildren', hideable: true, export: true },
                    { headerName: 'Propio yu', field: 'ownChildren', hideable: true, export: true },
                    { headerName: 'Yu di kriansa', field: 'notOwnChildren', hideable: true, export: true },
                    { headerName: 'Bo tin entrada aktualmente?', field: 'hasIncome', hideable: true, export: true, valueGetter: params => params.row.hasIncome ? "Sí" : "Nó" },
                    { headerName: 'Kon bo a yega na e entrada aki ?', field: 'work', hideable: true, export: true },
                    { headerName: 'Mi ta kue djòp', field: 'contractee', hideable: true, export: true },
                    { headerName: 'Nòmber di kompania', field: 'employerCompanyName', hideable: true, export: true },
                    { headerName: 'Nòmber i fam di e persona  dunadó di trabou', field: 'employerName', hideable: true, export: true },
                    { headerName: 'Adrès di e trabou', field: 'employerAddress', hideable: true, export: true },
                    { headerName: 'Tipo di trabou/job bo ta hasi', field: 'employerJobType', hideable: true, export: true },
                    { headerName: 'Kuantu sèn bo tabata risibí pa bo trabou?', field: 'employerSalary', hideable: true, export: true },
                    { headerName: 'Ku ki frekuensia bo ta risibí e sèn aki?', field: 'employerPayFrequency', hideable: true, export: true },
                    { headerName: 'Kiko ta e motibu ku bo no por traha?', field: 'reasonCannotWork', hideable: true, export: true },
                    { headerName: 'Prueba ku bo no por traha', field: 'proofOfCannotWork', hideable: true, export: true },
                    { headerName: 'Motibu di petishon', field: 'reason', hideable: true, export: true },
                    { headerName: 'Por fabor amplia bo motibu di petishon', field: 'otherReason', hideable: true, export: true },
                    { headerName: 'Último bia ku bo a traha tabata pa kua persona òf kompania?', field: 'lastWork', hideable: true, export: true },
                    { headerName: 'Nòmber di kompania', field: 'lastEmployerCompanyName', hideable: true, export: true },
                    { headerName: 'Nòmber i fam di èks dunadó di trabou', field: 'lastEmployerName', hideable: true, export: true },
                    { headerName: 'Adrès di e último lugá di trabou', field: 'lastEmployerAddress', hideable: true, export: true },
                    { headerName: 'Ki tipo di trabou bo a traha último biaha?', field: 'lastEmployerWorkType', hideable: true, export: true },
                    { headerName: 'Kuantu tempu pasá esaki tabata?', field: 'lastEmployerTimeAgo', hideable: true, export: true },
                    { headerName: 'Si bo tin mas ku 1 aña ku bo a pèrdè bo trabou, ‘upload’ bo deklarashon di entrada.', field: 'proofOfIncomeLastEmployer', hideable: true, export: true },
                    { headerName: 'Kuantu sèn bo tabata gana na bo último trabou?', field: 'lastEmployerSalary', hideable: true, export: true },
                    { headerName: 'Ku ki frekuensia bo ta risibí e sèn aki?', field: 'lastEmployerPayFrequency', hideable: true, export: true },
                    { headerName: 'Bo ta buska trabou aktivamente?', field: 'activelyJobSeeking', hideable: true, export: true },
                    { headerName: 'Kon bo ta solisitá?', field: 'jobSeekingMethod', hideable: true, export: true },
                    { headerName: 'Karta(nan) di solisitut', field: 'proofOfJobSeeking', hideable: true, export: true },
                    { headerName: 'Dikon nò?', field: 'reasonNoJobSeeking', hideable: true, export: true },
                    { headerName: 'Kontrakt', field: 'hasContract', hideable: true, export: true, valueGetter: params => params.row.hasContract ? "Sí" : "Nó" },
                    { headerName: 'Prueba di Kontrakt', field: 'proofOfContract', hideable: true, export: true },
                    { headerName: 'Bo tin vehíkulo?', field: 'hasVehicle', hideable: true, export: true, valueGetter: params => params.row.hasVehicle ? "Sí" : "Nó" },
                    { headerName: 'Kiko ta e tipo di vehíkulo', field: 'vehicle', hideable: true, export: true },
                    { headerName: 'Kiko ta e plachi number', field: 'numberPlate', hideable: true, export: true },
                    { headerName: 'Bo tin boto', field: 'hasBoat', hideable: true, export: true, valueGetter: params => params.row.hasBoat ? "Sí" : "Nó" },
                    { headerName: 'Kiko ta su datos di registrashon?', field: 'boatInformation', hideable: true, export: true },
                    { headerName: 'Bo tin kas ta hür', field: 'hasRentedHouse', hideable: true, export: true, valueGetter: params => params.row.hasRentedHouse ? "Sí" : "Nó" },
                    { headerName: 'Kuantu esaki ta generá pa luna?', field: 'rentalMonthlyPrice', hideable: true, export: true },
                    { headerName: 'Bo tin kuenta di banko?', field: 'hasBankAccount', hideable: true, export: true, valueGetter: params => params.row.hasBankAccount ? "Sí" : "Nó" },
                    { headerName: 'Ki tipo di kuenta di banko bo tin?', field: 'bankAccountType', hideable: true, export: true },
                    { headerName: 'Kuenta koriente di bo banko', field: 'currentAccountStatements', hideable: true, export: true },
                    { headerName: 'Kuenta di spar di bo banko', field: 'savingsAccountStatements', hideable: true, export: true },
                    { headerName: 'Bo tin mas fuente di entrada?', field: 'hasMoreSourceOfIncome', hideable: true, export: true, valueGetter: params => params.row.hasMoreSourceOfIncome ? "Sí" : "Nó" },
                    { headerName: 'Por fabor spesifiká esaki', field: 'moreSourceOfIncome', hideable: true, export: true },
                    { headerName: 'Bo ta biba den bo mes kas?', field: 'hasOwnHouse', hideable: true, export: true, valueGetter: params => params.row.hasOwnHouse ? "Sí" : "Nó" },
                    { headerName: 'Kas no propio', field: 'notOwnHouse', hideable: true, export: true },
                    { headerName: 'Adrès', field: 'houseAddress', hideable: true, export: true },
                    { headerName: 'Bo ta paga hipotek?', field: 'payingMortgage', hideable: true, export: true },
                    { headerName: 'Dikon nò?', field: 'reasonNotPayingMortgage', hideable: true, export: true },
                    { headerName: 'Kuantu bo ta paga pa luna na hipotek?', field: 'houseMortgageDebt', hideable: true, export: true },
                    { headerName: 'Kuantu sèn bo ta paga na hür?', field: 'houseRentalPrice', hideable: true, export: true },
                    { headerName: 'Kiko ta bo kontribushon pa luna aki?', field: 'houseContribution', hideable: true, export: true },
                    { headerName: 'Por fabor spesifiká na unda bo ta kedando', field: 'liveInDescription', hideable: true, export: true },
                    { headerName: 'Ken mas ta biba den kas kubo?', field: 'houseResidents', hideable: true, export: true },
                    { headerName: 'kòntrakt di hur of apoderashon', field: 'proofOfRentalContract', hideable: true, export: true },
                    { headerName: 'prueba di pago', field: 'proofOfRentalPayment', hideable: true, export: true },
                    { headerName: 'Otro', field: 'otherHousing', hideable: true, export: true },
                    { headerName: 'Tin mas persona ta depende di bo finansieramente?', field: 'hasDependents', hideable: true, export: true, valueGetter: params => params.row.hasDependents ? "Sí" : "Nó" },
                    { headerName: 'Bo ta inskribí na FKP pa bo risibí un kas?', field: 'hasSignupFkp', hideable: true, export: true, valueGetter: params => params.row.hasSignupFkp ? "Sí" : "Nó" },
                    { headerName: 'For di ki aña?', field: 'signupFkpYear', hideable: true, export: true },
                    { headerName: 'Kuantu punto bo tin di spar?', field: 'fkpPoints', hideable: true, export: true },
                    { headerName: 'Tin mas persona ta depende di bo finansieramente?', field: 'dependents', hideable: true, export: true },
                    { headerName: 'Kua ta e nivel di skol mas haltu ku bo a kaba?', field: 'education', hideable: true, export: true },
                    { headerName: 'Bo tin diploma?', field: 'hasCertificate', hideable: true, export: true, valueGetter: params => params.row.hasCertificate ? "Sí" : "Nó" },
                    { headerName: 'Na ki aña bo a risibí e diploma?', field: 'certificateYear', hideable: true, export: true },
                    { headerName: 'hasOtherCertificate', field: 'hasOtherCertificate', hideable: true, export: true, valueGetter: params => params.row.hasOtherCertificate ? "Sí" : "Nó" },
                    { headerName: 'Por fabor indiká sertifikado di kua kurso/workshòp', field: 'otherCertificateDescription', hideable: true, export: true },
                    { headerName: 'Na ki aña bo a risibí e sertifikado?', field: 'otherCertificateYear', hideable: true, export: true },
                    { headerName: 'Bo a yega di traha den e sektor ku bo a studia aden?', field: 'hasCertificateWorkExperience', hideable: true, export: true, valueGetter: params => params.row.hasCertificateWorkExperience ? "Sí" : "Nó" },
                    { headerName: 'Na kua kompania?', field: 'certificateWorkExperienceCompany', hideable: true, export: true },
                    { headerName: 'Kon bo mobilidat ta?', field: 'mobility', hideable: true, export: true },
                    { headerName: 'Kon bo bista ta?', field: 'visibility', hideable: true, export: true },
                    { headerName: 'Kon bo oidu ta?', field: 'hearing', hideable: true, export: true },
                    { headerName: 'Kon bo abla ta?', field: 'speakingAbility', hideable: true, export: true },
                    { headerName: 'Bo ta sufri di un òf mas adikshon?', field: 'hasAdiction', hideable: true, export: true, valueGetter: params => params.row.hasAdiction ? "Sí" : "Nó" },
                    { headerName: 'Bo ta hañando yudansa di un instansia?', field: 'hasAdictionTreatment', hideable: true, export: true, valueGetter: params => params.row.hasAdictionTreatment ? "Sí" : "Nó" },
                    { headerName: 'Por fabor indiká kua instansia', field: 'adictionTreatmentCenter', hideable: true, export: true },
                    { headerName: 'Bo ta sufri di algun malesa', field: 'hasDiseases', hideable: true, export: true, valueGetter: params => params.row.hasDiseases ? "Sí" : "Nó" },
                    { headerName: 'malesa', field: 'diseases', hideable: true, export: true },
                    { headerName: 'Dor di bo limitashon bo ta hasi huzo di', field: 'equipments', hideable: true, export: true },
                    { headerName: 'Kua instansia ta guia bo den esaki?', field: 'treatmentCenters', hideable: true, export: true },
                    { headerName: 'Otro instansia', field: 'otherTreatmentCenter', hideable: true, export: true },
                    { headerName: 'Bo tin problema sígiko?', field: 'hasPsychologicalLimitation', hideable: true, export: true, valueGetter: params => params.row.hasPsychologicalLimitation ? "Sí" : "Nó" },
                    { headerName: 'Bo ta haña yudansa di un instansia?', field: 'hasPsychologicalLimitationTreatment', hideable: true, export: true, valueGetter: params => params.row.hasPsychologicalLimitationTreatment ? "Sí" : "Nó" },
                    { headerName: 'Por fabor indiká kua instansia?', field: 'psychologicalLimitationCenter', hideable: true, export: true },
                    { headerName: 'Tin un diagnóstiko?', field: 'hasPsychologicalLimitationDiagnostic', hideable: true, export: true, valueGetter: params => params.row.hasDutchNationality ? "Sí" : "Nó" },
                    { headerName: 'Ken a hasi e diagnóstiko aki?', field: 'psychologicalLimitationDiagnostician', hideable: true, export: true },
                    { headerName: 'echa di diagnóstiko', field: 'psychologicalLimitationDiagnosticDate', hideable: true, export: true },
                    { headerName: 'Tin un rapòrt di e diagnóstiko?', field: 'hasPsychologicalLimitationDiagnosticReport', hideable: true, export: true, valueGetter: params => params.row.hasPsychologicalLimitationDiagnosticReport ? "Sí" : "Nó" },
                    { headerName: 'Karta di diagnóstiko di bo médiko', field: 'proofOfPsychologicalLimitationDiagnosticReport', hideable: true, export: true },
                    { headerName: 'Bo tin retardashon mental ?', field: 'hasMentalDisorder', hideable: true, export: true, valueGetter: params => params.row.hasMentalDisorder ? "Sí" : "Nó" },
                    { headerName: 'Bo ta haña yudansa di un instansia?', field: 'hasMentalDisorderTreatment', hideable: true, export: true, valueGetter: params => params.row.hasMentalDisorderTreatment ? "Sí" : "Nó" },
                    { headerName: 'Tin un diagnóstiko?', field: 'hasMentalDisorderDiagnostic', hideable: true, export: true, valueGetter: params => params.row.hasMentalDisorderDiagnostic ? "Sí" : "Nó" },
                    { headerName: 'Ken a hasi e diagnóstiko aki?', field: 'mentalDisorderDiagnostician', hideable: true, export: true },
                    { headerName: 'Por fabor indiká kua instansia?', field: 'mentalDisorderTreatmentCenter', hideable: true, export: true },
                    { headerName: 'Fecha di diagnóstiko', field: 'mentalDisorderDiagnosticDate', hideable: true, export: true },
                    { headerName: 'Tin un rapòrt di e diagnóstiko?', field: 'hasMentalDisorderDiagnosticReport', hideable: true, export: true, valueGetter: params => params.row.hasDuthasMentalDisorderDiagnosticReportchNationality ? "Sí" : "Nó" },
                    { headerName: 'Karta di diagnóstiko di bo médiko', field: 'proofOfMentalDisorderDiagnosticReport', hideable: true, export: true },
                    { headerName: 'Bo tin yu ku limitashon mental?', field: 'hasPsychologicalLimitationChild', hideable: true, export: true, valueGetter: params => params.row.hasPsychologicalLimitationChild ? "Sí" : "Nó" },
                    { headerName: 'Ki tipo di seguro bo tin?', field: 'insurance', hideable: true, export: true },
                    { headerName: 'Bo ta bou di tratamentu di un médiko òf paramédiko?', field: 'hasMedicalTreatment', hideable: true, export: true, valueGetter: params => params.row.hasMedicalTreatment ? "Sí" : "Nó" },
                    { headerName: 'Ki tipo di médiko òf paramédiko?', field: 'medicalTreatment', hideable: true, export: true },
                    { headerName: 'Ki ta e nòmber di e médiko òf paramédiko?', field: 'medicalPractitionerName', hideable: true, export: true },
                    { headerName: 'Karta di bo specialista', field: 'proofOfMedicalTreatment', hideable: true, export: true },
                    { headerName: 'Bo ta usa medikamentu?', field: 'useMedicalSupplies', hideable: true, export: true },
                    { headerName: 'Ki tipo di medikamentu?', field: 'medicalSupplies', hideable: true, export: true },
                    { headerName: 'Bo ta risibí yudansa sosial pa motibu di bo estado di salú?gender', field: 'hasWelfare', hideable: true, export: true, valueGetter: params => params.row.hasWelfare ? "Sí" : "Nó" },
                    { headerName: 'Ki tipo di yudansa?', field: 'welfare', hideable: true, export: true },
                    { headerName: 'Bo tin seguro di entiero?', field: 'hasFuneralInsurance', hideable: true, export: true, valueGetter: params => params.row.hasFuneralInsurance ? "Sí" : "Nó" },
                    { headerName: 'Por fabor indiká na kua kompania', field: 'funeralInsurance', hideable: true, export: true },
                    { headerName: 'Fecha di petishon', field: 'created', export: true, valueGetter: params => (format(new Date(params.row.created), 'dd-MM-yyyy')), minWidth: 100, flex: 1 },
                    { headerName: 'Kambio di petishon', field: 'updated', export: true, valueGetter: params => (format(new Date(params.row.updated), 'dd-MM-yyyy')), minWidth: 100, flex: 1 },
                ]
                }
                loading={loading}
                // error={error}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                disableColumnFilter
                disableDensitySelector
                hideFooterSelectedRowCount
                pagination
                paginationMode="server"
                rowCount={requests.count}
                page={requests.page}
                pageSize={10}
                rowsPerPageOptions={[10]}
                onPageChange={(page) => setPage(page)}
                filterMode="server"
                onFilterModelChange={onFilterChange}
                rows={requests.items}
            />
        </Grid>
    )
}

export default RequestList
