import React, { useState } from 'react';
import clsx from 'clsx';
import { useForm, Controller } from "react-hook-form"
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { DropzoneArea } from 'material-ui-dropzone'
import imageCompression from 'browser-image-compression';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import {
    Grid,
    Typography,
    TextField,
    Button,
    Divider,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Select,
    MenuItem,
    useMediaQuery,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useStateValue } from 'StateProvider';
import { Alert } from '@mui/material/Alert';



const useStyles = makeStyles(theme => ({
    root: {},
    inputTitle: {
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },
    dropzoneRoot: {
        minHeight: 100
    },
    dropzoneText: {
        fontSize: 16,
        marginTop: 14,
        marginBottom: 14
    },
    dropzoneIcon: {
        height: 40
    },
    previewChip: {
        minWidth: 160,
        maxWidth: 210
    },
}));
const HealthForm = (props) => {
    const { className, handleNext, handleBack, ...rest } = props;
    const { request, setRequest } = useStateValue()
    const classes = useStyles();
    const [images, setImages] = useState([]);
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });
    const schema = yup.object().shape({
        mobility: yup.string().required('Mester yena kon bo mobilidat ta'),
        visibility: yup.string().required('Mester yena kon bo bista ta'),
        hearing: yup.string().required('Mester yena kon bo oido ta'),
        speakingAbility: yup.string().required('Mester yena kon bo abla ta'),
        hasAdiction: yup.bool().nullable().required('Mester skohe si bo ta sufri di un òf mas adikshon'),
        hasAdictionTreatment: yup.bool().nullable().when('hasAdiction', {
            is: val => val && val === true,
            then: yup.bool().nullable().required('Mester skohe si Bo ta hañando yudansa di un instansia')
        }),
        adictionTreatmentCenter: yup.string().when('hasAdiction', {
            is: val => val && val === true,
            then: yup.string().required('Mester indiká kua instansia')
        }),
        hasDiseases: yup.bool().nullable().required('Mester skohe si bo ta sufri di algun malesa'),
        diseases: yup.array().when('hasDiseases', {
            is: val => val && val === true,
            then: yup.array().required('Mester skohe un di e opshonan')
        }),
        // equipments: [],
        // treatmentCenters: [],
        otherTreatmentCenter: yup.string().when('treatmentCenters', {
            is: val => val.includes('Otro'),
            then: yup.string().required('Mester yen otro instansia')
        }),
        hasPsychologicalLimitation: yup.bool().nullable().required('Mester skohe si bo tin problema sígiko'),
        hasPsychologicalLimitationTreatment: yup.bool().nullable().when('hasPsychologicalLimitation', {
            is: val => val && val === true,
            then: yup.bool().nullable().required('Mester skohe si bo ta haña yudansa di un instansia')
        }),
        psychologicalLimitationCenter: yup.string().when('hasPsychologicalLimitationTreatment', {
            is: val => val && val === true,
            then: yup.string().nullable().required('Mester indiká kua instansia')
        }),
        hasPsychologicalLimitationDiagnostic: yup.bool().nullable().when('hasPsychologicalLimitation', {
            is: val => val && val === true,
            then: yup.bool().nullable().required('Mester skohe si tin un diagnóstiko?')
        }),
        psychologicalLimitationDiagnostician: yup.string().when('hasPsychologicalLimitationDiagnostic', {
            is: val => val && val === true,
            then: yup.string().required('Mester yena ken a hasi e diagnóstiko aki')
        }),
        psychologicalLimitationDiagnosticDate: yup.string().when('hasPsychologicalLimitationDiagnostic', {
            is: val => val && val === true,
            then: yup.string().required('Mester yena fecha di e diagnóstiko aki')
        }),
        hasPsychologicalLimitationDiagnosticReport: yup.bool().nullable().when('hasPsychologicalLimitationDiagnostic', {
            is: val => val && val === true,
            then: yup.bool().nullable().required('Mester yena si tin un rapòrt di e diagnóstiko')
        }),
        proofOfPsychologicalLimitationDiagnosticReport: yup.array().when('hasPsychologicalLimitationDiagnosticReport', {
            is: val => val && val === true,
            then: yup.array().required('Mester ‘upload’ karta di diagnóstiko di bo médiko')
        }),
        hasMentalDisorder: yup.bool().nullable().required('Mester skohe si bo tin retardashon mental'),
        hasMentalDisorderTreatment: yup.bool().nullable().when('hasMentalDisorder', {
            is: val => val && val === true,
            then: yup.bool().nullable().required('Mester skohe si bo ta haña yudansa di un instansia')
        }),
        mentalDisorderTreatmentCenter: yup.string().when('hasMentalDisorderTreatment', {
            is: val => val && val === true,
            then: yup.string().required('Mester indiká kua instansia?')
        }),
        hasMentalDisorderDiagnostic: yup.bool().nullable().when('hasMentalDisorder', {
            is: val => val && val === true,
            then: yup.bool().nullable().required('Mester skohe si tin un diagnóstiko?')
        }),
        mentalDisorderDiagnostician: yup.string().when('hasMentalDisorderDiagnostic', {
            is: val => val && val === true,
            then: yup.string().required('Mester yena ken a hasi e diagnóstiko aki')
        }),
        mentalDisorderDiagnosticDate: yup.string().when('hasMentalDisorderDiagnostic', {
            is: val => val && val === true,
            then: yup.string().required('Mester yena fecha di e diagnóstiko aki')
        }),
        hasMentalDisorderDiagnosticReport: yup.bool().nullable().when('hasMentalDisorderDiagnostic', {
            is: val => val && val === true,
            then: yup.bool().nullable().required('Mester yena si tin un rapòrt di e diagnóstiko')
        }),
        proofOfMentalDisorderDiagnosticReport: yup.array().when('hasMentalDisorderDiagnosticReport', {
            is: val => val && val === true,
            then: yup.array().required('Mester ‘upload’ karta di diagnóstiko di bo médiko')
        }),
        hasPsychologicalLimitationChild: yup.bool().nullable().required('Mester skohe si bo tin yu ku limitashon mental'),
        insurance: yup.string().required('Mester skohe tipo di seguro bo tin'),
        hasMedicalTreatment: yup.bool().nullable().required('Mester skohe si bo ta bou di tratamentu di un médiko òf paramédiko'),
        medicalTreatment: yup.string().when('hasMedicalTreatment', {
            is: val => val && val === true,
            then: yup.string().required('Mester skohe ki tipo di médiko òf paramédiko')
        }),
        medicalPractitionerName: yup.string().when('hasMedicalTreatment', {
            is: val => val === true,
            then: yup.string().required('Mester yena nomber di médiko òf paramédiko?')
        }),
        proofOfMedicalTreatment: yup.array().when('medicalTreatment', {
            is: (val) => val && ["specialist", "psychologist", "psychiatrist"].includes(watch('medicalTreatment')),
            then: yup.array().required('Mester ‘upload’ e karta di bo spesialista'),
        }),
        useMedicalSupplies: yup.bool().nullable().required('Mester skohe si bo ta usa medikamentu'),
        medicalSupplies: yup.string().when('useMedicalSupplies', {
            is: val => val === true,
            then: yup.string().required('Mester yena ki tipo di medikamentu')
        }),
        hasWelfare: yup.bool().nullable().required('Mester skohe si bo ta risibí yudansa sosial pa motibu di bo estado di salú'),
        welfare: yup.string().when('hasWelfare', {
            is: val => val === true,
            then: yup.string().required('Mester yena ki tipo di yudansa')
        }),
        hasFuneralInsurance: yup.bool().nullable().required('Mester skohe si bo tin seguro di entiero'),
        funeralInsurance: yup.string().when('hasFuneralInsurance', {
            is: val => val === true,
            then: yup.string().required('Mester indiká na kua kompania')
        }),
    });
    const { control, handleSubmit, errors, watch, getValues, setValue, register, clearErrors } = useForm({
        defaultValues: request,
        resolver: yupResolver(schema),
    });

    const onDeleteHandler = (file, category) => {
        setImages(images.filter(image => (image.name !== file.name && image.category !== category)));
    }

    const onDropHandler = (files, category) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true
        }

        files.forEach(file => {
            let img = {}
            if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    img.base64 = event.target.result.split(',')[1];
                    img.type = event.target.result.split(',')[0]
                };
                img.name = file.name;
                img.categoryId = category;
                setImages([...images, img])
                return reader.readAsDataURL(file);
            } else {
                imageCompression(file, options).then((compressedFile) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        img.base64 = event.target.result.split(',')[1];
                        img.type = event.target.result.split(',')[0]
                    };
                    img.name = compressedFile.name;
                    img.categoryId = category;

                    setImages([...images, img])
                    return reader.readAsDataURL(compressedFile);
                })
            }

        });
    }

    const handlePsychologicalLimitationDiagnosticDate = (date) => {
        const year = date.split('-')[0]
        const month = date.split('-')[1]
        const day = date.split('-')[2]
        setValue('psychologicalLimitationDiagnosticDate', new Date(+year, +month - 1, +day).toISOString().substr(0, 10))
        clearErrors('psychologicalLimitationDiagnosticDate')
    }

    const handleMentalDisorderDiagnosticDate = (date) => {
        const year = date.split('-')[0]
        const month = date.split('-')[1]
        const day = date.split('-')[2]
        setValue('mentalDisorderDiagnosticDate', new Date(+year, +month - 1, +day).toISOString().substr(0, 10))
        clearErrors('mentalDisorderDiagnosticDate')
    }


    const handleDiseasesSelect = (checkedName) => {
        const newNames = getValues('diseases')?.includes(checkedName)
            ? getValues('diseases')?.filter(name => name !== checkedName)
            : [...(getValues('diseases') ?? []), checkedName];

        setValue('diseases', newNames);
        return newNames;
    }

    const handleEquipmentsSelect = (checkedName) => {
        const newNames = getValues('equipments')?.includes(checkedName)
            ? getValues('equipments')?.filter(name => name !== checkedName)
            : [...(getValues('equipments') ?? []), checkedName];

        setValue('equipments', newNames);
        return newNames;
    }

    const handleTreatmentCentersSelect = (checkedName) => {
        const newNames = getValues('treatmentCenters')?.includes(checkedName)
            ? getValues('treatmentCenters')?.filter(name => name !== checkedName)
            : [...(getValues('treatmentCenters') ?? []), checkedName];

        setValue('treatmentCenters', newNames);
        return newNames;
    }

    const onSubmit = (data) => {
        data.images = [...request.images, ...images]
        setRequest({ ...request, ...data });
        handleNext()
    }

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Grid container spacing={isMd ? 4 : 2}>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textPrimary">
                        Salú físiko i mental
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}>
                        29. Kon bo estado di salú físiko ta?
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                    >
                        Kon bo mobilidat ta?
                    </Typography>
                    <Controller
                        control={control}
                        as={
                            <Select>
                                <MenuItem value="good">Mi por kana bon</MenuItem>
                                <MenuItem value="moderate">Mi por kana basta bon</MenuItem>
                                <MenuItem value="bad">Mi no por kana</MenuItem>
                            </Select>
                        }
                        variant="outlined"
                        fullWidth
                        name="mobility"
                        error={errors.mobility ? true : false}
                    />
                    {errors.mobility && <p style={{ color: '#bf1650' }}>{errors.mobility.message}</p>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                    >
                        Kon bo oidu ta?
                    </Typography>
                    <Controller
                        control={control}
                        as={
                            <Select>
                                <MenuItem value="good">Bon</MenuItem>
                                <MenuItem value="moderate">Mi tin redukshon di oido</MenuItem>
                                <MenuItem value="bad">Dof</MenuItem>
                                <MenuItem value="deaf">Surdu</MenuItem>
                            </Select>
                        }
                        variant="outlined"
                        fullWidth
                        name="hearing"
                        error={errors.hearing ? true : false}
                    />
                    {errors.hearing && <p style={{ color: '#bf1650' }}>{errors.hearing.message}</p>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                    >
                        Kon bo bista ta?
                    </Typography>
                    <Controller
                        control={control}
                        as={
                            <Select>
                                <MenuItem value="good">Bon</MenuItem>
                                <MenuItem value="moderate">Basta bon</MenuItem>
                                <MenuItem value="bad">Mi no ta mira bon</MenuItem>
                                <MenuItem value="blind">Siegu</MenuItem>
                            </Select>
                        }
                        variant="outlined"
                        fullWidth
                        name="visibility"
                        error={errors.visibility ? true : false}
                    />
                    {errors.visibility && <p style={{ color: '#bf1650' }}>{errors.visibility.message}</p>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                    >
                        Kon bo abla ta?
                    </Typography>
                    <Controller
                        control={control}
                        as={
                            <Select>
                                <MenuItem value="clear">Kla</MenuItem>
                                <MenuItem value="stutter">Mi ta gaga</MenuItem>
                                <MenuItem value="lisp">Mi ta sles</MenuItem>
                                <MenuItem value="other">Otro</MenuItem>
                            </Select>
                        }
                        variant="outlined"
                        fullWidth
                        name="speakingAbility"
                        error={errors.speakingAbility ? true : false}
                    />
                    {errors.speakingAbility && <p style={{ color: '#bf1650' }}>{errors.speakingAbility.message}</p>}
                </Grid>
                <Grid item xs={12} sm={JSON.parse(watch('hasAdiction') ?? request.hasAdiction) ? 6 : false}>
                    <Controller
                        control={control}
                        name="hasAdiction"
                        error={errors.hasAdiction ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Bo ta sufri di un òf mas adikshon?
                                </Typography>
                                <RadioGroup aria-label="hasAdiction" name="hasAdiction" value={JSON.parse(value)} onChange={onChange}>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasAdiction && <p style={{ color: '#bf1650' }}>{errors.hasAdiction.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasAdiction') ?? request.hasAdiction) ?
                        <Grid item xs={6} sm={JSON.parse(watch('hasAdiction') ?? request.hasAdictionTreatment) ? 3 : false}>
                            <Controller
                                control={control}
                                name="hasAdictionTreatment"
                                error={errors.hasAdictionTreatment ? true : false}
                                render={({ onChange, value }) => (
                                    <>
                                        <Typography
                                            variant="subtitle1"
                                            color="textPrimary"
                                            className={classes.inputTitle}
                                        >
                                            Bo ta hañando yudansa di un instansia?
                                        </Typography>
                                        <RadioGroup aria-label="hasAdictionTreatment" name="hasAdictionTreatment" value={JSON.parse(value)} onChange={onChange}>
                                            <FormControlLabel value={true} control={<Radio />} label="Si" />
                                            <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                        </RadioGroup>
                                    </>
                                )}
                            />
                            {errors.hasAdictionTreatment && <p style={{ color: '#bf1650' }}>{errors.hasAdictionTreatment.message}</p>}
                        </Grid>

                        : null
                }
                {
                    JSON.parse(watch('hasAdiction') ?? !!request.hasAdictionTreatment) ?
                        <Grid item xs={6} sm={3}>
                            <Typography
                                variant="subtitle1"
                                color="textPrimary"
                                className={classes.inputTitle}
                            >
                                Por fabor indiká kua instansia
                            </Typography>
                            <Controller
                                as={TextField}
                                id="adictionTreatmentCenter"
                                name="adictionTreatmentCenter"
                                label="Por fabor indiká kua instansia"
                                variant="outlined"
                                fullWidth
                                control={control}
                                error={errors.adictionTreatmentCenter ? true : false}
                            />
                            {errors.adictionTreatmentCenter && <p style={{ color: '#bf1650' }}>{errors.adictionTreatmentCenter.message}</p>}
                        </Grid> : null
                }
                <Grid item xs={12} sm={JSON.parse(watch('hasDiseases') ?? !!request.hasDiseases) ? 6 : false}>
                    <Controller
                        control={control}
                        name="hasDiseases"
                        error={errors.hasDiseases ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    30. Bo ta sufri di algun malesa
                                </Typography>
                                <RadioGroup aria-label="hasDiseases" name="hasDiseases" value={JSON.parse(value)} onChange={onChange}>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasDiseases && <p style={{ color: '#bf1650' }}>{errors.hasDiseases.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasDiseases') ?? !!request.hasDiseases) ?
                        <Grid item xs={12} >
                            <Typography
                                variant="subtitle1"
                                color="textPrimary"
                                className={classes.inputTitle}
                            >
                                Skohe mas opshon si esaki ta e kaso
                            </Typography>
                            {["Alergia", "Asma", "Anemia", "Epilepsia", "Malesa di kurason i ader", "Preshon haltu", "Malesa di kueru", "Kanser", "Malesa di higra", "Malesa di stoma i tripa", "Malesa di nir", "Romatismo", "Keho di lomba i nèk", "Sikkel sèl", "Malesa venériko", "Diabetis", "Otro"]
                                .map(name => (
                                    <FormControlLabel
                                        control={
                                            <Controller
                                                name="diseases"
                                                render={({ onChange, value }) => {
                                                    return (
                                                        <Checkbox
                                                            checked={value?.includes(name) || false}
                                                            onChange={() => onChange(handleDiseasesSelect(name))}

                                                        />
                                                    );
                                                }}
                                                control={control}
                                            />
                                        }
                                        key={name}
                                        label={name}
                                    />
                                ))}
                            {errors.diseases && <p style={{ color: '#bf1650' }}>{errors.diseases.message}</p>}
                        </Grid>
                        : null
                }
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="hasMedicalTreatment"
                        error={errors.hasMedicalTreatment ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    31. Bo ta bou di tratamentu di un médiko òf paramédiko?
                                </Typography>
                                <RadioGroup aria-label="hasMedicalTreatment" name="hasMedicalTreatment" value={JSON.parse(value)} onChange={onChange}>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasMedicalTreatment && <p style={{ color: '#bf1650' }}>{errors.hasMedicalTreatment.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasMedicalTreatment') ?? request.hasMedicalTreatment) &&
                    <>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="subtitle1"
                                color="textPrimary"
                                className={classes.inputTitle}
                            >
                                Ki tipo di médiko òf paramédiko?
                            </Typography>
                            <Controller
                                control={control}
                                as={
                                    <Select>
                                        <MenuItem value="dietician">Dietista</MenuItem>
                                        <MenuItem value="logopedist">Logopedist</MenuItem>
                                        <MenuItem value="fysioterapist">Fysioterapista</MenuItem>
                                        <MenuItem value="generalPractitioner">Dòkter di kas</MenuItem>
                                        <MenuItem value="specialist">Spesialista médiko</MenuItem>
                                        <MenuItem value="psychologist">Sikólogo</MenuItem>
                                        <MenuItem value="psychiatrist">Sikiatra</MenuItem>
                                        <MenuItem value="dentist">Dentista</MenuItem>
                                        <MenuItem value="other">Otro</MenuItem>
                                    </Select>
                                }
                                variant="outlined"
                                fullWidth
                                name="medicalTreatment"
                                error={errors.medicalTreatment ? true : false}
                            />
                            {errors.medicalTreatment && <p style={{ color: '#bf1650' }}>{errors.medicalTreatment.message}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="subtitle1"
                                color="textPrimary"
                                className={classes.inputTitle}
                            >
                                Ki ta e nòmber di e médiko òf paramédiko?
                            </Typography>
                            <Controller
                                as={TextField}
                                id="medicalPractitionerName"
                                name="medicalPractitionerName"
                                label="Ki ta e nòmber di e médiko òf paramédiko?"
                                variant="outlined"
                                fullWidth
                                control={control}
                                error={errors.medicalPractitionerName ? true : false}
                            />
                            {errors.medicalPractitionerName && <p style={{ color: '#bf1650' }}>{errors.medicalPractitionerName.message}</p>}
                        </Grid>
                    </>
                }
                {
                    ["specialist", "psychologist", "psychiatrist"].includes(watch('medicalTreatment') ?? request.medicalTreatment) ?
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="subtitle1"
                                color="textPrimary"
                                className={classes.inputTitle}
                            >
                                Por fabor ‘upload’ e karta di bo {
                                    (watch('medicalTreatment') ?? request.medicalTreatment) === 'specialist' ? 'Spesialista médiko' :
                                        (watch('medicalTreatment') ?? request.medicalTreatment) === 'psychologist' ? 'Sikólogo' : (watch('medicalTreatment') ?? request.medicalTreatment) === 'psychologist' ? 'Sikiatra' : ''}
                            </Typography>
                            <Controller
                                classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                name="proofOfMedicalTreatment"
                                control={control}
                                render={({ field }) => (
                                    <DropzoneArea
                                        {...field}
                                        initialFiles={request.proofOfMedicalTreatment}
                                        dropzoneText={`Por fabor ‘upload’ e karta di bo ${(watch('medicalTreatment') ?? request.medicalTreatment) === 'specialist' ? 'Spesialista médiko' :
                                            (watch('medicalTreatment') ?? request.medicalTreatment) === 'psychologist' ? 'Sikólogo' : (watch('medicalTreatment') ?? request.medicalTreatment) === 'psychologist' ? 'Sikiatra' : ''} (image/* òf .pdf)`}
                                        error={errors.proofOfMedicalTreatment ? true : false}
                                        onDrop={(files) => onDropHandler(files, (watch('medicalTreatment') ?? request.medicalTreatment) === 'specialist' ? 12 : (watch('medicalTreatment') ?? request.medicalTreatment) === 'psychologist' ? 13 : (watch('medicalTreatment') ?? request.medicalTreatment) === 'psychiatrist' ? 14 : 12)}
                                        onDelete={(file) => onDeleteHandler(file, (watch('medicalTreatment') ?? request.medicalTreatment) === 'specialist' ? 12 : (watch('medicalTreatment') ?? request.medicalTreatment) === 'psychologist' ? 13 : (watch('medicalTreatment') ?? request.medicalTreatment) === 'psychiatrist' ? 14 : 12)}
                                        filesLimit={1}
                                        acceptedFiles={['image/*', '.pdf']}
                                        showPreviews={true}
                                        showPreviewsInDropzone={false}
                                        useChipsForPreview
                                        previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                        previewChipProps={{ classes: { root: classes.previewChip } }}
                                        previewText="Selected files"
                                    />
                                )} />
                            {errors.proofOfMedicalTreatment && <p style={{ color: '#bf1650' }}>{errors.proofOfMedicalTreatment.message}</p>}
                        </Grid> : null
                }
                <Grid item xs={12} >
                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                    >
                        32. Dor di bo limitashon bo ta hasi huzo di?
                        (skohe mas opshon si esaki ta e kaso)
                    </Typography>
                    {["Rolatòr", "Ròlstül", "Aparato pa oido", "Implantashon na e oido", "Kachó ku ta kompaña un siegu", "Garoti", "Otro"]
                        .map(name => (
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="equipments"
                                        render={({ onChange, value }) => {
                                            return (
                                                <Checkbox
                                                    checked={value?.includes(name) || false}
                                                    onChange={() => onChange(handleEquipmentsSelect(name))}

                                                />
                                            );
                                        }}
                                        control={control}
                                    />
                                }
                                key={name}
                                label={name}
                            />
                        ))}
                    {errors.equipments && <p style={{ color: '#bf1650' }}>{errors.equipments.message}</p>}
                </Grid>
                <Grid item xs={12} >
                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                    >
                        33. Kua instansia ta guia bo den esaki?
                        (skohe mas opshon si esaki ta e kaso)
                    </Typography>
                    {["Mgr. Verriet", "Mi Abilidat", "Wit Gele Kruis", "Sosiedat di Siegu", "Otro"]
                        .map(name => (
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="treatmentCenters"
                                        render={({ onChange, value }) => {
                                            return (
                                                <Checkbox
                                                    checked={value?.includes(name) || false}
                                                    onChange={() => onChange(handleTreatmentCentersSelect(name))}

                                                />
                                            );
                                        }}
                                        control={control}
                                    />
                                }
                                key={name}
                                label={name}
                            />
                        ))}
                    {errors.treatmentCenters && <p style={{ color: '#bf1650' }}>{errors.treatmentCenters.message}</p>}
                </Grid>
                {
                    (watch('treatmentCenters') ?? request.treatmentCenters).includes('Otro') &&
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Otro instansia
                        </Typography>
                        <Controller
                            as={TextField}
                            id="otherTreatmentCenter"
                            name="otherTreatmentCenter"
                            label="Otro instansia"
                            variant="outlined"
                            fullWidth
                            control={control}
                            error={errors.otherTreatmentCenter ? true : false}
                        />
                        {errors.otherTreatmentCenter && <p style={{ color: '#bf1650' }}>{errors.otherTreatmentCenter.message}</p>}
                    </Grid>

                }
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="hasPsychologicalLimitation"
                        error={errors.hasPsychologicalLimitation ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    34. Bo tin problema sígiko?
                                </Typography>
                                <RadioGroup aria-label="hasPsychologicalLimitation" name="hasPsychologicalLimitation" value={JSON.parse(value)} onChange={onChange}>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasPsychologicalLimitation && <p style={{ color: '#bf1650' }}>{errors.hasPsychologicalLimitation.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasPsychologicalLimitation') ?? request.hasPsychologicalLimitation) &&
                    <Grid item xs={12} sm={JSON.parse(watch('hasPsychologicalLimitationTreatment') ?? request.hasPsychologicalLimitation) ? 6 : false}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Bo ta haña yudansa di un instansia?
                        </Typography>
                        <Controller
                            control={control}
                            name="hasPsychologicalLimitationTreatment"
                            error={errors.hasPsychologicalLimitationTreatment ? true : false}
                            render={({ field }) => (
                                <RadioGroup {...field}>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            )}
                        />
                        {errors.hasPsychologicalLimitationTreatment && <p style={{ color: '#bf1650' }}>{errors.hasPsychologicalLimitationTreatment.message}</p>}
                    </Grid>
                }
                {
                    JSON.parse(watch('hasPsychologicalLimitationTreatment') ?? request.hasPsychologicalLimitationTreatment) ?
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="subtitle1"
                                color="textPrimary"
                                className={classes.inputTitle}
                            >
                                Por fabor indiká kua instansia?
                            </Typography>
                            <Controller
                                id="psychologicalLimitationCenter"
                                name="psychologicalLimitationCenter"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Por fabor indiká kua instansia?"
                                        variant="outlined"
                                        fullWidth
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        error={errors.psychologicalLimitationCenter ? true : false}
                                    />
                                )}
                                control={control}
                            />

                            {errors.psychologicalLimitationCenter && <p style={{ color: '#bf1650' }}>{errors.psychologicalLimitationCenter.message}</p>}
                        </Grid> : null
                }
                {
                    JSON.parse(watch('hasPsychologicalLimitation') ?? request.hasPsychologicalLimitation) ?
                        <Grid item xs={12}>
                            <Controller
                                control={control}
                                name="hasPsychologicalLimitationDiagnostic"
                                error={errors.hasPsychologicalLimitationTreatment ? true : false}
                                render={({ onChange, value }) => (
                                    <>
                                        <Typography
                                            variant="subtitle1"
                                            color="textPrimary"
                                            className={classes.inputTitle}
                                        >
                                            Tin un diagnóstiko?
                                        </Typography>
                                        <RadioGroup aria-label="hasPsychologicalLimitationDiagnostic" name="hasPsychologicalLimitationDiagnostic" value={JSON.parse(value)} onChange={onChange}>
                                            <FormControlLabel value={true} control={<Radio />} label="Si" />
                                            <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                        </RadioGroup>
                                    </>
                                )}
                            />
                            {errors.hasPsychologicalLimitationDiagnostic && <p style={{ color: '#bf1650' }}>{errors.hasPsychologicalLimitationDiagnostic.message}</p>}
                        </Grid> : null
                }
                {
                    JSON.parse(watch('hasPsychologicalLimitationDiagnostic') ?? request.hasPsychologicalLimitationDiagnostic) ?
                        <>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Ken a hasi e diagnóstiko aki?
                                </Typography>
                                <Controller
                                    as={TextField}
                                    id="psychologicalLimitationDiagnostician"
                                    name="psychologicalLimitationDiagnostician"
                                    label="Ken a hasi e diagnóstiko aki?"
                                    variant="outlined"
                                    fullWidth
                                    control={control}
                                    error={errors.psychologicalLimitationDiagnostician ? true : false}
                                />
                                {errors.psychologicalLimitationDiagnostician && <p style={{ color: '#bf1650' }}>{errors.psychologicalLimitationDiagnostician.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Fecha di diagnóstiko
                                </Typography>
                                <Controller
                                    id="psychologicalLimitationDiagnosticDate"
                                    name="psychologicalLimitationDiagnosticDate"
                                    control={control}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns} lo>
                                            <DatePicker
                                                {...field}
                                                label="Fecha di nasementu"
                                                mask="__-__-____"
                                                inputFormat="dd-MM-yyyy"
                                                value={field.value}
                                                renderInput={(params) => <TextField
                                                    {...params}
                                                    fullWidth
                                                    error={errors?.psychologicalLimitationDiagnosticDate ? true : false} />}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                {errors.psychologicalLimitationDiagnosticDate && <p style={{ color: '#bf1650' }}>{errors.psychologicalLimitationDiagnosticDate.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={JSON.parse(watch('hasPsychologicalLimitationDiagnosticReport') ?? !!request.hasPsychologicalLimitationDiagnosticReport) ? 6 : false}>
                                <Controller
                                    control={control}
                                    name="hasPsychologicalLimitationDiagnosticReport"
                                    error={errors.hasPsychologicalLimitationDiagnosticReport ? true : false}
                                    render={({ onChange, value }) => (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Tin un rapòrt di e diagnóstiko?
                                            </Typography>
                                            <RadioGroup aria-label="hasPsychologicalLimitationDiagnosticReport" name="hasPsychologicalLimitationDiagnosticReport" value={JSON.parse(value)} onChange={onChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="Si" />
                                                <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                            </RadioGroup>
                                        </>
                                    )}
                                />
                                {errors.hasPsychologicalLimitationDiagnosticReport && <p style={{ color: '#bf1650' }}>{errors.hasPsychologicalLimitationDiagnosticReport.message}</p>}
                            </Grid>
                            {
                                JSON.parse(watch('hasPsychologicalLimitationDiagnosticReport') ?? !!request.hasPsychologicalLimitationDiagnosticReport) ?
                                    <Grid item xs={12} sm={6}>
                                        <Typography
                                            variant="subtitle1"
                                            color="textPrimary"
                                            className={classes.inputTitle}
                                        >
                                            ‘Upload’ e karta di diagnóstiko di bo médiko
                                        </Typography>
                                        <Controller
                                            classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                            name="proofOfPsychologicalLimitationDiagnosticReport"
                                            control={control}
                                            render={({ field }) => (
                                                <DropzoneArea
                                                    {...field}
                                                    initialFiles={request.proofOfPsychologicalLimitationDiagnosticReport}
                                                    dropzoneText="‘Upload’ e karta di diagnóstiko di bo médiko (image/* òf .pdf)"
                                                    error={errors.proofOfPsychologicalLimitationDiagnosticReport ? true : false}
                                                    onDrop={(files) => onDropHandler(files, 18)}
                                                    onDelete={(file) => onDeleteHandler(file, 18)}
                                                    filesLimit={1}
                                                    acceptedFiles={['image/*', '.pdf']}
                                                    showPreviews={true}
                                                    showPreviewsInDropzone={false}
                                                    useChipsForPreview
                                                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                                    previewChipProps={{ classes: { root: classes.previewChip } }}
                                                    previewText="Selected files"
                                                />

                                            )}

                                        />
                                        {errors.proofOfPsychologicalLimitationDiagnosticReport && <p style={{ color: '#bf1650' }}>{errors.proofOfPsychologicalLimitationDiagnosticReport.message}</p>}
                                    </Grid> : null
                            }
                        </>
                        : null
                }

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                    >
                        Bo tin retardashon mental ?
                    </Typography>
                    <Controller
                        control={control}
                        name="hasMentalDisorder"
                        error={errors.hasMentalDisorder ? true : false}
                        render={({ field }) => (
                            <RadioGroup {...field}>
                                <FormControlLabel value={true} control={<Radio />} label="Si" />
                                <FormControlLabel value={false} control={<Radio />} label="Nò" />
                            </RadioGroup>
                        )}
                    />
                    {errors.hasMentalDisorder && <p style={{ color: '#bf1650' }}>{errors.hasMentalDisorder.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasMentalDisorder') ?? !!request.hasMentalDisorder) &&
                    <Grid item xs={12} sm={JSON.parse(watch('hasMentalDisorder') ?? !!request.hasMentalDisorder) ? 6 : false}>
                        <Controller
                            control={control}
                            name="hasMentalDisorderTreatment"
                            error={errors.hasMentalDisorderTreatment ? true : false}
                            render={({ onChange, value }) => (
                                <>
                                    <Typography
                                        variant="subtitle1"
                                        color="textPrimary"
                                        className={classes.inputTitle}
                                    >
                                        Bo ta haña yudansa di un instansia?
                                    </Typography>
                                    <RadioGroup aria-label="hasMentalDisorderTreatment" name="hasMentalDisorderTreatment" value={JSON.parse(value)} onChange={onChange}>
                                        <FormControlLabel value={true} control={<Radio />} label="Si" />
                                        <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                    </RadioGroup>
                                </>
                            )}
                        />
                        {errors.hasMentalDisorderTreatment && <p style={{ color: '#bf1650' }}>{errors.hasMentalDisorderTreatment.message}</p>}
                    </Grid>
                }
                {
                    JSON.parse(watch('hasMentalDisorderTreatment') ?? !!request.hasMentalDisorderTreatment) &&
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Por fabor indiká kua instansia?
                        </Typography>
                        <Controller
                            id="mentalDisorderTreatmentCenter"
                            name="mentalDisorderTreatmentCenter"
                            control={control}
                            render={{ f }}
                            label="Por fabor indiká kua instansia?"
                            variant="outlined"
                            fullWidth
                            error={errors.mentalDisorderTreatmentCenter ? true : false}
                        />
                        {errors.mentalDisorderTreatmentCenter && <p style={{ color: '#bf1650' }}>{errors.mentalDisorderTreatmentCenter.message}</p>}
                    </Grid>
                }
                {
                    JSON.parse(watch('hasMentalDisorder') ?? !!request.hasMentalDisorder) ?
                        <Grid item xs={12}>
                            <Controller
                                control={control}
                                name="hasMentalDisorderDiagnostic"
                                error={errors.hasMentalDisorderTreatment ? true : false}
                                render={({ onChange, value }) => (
                                    <>
                                        <Typography
                                            variant="subtitle1"
                                            color="textPrimary"
                                            className={classes.inputTitle}
                                        >
                                            Tin un diagnóstiko?
                                        </Typography>
                                        <RadioGroup aria-label="hasMentalDisorderDiagnostic" name="hasMentalDisorderDiagnostic" value={JSON.parse(value)} onChange={onChange}>
                                            <FormControlLabel value={true} control={<Radio />} label="Si" />
                                            <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                        </RadioGroup>
                                    </>
                                )}
                            />
                            {errors.hasMentalDisorderDiagnostic && <p style={{ color: '#bf1650' }}>{errors.hasMentalDisorderDiagnostic.message}</p>}
                        </Grid> : null
                }
                {
                    JSON.parse(watch('hasMentalDisorderDiagnostic') ?? !!request.hasMentalDisorderDiagnostic) ?
                        <>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Ken a hasi e diagnóstiko aki?
                                </Typography>
                                <Controller
                                    as={TextField}
                                    id="mentalDisorderDiagnostician"
                                    name="mentalDisorderDiagnostician"
                                    label="Ken a hasi e diagnóstiko aki?"
                                    variant="outlined"
                                    fullWidth
                                    control={control}
                                    error={errors.mentalDisorderDiagnostician ? true : false}
                                />
                                {errors.mentalDisorderDiagnostician && <p style={{ color: '#bf1650' }}>{errors.mentalDisorderDiagnostician.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Fecha di diagnóstiko
                                </Typography>
                                <Controller
                                    id="mentalDisorderDiagnosticDate"
                                    name="mentalDisorderDiagnosticDate"
                                    control={control}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns} lo>
                                            <DatePicker
                                                {...field}
                                                label="Fecha di nasementu"
                                                mask="__-__-____"
                                                inputFormat="dd-MM-yyyy"
                                                value={field.value}
                                                renderInput={(params) => <TextField
                                                    {...params}
                                                    fullWidth
                                                    error={errors?.mentalDisorderDiagnosticDate ? true : false} />}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                {errors.mentalDisorderDiagnosticDate && <p style={{ color: '#bf1650' }}>{errors.mentalDisorderDiagnosticDate.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={JSON.parse(watch('hasMentalDisorderDiagnosticReport') ?? !!request.hasMentalDisorderDiagnosticReport) ? 6 : false}>
                                <Controller
                                    control={control}
                                    name="hasMentalDisorderDiagnosticReport"
                                    error={errors.hasMentalDisorderDiagnosisDateReport ? true : false}
                                    render={({ onChange, value }) => (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Tin un rapòrt di e diagnóstiko?
                                            </Typography>
                                            <RadioGroup aria-label="hasMentalDisorderDiagnosticReport" name="hasMentalDisorderDiagnosticReport" value={JSON.parse(value)} onChange={onChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="Si" />
                                                <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                            </RadioGroup>
                                        </>
                                    )}
                                />
                                {errors.hasMentalDisorderDiagnosticReport && <p style={{ color: '#bf1650' }}>{errors.hasMentalDisorderDiagnosticReport.message}</p>}
                            </Grid>
                            {
                                JSON.parse(watch('hasMentalDisorderDiagnosticReport') ?? !!request.hasMentalDisorderDiagnosticReport) ?
                                    <Grid item xs={12} sm={6}>
                                        <Typography
                                            variant="subtitle1"
                                            color="textPrimary"
                                            className={classes.inputTitle}
                                        >
                                            ‘Upload’ e karta di diagnóstiko di bo médiko
                                        </Typography>
                                        <Controller
                                            classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                            name="proofOfMentalDisorderDiagnosticReport"
                                            control={control}
                                            render={({ field }) => (
                                                <DropzoneArea
                                                    {...field}
                                                    dropzoneText="‘Upload’ e karta di diagnóstiko di bo médiko (image/* òf .pdf)"
                                                    initialFiles={request.proofOfMentalDisorderDiagnosticReport}
                                                    error={errors.proofOfMentalDisorderDiagnosticReport ? true : false}
                                                    onDrop={(files) => onDropHandler(files, 19)}
                                                    onDelete={(file) => onDeleteHandler(file, 19)}
                                                    filesLimit={1}
                                                    acceptedFiles={['image/*', '.pdf']}
                                                    showPreviews={true}
                                                    showPreviewsInDropzone={false}
                                                    useChipsForPreview
                                                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                                    previewChipProps={{ classes: { root: classes.previewChip } }}
                                                    previewText="Selected files"
                                                />
                                            )} />
                                        {errors.proofOfMentalDisorderDiagnosticReport && <p style={{ color: '#bf1650' }}>{errors.proofOfMentalDisorderDiagnosticReport.message}</p>}
                                    </Grid> : null
                            }
                        </>
                        : null
                }
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="hasPsychologicalLimitationChild"
                        error={errors.hasPsychologicalLimitationChild ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    35. Bo tin yu ku limitashon mental?
                                </Typography>
                                <RadioGroup aria-label="hasPsychologicalLimitationChild" name="hasPsychologicalLimitationChild" value={JSON.parse(value)} onChange={onChange}>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasPsychologicalLimitationChild && <p style={{ color: '#bf1650' }}>{errors.hasPsychologicalLimitationChild.message}</p>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                    >
                        36. Ki tipo di seguro bo tin?
                    </Typography>
                    <Controller
                        control={control}
                        as={
                            <Select>
                                <MenuItem value="SVB">SVB</MenuItem>
                                <MenuItem value="SVB+">SVB+</MenuItem>
                                <MenuItem value="Ennia">Ennia</MenuItem>
                                <MenuItem value="FZOG">FZOG</MenuItem>
                                <MenuItem value="Partikulir">Partikulir</MenuItem>
                                <MenuItem value="other">Otro</MenuItem>
                            </Select>
                        }
                        variant="outlined"
                        fullWidth
                        name="insurance"
                        error={errors.insurance ? true : false}
                    />
                    {errors.insurance && <p style={{ color: '#bf1650' }}>{errors.insurance.message}</p>}
                </Grid>
                <Grid item xs={12} sm={6}>
                </Grid>
                <Grid item xs={12} sm={JSON.parse(watch('useMedicalSupplies') ?? !!request.useMedicalSupplies) ? 6 : false}>
                    <Controller
                        control={control}
                        name="useMedicalSupplies"
                        error={errors.useMedicalSupplies ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    37. Bo ta usa medikamentu?
                                </Typography>
                                <RadioGroup aria-label="useMedicalSupplies" name="useMedicalSupplies" value={JSON.parse(value)} onChange={onChange}>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.useMedicalSupplies && <p style={{ color: '#bf1650' }}>{errors.useMedicalSupplies.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('useMedicalSupplies') ?? !!request.useMedicalSupplies) &&
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Ki tipo di medikamentu?
                        </Typography>
                        <Controller
                            as={TextField}
                            id="medicalSupplies"
                            name="medicalSupplies"
                            label="Ki tipo di medikamentu?"
                            variant="outlined"
                            fullWidth
                            control={control}
                            error={errors.medicalSupplies ? true : false}
                        />
                        {errors.medicalSupplies && <p style={{ color: '#bf1650' }}>{errors.medicalSupplies.message}</p>}
                    </Grid>

                }
                <Grid item xs={12} sm={JSON.parse(watch('hasWelfare') ?? !!request.hasWelfare) ? 6 : null}>
                    <Controller
                        control={control}
                        name="hasWelfare"
                        error={errors.hasWelfare ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    38. Bo ta risibí yudansa sosial pa motibu di bo estado di salú?
                                </Typography>
                                <RadioGroup aria-label="hasWelfare" name="hasWelfare" value={JSON.parse(value)} onChange={onChange}>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasWelfare && <p style={{ color: '#bf1650' }}>{errors.hasWelfare.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasWelfare') ?? !!request.hasWelfare) &&
                    <>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="subtitle1"
                                color="textPrimary"
                                className={classes.inputTitle}
                            >
                                Ki tipo di yudansa?
                            </Typography>
                            <Controller
                                as={TextField}
                                id="welfare"
                                name="welfare"
                                label="Ki tipo di yudansa?"
                                variant="outlined"
                                fullWidth
                                control={control}
                                error={errors.welfare ? true : false}
                            />
                            {errors.welfare && <p style={{ color: '#bf1650' }}>{errors.welfare.message}</p>}
                        </Grid>
                    </>
                }
                <Grid item xs={12} sm={JSON.parse(watch('hasFuneralInsurance') ?? !!request.hasFuneralInsurance) ? 6 : false}>
                    <Controller
                        control={control}
                        name="hasFuneralInsurance"
                        error={errors.hasFuneralInsurance ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    39. Bo tin seguro di entiero?
                                </Typography>
                                <RadioGroup aria-label="hasFuneralInsurance" name="hasFuneralInsurance" value={JSON.parse(value)} onChange={onChange}>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasFuneralInsurance && <p style={{ color: '#bf1650' }}>{errors.hasFuneralInsurance.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasFuneralInsurance') ?? request.hasFuneralInsurance) &&
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Por fabor indiká na kua kompania
                        </Typography>
                        <Controller
                            control={control}
                            as={
                                <Select>
                                    <MenuItem value="AON Dutch Caribbean">AON Dutch Caribbean</MenuItem>
                                    <MenuItem value="Ennia">Ennia</MenuItem>
                                    <MenuItem value="Entiero na Quota">Entiero na Quota</MenuItem>
                                    <MenuItem value="Extura Curaçao">Extura Curaçao</MenuItem>
                                    <MenuItem value="International Insurance N.V.">International Insurance N.V.</MenuItem>
                                    <MenuItem value="Progressive Insurance">Progressive Insurance</MenuItem>
                                    <MenuItem value="Seguros Anta">Seguros Anta</MenuItem>
                                    <MenuItem value="Guardian Group">Guardian Group</MenuItem>
                                    <MenuItem value="Aska Verzekeringen">Aska Verzekeringen</MenuItem>
                                    <MenuItem value="Inter-Assure Insurance">Inter-Assure Insurance</MenuItem>
                                    <MenuItem value="Nagico Insurances">Nagico Insurances</MenuItem>
                                    <MenuItem value="Sagicor Capital Life">Sagicor Capital Life</MenuItem>
                                    <MenuItem value="Onderlinge hulp">Onderlinge hulp</MenuItem>
                                    <MenuItem value="The New India Assurance CO LTD">The New India Assurance CO LTD</MenuItem>
                                    <MenuItem value="El Tributo">El Tributo</MenuItem>
                                    <MenuItem value="B-sure">B-sure</MenuItem>
                                    <MenuItem value="AVM uitvaartverzekeringen">AVM uitvaartverzekeringen</MenuItem>
                                    <MenuItem value="El Señorial">El Señorial</MenuItem>
                                    <MenuItem value="El Consolador">El Consolador</MenuItem>
                                    <MenuItem value="Sitter">Sitter</MenuItem>
                                    <MenuItem value="Otro">Otro</MenuItem>
                                </Select>
                            }
                            variant="outlined"
                            fullWidth
                            name="funeralInsurance"
                            error={errors.funeralInsurance ? true : false}
                        />
                        {errors.funeralInsurance && <p style={{ color: '#bf1650' }}>{errors.funeralInsurance.message}</p>}
                    </Grid>
                }
                <Grid container item alignItems="center" justify="center" xs={12} sm={6}>
                    <Button
                        variant="contained"
                        type="button"
                        color="secondary"
                        size="large"
                        onClick={handleBack}
                    >
                        Bai Bèk
                    </Button>
                </Grid>
                <Grid container item alignItems="center" justify="center" xs={12} sm={6}>
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        size="large"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Sigiente
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {Object.values(errors).length !== 0 && <Alert severity='error'>{Object.values(errors).map((error, key) => <p key={key}>{error.message}</p>)}</Alert>}
                </Grid>
            </Grid>
        </div>
    )
}

export default HealthForm
