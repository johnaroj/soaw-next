import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import imageCompression from 'browser-image-compression';
import { useForm, Controller } from "react-hook-form"
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { AddressSelect, CountrySelect, StatusSelect } from './General/components'
import { DropzoneArea } from 'material-ui-dropzone'
import {
    useMediaQuery,
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
    CircularProgress
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useKeycloak } from '@react-keycloak/ssr';
import { useMutation, useQuery } from "react-query";
import { Alert } from '@mui/material/Alert';
import { useHistory } from 'react-router-dom';
import DateDropdown from 'components/DateDropdown';

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        fontWeight: 900,
    },
    inputTitle: {
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },
    select: {
        width: '100%',
        padding: '14px 12px'
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


const General = props => {
    const { className, ...rest } = props;
    const history = useHistory()
    const { keycloak } = useKeycloak();
    const { data: exists, isLoading: isExisitsLoading } = useQuery('exists', async () => {
        const result = await fetch(`${process.env.REACT_APP_API}/api/request/user?id=${keycloak.idTokenParsed.sub}&type=2`)
        const data = await result.json()
        return data;
    })

    const [mutateRequest, { isLoading, isSuccess, isError, error }] = useMutation(async (data) => {
        const result = await fetch(`${process.env.REACT_APP_API}/api/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (result.ok) {
            return result.json()
        } else {
            throw `Oops algu a bai robes: ${result.statusText}`;
        }

    }, {
        throwOnError: true
    })

    const [images, setImages] = useState([]);


    const schema = yup.object().shape({
        firstName: yup.string().required('Mester yena nòmber'),
        lastName: yup.string().required('Mester yena fam'),
        registeredAddress: yup.string().nullable().required('Mester yena adrès na kranshi'),
        registeredAddressNumber: yup.string().required('Mester yena number di adrès na kranshi'),
        currentAddress: yup.string().nullable().required('Mester yena adrès aktual'),
        currentAddressNumber: yup.string().required('Mester yena number di adrès aktual'),
        hasDutchNationality: yup.bool().nullable().required('Mester yena nashonalidat'),
        proofOfResident: yup.array().when('hasDutchNationality', {
            is: (val) => val && val === false,
            then: yup.array().required('Mester ‘upload’ bo pèrmit di estadia'),
        }),
        dateOfBirth: yup.string().required('Mester yena fecha di nasementu').test('age', 'Bo mester ta mas ku 18 aña', val => {
            return (
                (new Date(new Date(val).getFullYear() + 18, new Date(val).getMonth(), new Date(val).getDate()))
                < (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))

            )
        }),
        placeOfBirth: yup.string().required('Mester yena pais di nasementu'),
        gender: yup.string().required('Mester yena sekso'),
        phone1: yup.number().test('len', 'Mester ta minimó 7 number', val => !val || (val && val.toString().length >= 7)).moreThan(0, 'Mester yena number di selular'),
        // phone2: yup.number().nullable().min(7, 'Mester yena minimó 7 number'),
        // whatsapp: yup.number().nullable().min(7, 'Mester yena minimó 7 number'),
        email: yup.string().email('Mester ta un “e-mail”').required('Mester yena “e-mail”'),
        confirmEmail: yup.string().oneOf([yup.ref('email'), null], '“E-mail” no ta meskos'),
        identificationNumber: yup.number().test('len', 'Mester ta 10 number', val => !val || (val && val.toString().length === 10)).moreThan(0, 'Mester yena number di identifikashon'),
        identificationType: yup.string().required('Mester skohe e tipo di identifikashon'),
        expiryDate: yup.string().required('Mester yena fecha di vensementu'),
        proofOfID: yup.array().required('Mester ‘upload’ prueba di bo identifikashon'),
        maritalStatus: yup.object().nullable().shape({
            value: yup.string().required()
        }).required('Mester yena estado sivil'),
        lastNamePartner: yup.string().when('maritalStatus', {
            is: (val) => val && (['married', 'registeredPartnership', 'widow', 'divorcedPartnership'].includes(val.value) || val.value === 'hasRelationship'),
            then: yup.string().required('Mester yena fam di kasá'),
        }),
        firstNamePartner: yup.string().when('maritalStatus', {
            is: (val) => val && (['married', 'registeredPartnership', 'widow', 'divorcedPartnership'].includes(val.value) || val.value === 'hasRelationship'),
            then: yup.string().required('Mester yena nòmber di kasá'),
        }),
        identificationNumberPartner: yup.number().when('maritalStatus', {
            is: (val) => val && (['married', 'registeredPartnership', 'widow', 'divorcedPartnership'].includes(val.value) || val.value === 'hasRelationship'),
            then: yup.number().moreThan(0, 'Mester yena number di identifikashon di kasá').test('len', 'Mester ta 10 number', val => !val || (val && val.toString().length === 10)),
        }),
        proofOfPartnerIncome: yup.array().when('maritalStatus', {
            is: (val) => val && val.value === 'married',
            then: yup.array().required('Mester ‘upload’ prueba di entrada di bo kasá"'),
        }),
        proofOfMarriage: yup.array().when('maritalStatus', {
            is: (val) => val && val.value === 'married',
            then: yup.array().required('Mester ‘upload’ prueba di matrimonio, familieboek'),
        }),
        proofOfDivorce: yup.array().when('maritalStatus', {
            is: (val) => val && val.value === 'divorced',
            then: yup.array().required('Mester ‘upload’ prueba di divorsio'),
        }),
        proofOfVerdict: yup.array().when('maritalStatus', {
            is: (val) => val && val.value === 'divorced',
            then: yup.array().required('Mester ‘upload’ prueba di veredikto'),
        }),
        hasChildren: yup.bool().nullable().required('Mester skohe si bo tin yu'),
        amountOfResidents: yup.number().moreThan(0, 'Mester yena kuantu adulto ta biba'),
        // ownChildren: yup.array().when('hasChildren', {
        //     is: (val) => val && val === true,
        //     then: yup.array().required('Mester ‘upload’ akto di nasementu di bo yu(nan)/buki di famia'),
        // })yup.number().min(1, 'Mester skohe kuantu ju'),
        proofOfChildren: yup.array().when('ownChildren', {
            is: (val) => val && val > 0,
            then: yup.array().required('Mester ‘upload’ akto di nasementu di bo yu(nan)/buki di famia'),
        }),
        confirmation: yup.bool().oneOf([true], 'Mester konfirmá ku a yena mas kompleto posibel i segun bèrdat')
    });
    const { control, handleSubmit, errors, watch, getValues, setValue, reset, setError, clearErrors, register } = useForm({
        defaultValues: {
            userId: '',
            firstName: '',
            lastName: '',
            registeredAddress: '',
            registeredAddressNumber: '',
            currentAddress: '',
            currentAddressNumber: '',
            placeOfBirth: 'Curacao',
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
            confirmation: false,
            created: null,
            updated: null
        },
        resolver: yupResolver(schema),
    });

    const onDeleteHandler = (file, category) => {
        setImages(images.filter(image => (image.name !== file.name && image.categoryId !== category)));
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

    const onSubmit = (data) => {
        const newData = {
            ...data,
            images,
            type: 2,
            maritalStatus: data.maritalStatus.value,
            userId: keycloak.idTokenParsed.sub,
            createdBy: 'internet',
            created: new Date().toISOString().substr(0, 10),
            updatedBy: 'internet',
            updated: new Date().toISOString().substr(0, 10),
        }
        mutateRequest(newData)

    }

    const handleBirthdayChange = (date) => {
        setValue('identificationNumber', date.split('-').join(''))
        const year = date.split('-')[0]
        const month = date.split('-')[1]
        const day = date.split('-')[2]
        setValue('dateOfBirth', new Date(+year, +month - 1, +day).toISOString().substr(0, 10))
        if ((new Date(+year + 18, +month - 1, +day))
            > (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))) {
            setError('dateOfBirth', { type: 'date', message: 'Bo mester ta mas ku 18 aña', })
        } else {
            clearErrors('dateOfBirth')
        }
    }

    const handleExpiryDate = (date) => {
        const year = date.split('-')[0]
        const month = date.split('-')[1]
        const day = date.split('-')[2]
        setValue('expiryDate', new Date(+year, +month - 1, +day).toISOString().substr(0, 10))
        clearErrors('expiryDate')
    }

    const classes = useStyles();

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    useEffect(() => {
        if (isSuccess) {
            history.push('/success')
        }
    }, [isSuccess, history])

    const handleWhatsappNumber = (e) => {
        const whatsappNum = '5999' + e.target.value.substr('5999'.length)
        setValue("whatsapp", +whatsappNum);
        return +whatsappNum;
    }

    const handleAutoFillDate = (e) => {
        const id = fixFormatDate() + e.target.value.substr(fixFormatDate().length)
        setValue("identificationNumber", id);
        return id;
    }
    const fixFormatDate = () => {
        const tempMonth = (Number(getValues('monthOfBirth')) + 1).toString()
        const year = getValues('yearOfBirth') || ''
        const month = getValues('monthOfBirth') ? tempMonth.length < 2 ? '0' + tempMonth : tempMonth : ''
        const day = getValues('dayOfBirth') ? getValues('dayOfBirth').length < 2 ? '0' + getValues('dayOfBirth') : getValues('dayOfBirth') : ''

        return year + month + day;
    }

    return (
        isLoading || isExisitsLoading ? <CircularProgress size={180} color="primary" /> :
            isError ? <Alert severity='error' style={{ width: '100%' }}>{error}</Alert> :
                exists.length > 0 ? <Alert severity='warning' style={{ width: '100%' }}>Bo tin un petishon kaba</Alert> :
                    <div className={clsx(classes.root, className)} {...rest}>
                        <Grid container spacing={isMd ? 4 : 2}>

                            <Grid item xs={12}>
                                <Typography variant="h6" color="primary" className={classes.title}>
                                    Informashon General
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    1. Fam
                                </Typography>
                                <Controller
                                    as={TextField}
                                    id="lastName"
                                    name="lastName"
                                    label="Fam"
                                    size="medium"
                                    required
                                    variant="outlined"
                                    fullWidth
                                    control={control}
                                    error={errors.lastName ? true : false}

                                />
                                {errors.lastName && <p style={{ color: '#bf1650' }}>{errors.lastName.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    2. Nòmber
                                </Typography>
                                <Controller
                                    as={TextField}
                                    id="firstName"
                                    name="firstName"
                                    label="Nòmber"
                                    variant="outlined"
                                    size="medium"
                                    required
                                    fullWidth
                                    control={control}
                                    error={errors.firstName ? true : false}
                                />
                                {errors.firstName && <p style={{ color: '#bf1650' }}>{errors.firstName.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    3. Adrès kaminda ta registrá ofisialmente na Kranshi
                                </Typography>
                                <AddressSelect
                                    name="registeredAddress"
                                    label="Adrès kaminda ta registrá ofisialmente na Kranshi"
                                    control={control}
                                    required={true}
                                    placeholder="Si bo no por haña bo adrès, por fabor skibi'é."
                                    error={errors.registeredAddress ? true : false}
                                />
                                {errors.registeredAddress && <p style={{ color: '#bf1650' }}>{errors.registeredAddress.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    4. Number di adrès na Kranshi
                                </Typography>
                                <Controller
                                    as={TextField}
                                    id="registeredAddressNumber"
                                    name="registeredAddressNumber"
                                    label="Number di adrès na Kranshi"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    error={errors.registeredAddressNumber ? true : false}
                                    control={control}
                                />
                                {errors.registeredAddressNumber && <p style={{ color: '#bf1650' }}>{errors.registeredAddressNumber.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    5. Adrès kaminda bo ta biba aktualmente
                                </Typography>
                                <AddressSelect
                                    name="currentAddress"
                                    label="Adrès kaminda bo ta biba aktualmente"
                                    control={control}
                                    required={true}
                                    placeholder="Si bo no por haña bo adrès, por fabor skibi'é"
                                    error={errors.currentAddress ? true : false}
                                />
                                {errors.currentAddress && <p style={{ color: '#bf1650' }}>{errors.currentAddress.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    6. Number di adrès aktual
                                </Typography>
                                <Controller
                                    as={TextField}
                                    id="currentAddressNumber"
                                    name="currentAddressNumber"
                                    label="Number di adrès aktual"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    error={errors.currentAddressNumber ? true : false}
                                    control={control}
                                />
                                {errors.currentAddressNumber && <p style={{ color: '#bf1650' }}>{errors.currentAddressNumber.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    7. Pais di nasementu
                                </Typography>
                                <CountrySelect
                                    control={control}
                                    name="placeOfBirth"
                                    label="Pais di nasementu"
                                    required={true}
                                    error={errors.placeOfBirth ? true : false}
                                />
                                {errors.placeOfBirth && <p style={{ color: '#bf1650' }}>{errors.placeOfBirth.message}</p>}
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Controller
                                    control={control}
                                    name="hasDutchNationality"
                                    error={errors.hasDutchNationality ? true : false}
                                    render={({ onChange, value }) => (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                8. Nashonalidat Hulandes
                                            </Typography>
                                            <RadioGroup aria-label="hasDutchNationality" name="hasDutchNationality" value={JSON.parse(value)} onChange={onChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="Si" />
                                                <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                            </RadioGroup>
                                        </>
                                    )}
                                />
                                {errors.hasDutchNationality && <p style={{ color: '#bf1650' }}>{errors.hasDutchNationality.message}</p>}
                            </Grid>
                            {
                                watch('hasDutchNationality') !== null && !JSON.parse(watch('hasDutchNationality')) &&
                                <Grid item xs={6} sm={3}>
                                    <Typography
                                        variant="subtitle1"
                                        color="textPrimary"
                                        className={classes.inputTitle}
                                    >
                                        ‘Upload’ bo pèrmit di estadia
                                    </Typography>
                                    <Controller
                                        classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                        as={DropzoneArea}
                                        name="proofOfResident"
                                        dropzoneText="‘Upload’ bo pèrmit di estadia (image/* òf .pdf)"
                                        control={control}
                                        error={errors.proofOfResident ? true : false}
                                        onDrop={(files) => onDropHandler(files, 1)}
                                        onDelete={(file) => onDeleteHandler(file, 1)}
                                        filesLimit={1}
                                        acceptedFiles={['image/*', '.pdf']}
                                        showPreviews={true}
                                        showPreviewsInDropzone={false}
                                        useChipsForPreview
                                        previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                        previewChipProps={{ classes: { root: classes.previewChip } }}
                                        previewText="Selected files"
                                    />
                                    {errors.proofOfResident && <p style={{ color: '#bf1650' }}>{errors.proofOfResident.message}</p>}
                                </Grid>
                            }
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    9. Fecha di nasementu
                                </Typography>
                                <DateDropdown
                                    name='dateOfBirth'
                                    startYear={new Date().getFullYear() - 100}
                                    endYear={new Date().getFullYear()}
                                    reverse
                                    register={register}
                                    setDateValue={handleBirthdayChange} />
                                {errors.dateOfBirth && <p style={{ color: '#bf1650' }}>{errors.dateOfBirth.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    10. Number di identifikashon
                                </Typography>
                                <Controller
                                    id="identificationNumber"
                                    name="identificationNumber"
                                    error={errors.identificationNumber ? true : false}
                                    control={control}
                                    render={
                                        ({ value, onChange, onBlur }) => (
                                            <TextField
                                                label="Number di identifikashon"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                type='number'
                                                onBlur={onBlur}
                                                value={value || ''}
                                                onChange={e => onChange(handleAutoFillDate(e))}
                                            />
                                        )
                                    }

                                />
                                {errors.identificationNumber && <p style={{ color: '#bf1650' }}>{errors.identificationNumber.message}</p>}
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="gender"
                                    error={errors.gender ? true : false}
                                    render={({ onChange, value }) => (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                11. Sekso
                                            </Typography>
                                            <RadioGroup aria-label="gender" name="gender" value={value} onChange={onChange} row>
                                                <FormControlLabel value="female" control={<Radio />} label="Femenino" />
                                                <FormControlLabel value="male" control={<Radio />} label="Maskulino" />
                                            </RadioGroup>
                                        </>
                                    )}
                                />
                                {errors.gender && <p style={{ color: '#bf1650' }}>{errors.gender.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    control={control}
                                    name="identificationType"
                                    error={errors.identificationType ? true : false}
                                    render={({ onChange, value }) => (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                12. Ki tipo di identifikashon lo bo bai usa, pa identifiká bo mes?
                                            </Typography>
                                            <RadioGroup aria-label="identificationType" name="identificationType" value={value} onChange={onChange} row>
                                                <FormControlLabel value="driversLicense" control={<Radio />} label="Reibeweis" />
                                                <FormControlLabel value="ID" control={<Radio />} label="Sédula" />
                                            </RadioGroup>
                                        </>
                                    )}
                                />
                                {errors.identificationType && <p style={{ color: '#bf1650' }}>{errors.identificationType.message}</p>}
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    13. Fecha di vensementu di e {watch('identificationType') === 'driversLicense' ? 'reibeweis' : 'sédula'}
                                </Typography>
                                <DateDropdown
                                    name='expiryDate'
                                    startYear={new Date().getFullYear() - 10}
                                    endYear={new Date().getFullYear() + 10}
                                    reverse
                                    register={register}
                                    setDateValue={handleExpiryDate} />
                                {errors.expiryDate && <p style={{ color: '#bf1650' }}>{errors.expiryDate.message}</p>}

                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    ‘Upload’ prueba di bo identifikashon
                                </Typography>
                                <Controller
                                    classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                    as={DropzoneArea}
                                    dropzoneText={`‘Upload’ prueba di bo identifikashon`}
                                    name="proofOfID"
                                    label="‘Upload’ prueba di entrada di bo kas"
                                    control={control}
                                    error={errors.proofOfID ? true : false}
                                    onDrop={(files) => onDropHandler(files, 22)}
                                    onDelete={(file) => onDeleteHandler(file, 22)}
                                    filesLimit={1}
                                    acceptedFiles={['image/*', '.pdf']}
                                    showPreviews={true}
                                    showPreviewsInDropzone={false}
                                    useChipsForPreview
                                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                    previewChipProps={{ classes: { root: classes.previewChip } }}
                                    previewText="Selected files"
                                />
                                {errors.proofOfID && <p style={{ color: '#bf1650' }}>{errors.proofOfID.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    14. Number di telefòn di selular
                                </Typography>
                                <Controller
                                    id="phone1"
                                    name="phone1"
                                    control={control}
                                    render={
                                        ({ value, onChange, onBlur }) => (
                                            <TextField
                                                label="Number di telefòn di selular"
                                                variant="outlined"
                                                type='number'
                                                required
                                                fullWidth
                                                value={value || ''}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={errors.phone1 ? true : false}
                                            />
                                        )
                                    }

                                />
                                {errors.phone1 && <p style={{ color: '#bf1650' }}>{errors.phone1.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Number di telefòn di whatsapp
                                </Typography>
                                <Controller
                                    control={control}
                                    id="whatsapp"
                                    name="whatsapp"
                                    render={({ value, onChange, onBlur }) => (
                                        <TextField
                                            label="Number di telefòn di whatsapp"
                                            fullWidth
                                            type='number'
                                            variant="outlined"
                                            value={value || ''}
                                            onChange={e => onChange(handleWhatsappNumber(e))}
                                            onBlur={onBlur}
                                        />
                                    )}


                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    15. Number di telefòn kas
                                </Typography>
                                <Controller
                                    id="phone2"
                                    name="phone2"
                                    control={control}
                                    render={
                                        ({ value, onChange, onBlur }) => (
                                            <TextField
                                                label="Number di telefòn kas"
                                                variant="outlined"
                                                type='number'
                                                fullWidth
                                                value={value || ''}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                error={errors.phone2 ? true : false}
                                            />
                                        )
                                    }

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    16. E-mail
                                </Typography>
                                <Controller
                                    as={TextField}
                                    id="email"
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    type='email'
                                    fullWidth
                                    control={control}
                                    error={errors.email ? true : false}
                                />
                                {errors.email && <p style={{ color: '#bf1650' }}>{errors.email.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    17. Konfirmá e-mail
                                </Typography>
                                <Controller
                                    as={TextField}
                                    id="confirmEmail"
                                    name="confirmEmail"
                                    label="Konfirmá Email"
                                    variant="outlined"
                                    type='email'
                                    fullWidth
                                    control={control}
                                    error={errors.confirmEmail ? true : false}
                                />
                                {errors.confirmEmail && <p style={{ color: '#bf1650' }}>{errors.confirmEmail.message}</p>}
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    18. Estado sivil
                                </Typography>
                                <StatusSelect
                                    label="Estado sivil"
                                    control={control}
                                    required={true}
                                    error={errors.maritalStatus ? true : false}
                                />
                                {errors.maritalStatus && <p style={{ color: '#bf1650' }}>{errors.maritalStatus.message}</p>}
                            </Grid>
                            {['divorced', 'divorcedPartnership'].includes(watch("maritalStatus")?.value) &&
                                (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                ‘Upload’ prueba di divorsio {watch("maritalStatus")?.value === 'divorcedPartnership' && `di konbibensia legalisá di pareha`}
                                            </Typography>
                                            <Controller
                                                classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                                as={DropzoneArea}
                                                name="proofOfDivorce"
                                                dropzoneText={`‘Upload’ prueba di divorsio ${watch("maritalStatus")?.value === 'divorcedPartnership' && `di konbibensia legalisá di pareha`}(image/* òf .pdf)`}
                                                control={control}
                                                error={errors.proofOfDivorce ? true : false}
                                                onDrop={(files) => onDropHandler(files, 5)}
                                                onDelete={(file) => onDeleteHandler(file, 5)}
                                                filesLimit={1}
                                                acceptedFiles={['image/*', '.pdf']}
                                                showPreviews={true}
                                                showPreviewsInDropzone={false}
                                                useChipsForPreview
                                                previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                                previewChipProps={{ classes: { root: classes.previewChip } }}
                                                previewText="Selected files"
                                            />
                                            {errors.proofOfDivorce && <p style={{ color: '#bf1650' }}>{errors.proofOfDivorce.message}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                ‘Upload’ prueba di veredikto
                                            </Typography>
                                            <Controller
                                                classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                                as={DropzoneArea}
                                                name="proofOfVerdict"
                                                dropzoneText={`‘Upload’ prueba di veredikto (image/* òf .pdf)`}
                                                control={control}
                                                error={errors.proofOfVerdict ? true : false}
                                                onDrop={(files) => onDropHandler(files, 21)}
                                                onDelete={(file) => onDeleteHandler(file, 21)}
                                                filesLimit={1}
                                                acceptedFiles={['image/*', '.pdf']}
                                                showPreviews={true}
                                                showPreviewsInDropzone={false}
                                                useChipsForPreview
                                                previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                                previewChipProps={{ classes: { root: classes.previewChip } }}
                                                previewText="Selected files"
                                            />
                                            {errors.proofOfVerdict && <p style={{ color: '#bf1650' }}>{errors.proofOfVerdict.message}</p>}
                                        </Grid>
                                    </>)
                            }
                            {watch("maritalStatus")?.value === 'divorced' || watch("maritalStatus")?.value === 'single' ?
                                (<Grid item xs={12}>
                                    <Controller
                                        control={control}
                                        name="hasRelationship"
                                        error={errors.children ? true : false}
                                        render={({ onChange, value }) => (
                                            <>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textPrimary"
                                                    className={classes.inputTitle}
                                                >
                                                    Bo ta den un relashon aktualmente?
                                                </Typography>
                                                <RadioGroup aria-label="hasRelationship" name="hasRelationship" value={JSON.parse(value)} onChange={onChange} row>
                                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                                </RadioGroup>
                                            </>
                                        )}
                                    />
                                    {errors.hasRelationship && <p style={{ color: '#bf1650' }}>{errors.hasRelationship.message}</p>}
                                </Grid>) : null
                            }

                            {
                                ['married', 'registeredPartnership', 'widow', 'divorcedPartnership'].includes(watch("maritalStatus")?.value) || JSON.parse(watch('hasRelationship')) ?
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Fam di {watch("maritalStatus")?.value === "married" ? "kasá" : watch("maritalStatus")?.value === "widow" ? "kasá ku a fayesé" : "pareha"}
                                            </Typography>
                                            <Controller
                                                as={TextField}
                                                id="lastNamePartner"
                                                name="lastNamePartner"
                                                label="Fam"
                                                size="medium"
                                                required
                                                variant="outlined"
                                                fullWidth
                                                control={control}
                                                error={errors.lastNamePartner ? true : false}
                                            />
                                            {errors.lastNamePartner && <p style={{ color: '#bf1650' }}>{errors.lastNamePartner.message}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Nòmber di {watch("maritalStatus")?.value === "married" ? "kasá" : watch("maritalStatus")?.value === "widow" ? "kasá ku a fayesé" : "pareha"}
                                            </Typography>
                                            <Controller
                                                as={TextField}
                                                id="firstNamePartner"
                                                name="firstNamePartner"
                                                label="Nòmber"
                                                variant="outlined"
                                                size="medium"
                                                required
                                                fullWidth
                                                control={control}
                                                error={errors.firstNamePartner ? true : false}
                                            />
                                            {errors.firstNamePartner && <p style={{ color: '#bf1650' }}>{errors.firstNamePartner.message}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Number di identifikashon riba sédula di {watch("maritalStatus")?.value === "married" ? "kasá" : watch("maritalStatus")?.value === "widow" ? "kasá ku a fayesé" : "pareha"}
                                            </Typography>
                                            <Controller
                                                id="identificationNumberPartner"
                                                name="identificationNumberPartner"
                                                control={control}
                                                render={
                                                    ({ value, onChange }) => (
                                                        <TextField
                                                            label={`Number di identifikashon riba sédula di ${watch("maritalStatus")?.value === "married" ? "kasá" : watch("maritalStatus")?.value === "widow" ? "kasá ku a fayesé" : "pareha"}`}
                                                            variant="outlined"
                                                            type='number'
                                                            fullWidth
                                                            error={errors.identificationNumberPartner ? true : false}
                                                            value={value || ''}
                                                            onChange={onChange}
                                                        />
                                                    )
                                                }

                                            />
                                            {errors.identificationNumberPartner && <p style={{ color: '#bf1650' }}>{errors.identificationNumberPartner.message}</p>}
                                        </Grid>
                                        {
                                            ['married', 'registeredPartnership', 'single', 'divorced'].includes(watch("maritalStatus")?.value) &&
                                            <Grid item xs={12} sm={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textPrimary"
                                                    className={classes.inputTitle}
                                                >
                                                    ‘Upload’ prueba di entrada di bo {watch("maritalStatus")?.value === "married" ? 'kasá' : 'pareha'}
                                                </Typography>
                                                <Controller
                                                    classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                                    as={DropzoneArea}
                                                    dropzoneText={`‘Upload’ prueba di entrada di bo ${watch("maritalStatus")?.value === "married" ? 'kasá' : 'pareha'} (image/* òf .pdf)`}
                                                    name="proofOfPartnerIncome"
                                                    label="‘Upload’ prueba di entrada di bo kas"
                                                    control={control}
                                                    error={errors.proofOfPartnerIncome ? true : false}
                                                    onDrop={(files) => onDropHandler(files, 2)}
                                                    onDelete={(file) => onDeleteHandler(file, 2)}
                                                    filesLimit={1}
                                                    acceptedFiles={['image/*', '.pdf']}
                                                    showPreviews={true}
                                                    showPreviewsInDropzone={false}
                                                    useChipsForPreview
                                                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                                    previewChipProps={{ classes: { root: classes.previewChip } }}
                                                    previewText="Selected files"
                                                />
                                                {errors.proofOfPartnerIncome && <p style={{ color: '#bf1650' }}>{errors.proofOfPartnerIncome.message}</p>}
                                            </Grid>
                                        }
                                        {
                                            ['registeredPartnership', 'married'].includes(watch("maritalStatus")?.value) &&
                                            <Grid item xs={12} sm={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textPrimary"
                                                    className={classes.inputTitle}
                                                >
                                                    {`‘Upload’ prueba di ${watch("maritalStatus")?.value === 'married' ? 'matrimonio òf buki di matrimonio' : 'konbibensia legalisá di pareha'}`}
                                                </Typography>
                                                <Controller
                                                    classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                                    as={DropzoneArea}
                                                    dropzoneText={`‘Upload’ prueba di ${watch("maritalStatus")?.value === 'married' ? 'matrimonio òf buki di matrimonio' : 'konbibensia legalisá di pareha'} (image/* òf .pdf)`}
                                                    name="proofOfMarriage"
                                                    label="Prueba di matrimonio"
                                                    control={control}
                                                    error={errors.proofOfMarriage ? true : false}
                                                    onDrop={(files) => onDropHandler(files, watch("maritalStatus")?.value === 'married' ? 3 : 4)}
                                                    onDelete={(file) => onDeleteHandler(file, watch("maritalStatus")?.value === 'married' ? 3 : 4)}
                                                    filesLimit={1}
                                                    acceptedFiles={['image/*', '.pdf']}
                                                    showPreviews={true}
                                                    showPreviewsInDropzone={false}
                                                    useChipsForPreview
                                                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                                    previewChipProps={{ classes: { root: classes.previewChip } }}
                                                    previewText="Selected files"
                                                />
                                                {errors.proofOfMarriage && <p style={{ color: '#bf1650' }}>{errors.proofOfMarriage.message}</p>}
                                            </Grid>
                                        }
                                        {watch("maritalStatus")?.value === 'widow' &&
                                            <Grid item xs={12} sm={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textPrimary"
                                                    className={classes.inputTitle}
                                                >
                                                    ‘Upload’ e prueba di fayesementu di bo kasá
                                                </Typography>
                                                <Controller
                                                    classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                                    as={DropzoneArea}
                                                    dropzoneText="‘Upload’ e prueba di fayesementu di bo kasá(image/* òf .pdf)"
                                                    name="proofOfDeath"
                                                    label="Prueba di matrimonio"
                                                    control={control}
                                                    error={errors.proofOfDeath ? true : false}
                                                    onDrop={(files) => onDropHandler(files, 6)}
                                                    onDelete={(file) => onDeleteHandler(file, 6)}
                                                    filesLimit={1}
                                                    acceptedFiles={['image/*', '.pdf']}
                                                    showPreviews={true}
                                                    showPreviewsInDropzone={false}
                                                    useChipsForPreview
                                                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                                    previewChipProps={{ classes: { root: classes.previewChip } }}
                                                    previewText="Selected files"
                                                />
                                                {errors.proofOfDeath && <p style={{ color: '#bf1650' }}>{errors.proofOfDeath.message}</p>}
                                            </Grid>
                                        }

                                    </> : null
                            }
                            {
                                watch("maritalStatus")?.value === 'single' &&
                                (<Grid item xs={12}>
                                    <Controller
                                        control={control}
                                        name="livingTogether"
                                        error={errors.children ? true : false}
                                        render={({ onChange, value }) => (
                                            <>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textPrimary"
                                                    className={classes.inputTitle}
                                                >
                                                    Bo ta biba huntu ku bo pareha?
                                                </Typography>
                                                <RadioGroup aria-label="livingTogether" name="livingTogether" value={JSON.parse(value)} onChange={onChange} row>
                                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                                </RadioGroup>
                                            </>
                                        )}
                                    />
                                    {errors.livingTogether && <p style={{ color: '#bf1650' }}>{errors.livingTogether.message}</p>}
                                </Grid>)
                            }
                            {
                                watch('livingTogether') && JSON.parse(watch('livingTogether')) && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Na kua adrès boso ta biba?
                                            </Typography>
                                            <AddressSelect
                                                name="livingTogetherAddress"
                                                label="Na kua adrès boso ta biba"
                                                control={control}
                                                required={true}
                                                error={errors.livingTogetherAddress ? true : false}
                                            />
                                            {errors.livingTogetherAddress && <p style={{ color: '#bf1650' }}>{errors.livingTogetherAddress.message}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Na kua number di adrès boso ta biba?
                                            </Typography>
                                            <Controller
                                                as={TextField}
                                                id="livingTogetherAddressNumber"
                                                name="livingTogetherAddressNumber"
                                                label="Na kua number di adrès boso ta biba? "
                                                variant="outlined"
                                                required
                                                fullWidth
                                                error={errors.livingTogetherAddressNumber ? true : false}
                                                control={control}
                                            />
                                            {errors.livingTogetherAddressNumber && <p style={{ color: '#bf1650' }}>{errors.livingTogetherAddressNumber.message}</p>}
                                        </Grid>
                                    </>
                                )
                            }

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="hasChildren"
                                    error={errors.children ? true : false}
                                    render={({ onChange, value }) => (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                19. Bo tin yu?
                                            </Typography>
                                            <RadioGroup aria-label="hasChildren" name="hasChildren" value={JSON.parse(value)} onChange={onChange} row>
                                                <FormControlLabel value={true} control={<Radio />} label="Si" />
                                                <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                            </RadioGroup>
                                        </>
                                    )}
                                />
                                {errors.hasChildren && <p style={{ color: '#bf1650' }}>{errors.hasChildren.message}</p>}
                            </Grid>
                            {
                                JSON.parse(watch('hasChildren')) ?
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Yu propio
                                            </Typography>
                                            <Controller
                                                control={control}
                                                as={
                                                    <Select>
                                                        <MenuItem value={0}></MenuItem>
                                                        <MenuItem value={1}>1</MenuItem>
                                                        <MenuItem value={2}>2</MenuItem>
                                                        <MenuItem value={3}>3</MenuItem>
                                                        <MenuItem value={4}>4</MenuItem>
                                                        <MenuItem value={5}>5</MenuItem>
                                                        <MenuItem value={6}>6</MenuItem>
                                                        <MenuItem value={7}>7</MenuItem>
                                                        <MenuItem value={8}>8</MenuItem>
                                                        <MenuItem value={9}>9</MenuItem>

                                                    </Select>
                                                }
                                                variant="outlined"
                                                fullWidth
                                                name="ownChildren"
                                                error={errors.ownChildren ? true : false}
                                            />
                                            {errors.ownChildren && <p style={{ color: '#bf1650' }}>{errors.ownChildren.message}</p>}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Yu di kriansa
                                            </Typography>
                                            <Controller
                                                control={control}
                                                as={
                                                    <Select>
                                                        <MenuItem value={0}></MenuItem>
                                                        <MenuItem value={1}>1</MenuItem>
                                                        <MenuItem value={2}>2</MenuItem>
                                                        <MenuItem value={3}>3</MenuItem>
                                                        <MenuItem value={4}>4</MenuItem>
                                                        <MenuItem value={5}>5</MenuItem>
                                                        <MenuItem value={6}>6</MenuItem>
                                                        <MenuItem value={7}>7</MenuItem>
                                                        <MenuItem value={8}>8</MenuItem>
                                                        <MenuItem value={9}>9</MenuItem>

                                                    </Select>
                                                }
                                                variant="outlined"
                                                fullWidth
                                                name="notOwnChildren"
                                                error={errors.notOwnChildren ? true : false}
                                            />
                                            {errors.notOwnChildren && <p style={{ color: '#bf1650' }}>{errors.notOwnChildren.message}</p>}
                                        </Grid>
                                    </> :
                                    null
                            }
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Kuantu adulto ta biba
                                </Typography>
                                <Controller
                                    control={control}
                                    as={
                                        <Select>
                                            <MenuItem value={0}></MenuItem>
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>

                                        </Select>
                                    }
                                    variant="outlined"
                                    fullWidth
                                    name="amountOfResidents"
                                    error={errors.amountOfResidents ? true : false}
                                />
                                {errors.amountOfResidents && <p style={{ color: '#bf1650' }}>{errors.amountOfResidents.message}</p>}
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    name="confirmation"
                                    render={({ onChange, value }) => (

                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Konfirmashon
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        name="confirmation"
                                                        value={value}
                                                        onChange={e => onChange(e.target.checked)}
                                                        style={{ alignSelf: 'start', paddingTop: 0 }}
                                                    />}

                                                label="Mi ta deklará ku mi a kontestá tur e preguntanan di e formulario mas kompleto posibel i segun bèrdat.
                        Mi ta pèrmití e autoridatnan di Gobiernu di Korsou pa kontrolá si mi ta bin na remarke pa mi petishon, pa bishitá kaminda mi ta biba kontrolando esey i pa verifiká mi datos nan i interkambiá mi informashon ku otro instansia relevante, por ehempel registro nan di residente ('Kranshi'), di trahador (SVB, Kamera di Komersio, MEO, posibel dunador nan di trabou, etc.), di poseshon di bien nan immobil (por ehempel kas, outo, boto), departamentu di estadistika, etc.
                        Mi ta komprondé ku dunamentu di informashon inkompleto i/òf inkorekto i/òf uso di dokumentunan falsu ta un hecho kastigabel, i por tin komo konsekuensha ku ta revoká e desishon di duna ònderstant i ku lo pasa e kaso den man di òutoridatnan hudisial, i ku lo rekobrá fondo nan ku a risibí."
                                                labelPlacement="end"
                                            />
                                        </>
                                    )}
                                />
                                {errors.confirmation && <p style={{ color: '#bf1650' }}>{errors.confirmation.message}</p>}
                            </Grid>
                            <Grid container item alignItems="center" justify="center" xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color={isLoading ? 'default' : 'primary'}
                                    size="large"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {isLoading ? <CircularProgress /> : 'Entregá petishon'}
                                </Button>
                            </Grid>
                            <Grid container item alignItems="center" justify="center" xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="secondary"
                                    size="large"
                                    onClick={() => reset()}
                                >
                                    Kanselá
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                {Object.values(errors).length !== 0 && <Alert severity='error'>{Object.values(errors).map((error, key) => <p key={key}>{error.message}</p>)}</Alert>}
                            </Grid>
                        </Grid>
                    </div >
    );
};

General.propTypes = {
    /**
     * External classes
     */
    className: PropTypes.string,
};

export default General;
