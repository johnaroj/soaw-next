import React, { useState } from 'react';
import clsx from 'clsx';
import imageCompression from 'browser-image-compression';
import { useForm, Controller } from "react-hook-form"
import { makeStyles } from '@mui/styles';
import { DropzoneArea } from 'material-ui-dropzone'
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
    useTheme,
    useMediaQuery,
    Alert
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useStateValue } from 'StateProvider';


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


const PropertyForm = (props) => {
    const { className, handleNext, handleBack, ...rest } = props;
    const { request, setRequest } = useStateValue()
    const [images, setImages] = useState([])
    const classes = useStyles();

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    const schema = yup.object().shape({
        hasVehicle: yup.bool().nullable().required('Mester skohe si bo tin kas ta vehiculo'),
        vehicle: yup.string().when('hasVehicle', {
            is: val => val && val === true,
            then: yup.string().required('Mester yena ki tipo di vehikulo')
        }),
        numberPlate: yup.string().when('hasVehicle', {
            is: val => val && val === true,
            then: yup.string().required('Mester yena e plachi number')
        }),
        hasBoat: yup.bool().nullable().required('Mester skohe si bo tin boto'),
        boatInformation: yup.string().when('hasBoat', {
            is: val => val && val === true,
            then: yup.string().nullable().required('Mester yena datos di registrashon di e boto')
        }),
        hasRentedHouse: yup.bool().nullable().required('Mester skohe si bo tin kas ta hür'),
        hasBankAccount: yup.bool().nullable().required('Mester skohe si bo tin kuenta di banko'),
        bankAccountType: yup.string().when('hasBankAccount', {
            is: val => val && val === true,
            then: yup.string().required('Mester skohe ki tipo di kuenta di banko')
        }),
        currentAccountStatements: yup.array().when('bankAccountType', {
            is: val => val && (val === 'current' || val === 'both'),
            then: yup.array().required('Mester ‘upload’ último dos statement di bo kuenta di koriente')
        }),
        savingsAccountStatements: yup.array().when('bankAccountType', {
            is: val => val && (val === 'savings' || val === 'both'),
            then: yup.array().required('Mester ‘upload’ último dos statement di bo kuenta di spar')
        }),
        hasMoreSourceOfIncome: yup.bool().nullable().required('Mester skohe si bo tin mas fuente di entrada'),
        moreSourceOfIncome: yup.string().when('hasMoreSourceOfIncome', {
            is: val => val && val === true,
            then: yup.string().required('Mester spesifiká esaki')
        }),
        rentalMonthlyPrice: yup.string().when('hasRentedHouse', {
            is: val => val && val === true,
            then: yup.string().required('Mester yena e montante pa luna')
        }),
        hasOwnHouse: yup.bool().nullable().required('Mester skohe si bo ta biba den bo mes kas'),
        payingMortgage: yup.bool().nullable().when('hasOwnHouse', {
            is: val => val && val === true,
            then: yup.bool().nullable().required('Mester skohe si bo ta pagando hipotek'),
        }),
        reasonNotPayingMortgage: yup.string().when('payingMortgage', {
            is: val => val !== null && val === false,
            then: yup.string().required('Mester yena dikon bo no ta pagando hipotek')
        }),
        notOwnHouse: yup.string().nullable().when('hasOwnHouse', {
            is: val => val !== null && val === false,
            then: yup.string().nullable().required('Mester skohe si bo ta biba den bo mes kas'),
        }),
        houseAddress: yup.string().when('hasOwnHouse', {
            is: val => val && val === true,
            then: yup.string().required('Mester yena e adres')
        }).when('hasOwnHouse', {
            is: val => (val !== null) && val === false,
            then: yup.string().required('Mester yena e adres')
        }),
        houseMortgageDebt: yup.string().when('payingMortgage', {
            is: val => val && val === true,
            then: yup.string().required('Mester yena e montante')
        }),
        houseRentalPrice: yup.string().when('notOwnHouse', {
            is: val => val && ['rent', 'fkp'].includes(val),
            then: yup.string().required('Mester yena kuantu sèn bo ta paga na hür')
        }),
        houseContribution: yup.string().when('notOwnHouse', {
            is: val => val && val === 'liveIn',
            then: yup.string().required('Mester yena kuantu sèn bo ta paga na kontribushon')
        }),
        liveInDescription: yup.string().when('notOwnHouse', {
            is: val => val && val === 'liveIn',
            then: yup.string().required('Mester spesifiká na unda bo ta kedando')
        }),
        // houseResidents: [],
        proofOfRentalContract: yup.array().when('notOwnHouse', {
            is: val => val && ['rent', 'fkp'].includes(val),
            then: yup.array().required('Mester ‘upload’ kòntrakt di hur of apoderashon')
        }),
        otherHousing: yup.string().when('notOwnHouse', {
            is: val => val && val === 'other',
            then: yup.string().nullable().required('Mester otro')
        }),
        hasDependents: yup.bool().nullable().required('Mester skohe si tin mas persona ta depende di bo finansieramente'),
        hasSignupFkp: yup.bool().nullable().required('Mester skohe si bo ta inskribí na FKP pa bo risibí un kas'),
        signupFkpYear: yup.number().nullable().test('len', 'Mester ta 4 number', val => !val || (val && val.toString().length === 4)).moreThan(0, 'Mester yena for di ki aña'),
        fkpPoints: yup.number().nullable().moreThan(0, 'Mester yena e kantidat di punto'),
        dependents: yup.array().when('hasDependents', {
            is: val => val === true,
            then: yup.array().required('Mester yena ken mas ta biba den kas kubo')
        }),
    })

    const { control, handleSubmit, errors, watch, getValues, setValue } = useForm({
        defaultValues: request,
        resolver: yupResolver(schema),
    })

    const onDeleteHandler = (file) => {
        setImages(images.filter(image => image !== file));
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

    const handleDependentsSelect = (checkedName) => {
        const newNames = getValues('dependents')?.includes(checkedName)
            ? getValues('dependents')?.filter(name => name !== checkedName)
            : [...(getValues('dependents') ?? []), checkedName];

        setValue('dependents', newNames);
        return newNames;
    }

    const handleHouseResidentsSelect = (checkedName) => {
        const newNames = getValues('houseResidents')?.includes(checkedName)
            ? getValues('houseResidents')?.filter(name => name !== checkedName)
            : [...(getValues('houseResidents') ?? []), checkedName];

        setValue('houseResidents', newNames);
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
                        Propiedat
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textPrimary" className={classes.inputTitle}>
                        23. Kiko ta bo propiedatnan
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="hasVehicle"
                        error={errors.hasVehicle ? true : false}
                        render={({ onChange, value }) => {
                            return <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Bo tin vehíkulo?
                                </Typography>
                                <RadioGroup aria-label="hasVehicle" name="hasVehicle" value={JSON.parse(value)} onChange={onChange} row>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        }
                        }
                    />
                    {errors.hasVehicle && <p style={{ color: '#bf1650' }}>{errors.hasVehicle.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasVehicle') ?? request.hasVehicle) &&
                    <>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="subtitle1"
                                color="textPrimary"
                                className={classes.inputTitle}
                            >
                                Kiko ta e tipo di vehíkulo
                            </Typography>
                            <Controller
                                as={TextField}
                                id="vehicle"
                                name="vehicle"
                                label="Kiko ta e tipo di vehíkulo"
                                variant="outlined"
                                fullWidth
                                control={control}
                                error={errors.vehicle ? true : false}
                            />
                            {errors.vehicle && <p style={{ color: '#bf1650' }}>{errors.vehicle.message}</p>}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="subtitle1"
                                color="textPrimary"
                                className={classes.inputTitle}
                            >
                                Kiko ta e plachi number?
                            </Typography>
                            <Controller
                                as={TextField}
                                id="numberPlate"
                                name="numberPlate"
                                label="Kiko ta e plachi number?"
                                variant="outlined"
                                fullWidth
                                control={control}
                                error={errors.numberPlate ? true : false}
                            />
                            {errors.numberPlate && <p style={{ color: '#bf1650' }}>{errors.numberPlate.message}</p>}
                        </Grid>
                    </>
                }

                <Grid item xs={12} sm={JSON.parse(watch('hasBoat') ?? request.hasBoat) ? 6 : false}>
                    <Controller
                        control={control}
                        name="hasBoat"
                        error={errors.hasBoat ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Bo tin boto
                                </Typography>
                                <RadioGroup aria-label="hasBoat" name="hasBoat" value={JSON.parse(value)} onChange={onChange} row>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasBoat && <p style={{ color: '#bf1650' }}>{errors.hasBoat.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasBoat') ?? request.hasBoat) &&
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Kiko ta su datos di registrashon?
                        </Typography>
                        <Controller
                            as={TextField}
                            id="boatInformation"
                            name="boatInformation"
                            label="Kiko ta su datos di registrashon?"
                            variant="outlined"
                            fullWidth
                            control={control}
                            error={errors.boatInformation ? true : false}
                        />
                        {errors.boatInformation && <p style={{ color: '#bf1650' }}>{errors.boatInformation.message}</p>}
                    </Grid>
                }
                <Grid item xs={12} sm={JSON.parse(watch('hasRentedHouse') ?? request.hasRentedHouse) ? 6 : false}>
                    <Controller
                        control={control}
                        name="hasRentedHouse"
                        error={errors.hasRentedHouse ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Bo tin kas ta hür
                                </Typography>
                                <RadioGroup aria-label="hasRentedHouse" name="hasRentedHouse" value={JSON.parse(value)} onChange={onChange} row>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasRentedHouse && <p style={{ color: '#bf1650' }}>{errors.hasRentedHouse.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasRentedHouse') ?? request.hasRentedHouse) &&
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Kuantu esaki ta generá pa luna?
                        </Typography>
                        <Controller
                            as={TextField}
                            id="rentalMonthlyPrice"
                            name="rentalMonthlyPrice"
                            label="Kuantu esaki ta generá pa luna?"
                            variant="outlined"
                            fullWidth
                            control={control}
                            error={errors.rentalMonthlyPrice ? true : false}
                        />
                        {errors.rentalMonthlyPrice && <p style={{ color: '#bf1650' }}>{errors.rentalMonthlyPrice.message}</p>}
                    </Grid>
                }
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="hasBankAccount"
                        error={errors.hasBankAccount ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Bo tin kuenta di banko?
                                </Typography>
                                <RadioGroup aria-label="hasBankAccount" name="hasBankAccount" value={JSON.parse(value)} onChange={onChange} row>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasBankAccount && <p style={{ color: '#bf1650' }}>{errors.hasBankAccount.message}</p>}
                </Grid>
                {
                    JSON.parse(watch('hasBankAccount') ?? request.hasBankAccount) &&
                    <Grid item xs={12}>
                        <Controller
                            control={control}
                            name="bankAccountType"
                            error={errors.bankAccountType ? true : false}
                            render={({ onChange, value }) => (
                                <>
                                    <Typography
                                        variant="subtitle1"
                                        color="textPrimary"
                                        className={classes.inputTitle}
                                    >
                                        Ki tipo di kuenta di banko bo tin?
                                    </Typography>
                                    <RadioGroup aria-label="bankAccountType" name="bankAccountType" value={value} onChange={onChange} row>
                                        <FormControlLabel value="current" control={<Radio />} label="kuenta di koriente" />
                                        <FormControlLabel value="savings" control={<Radio />} label="kuenta di spar" />
                                        <FormControlLabel value="both" control={<Radio />} label="tur dos" />
                                    </RadioGroup>
                                </>
                            )}
                        />
                        {errors.bankAccountType && <p style={{ color: '#bf1650' }}>{errors.bankAccountType.message}</p>}
                    </Grid>
                }
                {
                    ((watch('bankAccountType') ?? request.bankAccountType) === 'current' || (watch('bankAccountType') ?? request.bankAccountType) === 'both') &&
                    <Grid item xs={12} sm={((watch('bankAccountType') ?? request.bankAccountType) === 'savings' || (watch('bankAccountType') ?? request.bankAccountType) === 'both') ? 6 : false}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Kuenta koriente di bo banko
                        </Typography>
                        <Controller
                            classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                            name="currentAccountStatements"
                            control={control}
                            render={({ field }) => (
                                <DropzoneArea
                                    {...field}
                                    clearOnUnmount={false}
                                    initialFiles={request.currentAccountStatements}
                                    dropzoneText="‘Upload’ último dos statement di bo kuenta koriente (image/* òf .pdf)"

                                    error={errors.currentAccountStatements ? true : false}
                                    onDrop={(files) => onDropHandler(files, 10)}
                                    onDelete={(file) => onDeleteHandler(file, 10)}
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
                        {errors.currentAccountStatements && <p style={{ color: '#bf1650' }}>{errors.currentAccountStatements.message}</p>}
                    </Grid>
                }
                {
                    ((watch('bankAccountType') ?? request.bankAccountType) === 'savings' || (watch('bankAccountType') ?? request.bankAccountType) === 'both') &&
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Kuenta di spar di bo banko
                        </Typography>

                        <Controller
                            classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                            name="savingsAccountStatements"
                            control={control}
                            render={({ field }) => (
                                <DropzoneArea
                                    {...field}
                                    initialFiles={request.savingsAccountStatements}
                                    dropzoneText="‘Upload’ último dos statement di bo kuenta di spar(image/* òf .pdf)"

                                    error={errors.savingsAccountStatements ? true : false}
                                    onDrop={(files) => onDropHandler(files, 11)}
                                    onDelete={(file) => onDeleteHandler(file, 11)}
                                    clearOnUnmount={false}
                                    acceptedFiles={['image/*', '.pdf']}
                                    showPreviews={true}
                                    showPreviewsInDropzone={false}
                                    useChipsForPreview
                                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                    previewChipProps={{ classes: { root: classes.previewChip } }}
                                    previewText="Selected files"
                                />
                            )} />
                        {errors.savingsAccountStatements && <p style={{ color: '#bf1650' }}>{errors.savingsAccountStatements.message}</p>}
                    </Grid>
                }

                <Grid item xs={12} sm={JSON.parse(watch('hasMoreSourceOfIncome') ?? request.hasMoreSourceOfIncome) ? 6 : false}>
                    <Controller
                        control={control}
                        name="hasMoreSourceOfIncome"
                        error={errors.hasMoreSourceOfIncome ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Bo tin mas fuente di entrada?
                                </Typography>
                                <RadioGroup aria-label="hasMoreSourceOfIncome" name="hasMoreSourceOfIncome" value={JSON.parse(value)} onChange={onChange} row>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasMoreSourceOfIncome && <p style={{ color: '#bf1650' }}>{errors.hasMoreSourceOfIncome.message}</p>}
                </Grid>
                {JSON.parse(watch('hasMoreSourceOfIncome') ?? request.hasMoreSourceOfIncome) ?
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                        >
                            Por fabor spesifiká esaki
                        </Typography>
                        <Controller
                            as={TextField}
                            id="moreSourceOfIncome"
                            name="moreSourceOfIncome"
                            label="Por fabor spesifiká esaki"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            control={control}
                            error={errors.moreSourceOfIncome ? true : false}
                        />
                        {errors.moreSourceOfIncome && <p style={{ color: '#bf1650' }}>{errors.moreSourceOfIncome.message}</p>}
                    </Grid> :
                    null
                }
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="hasOwnHouse"
                        //error={errors.hasOwnHouse ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    24. Bo ta biba den bo mes kas?
                                </Typography>
                                <RadioGroup aria-label="hasOwnHouse" name="hasOwnHouse" value={JSON.parse(value)} onChange={onChange} row>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasOwnHouse && <p style={{ color: '#bf1650' }}>{errors.hasOwnHouse.message}</p>}
                </Grid>
                {JSON.parse(watch('hasOwnHouse') ?? request.hasOwnHouse) !== null &&
                    <>
                        {!JSON.parse(watch('hasOwnHouse') ?? request.hasOwnHouse) &&
                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    as={
                                        <RadioGroup aria-label="notOwnHouse" name="notOwnHouse" row>
                                            <FormControlLabel value='inherit' control={<Radio />} label="Mi a heredá e kas" />
                                            <FormControlLabel value='rent' control={<Radio />} label="Mi ta biba den kas di hür" />
                                            <FormControlLabel value='fkp' control={<Radio />} label="Mi ta biba den kas di FKP" />
                                            <FormControlLabel value='liveIn' control={<Radio />} label="Mi ta biba otro kaminda" />
                                            <FormControlLabel value='other' control={<Radio />} label="Otro" />
                                        </RadioGroup>
                                    }
                                    variant="outlined"
                                    name="notOwnHouse"
                                //error={errors.notOwnHouse ? true : false}
                                />
                                {errors.notOwnHouse && <p style={{ color: '#bf1650' }}>{errors.notOwnHouse.message}</p>}
                            </Grid>
                        }
                        {
                            JSON.parse(watch('hasOwnHouse') ?? request.hasOwnHouse) ||
                                (!JSON.parse(watch('hasOwnHouse') ?? request.hasOwnHouse) && (watch('notOwnHouse') ?? request.notOwnHouse) !== '') ?
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <Typography
                                            variant="subtitle1"
                                            color="textPrimary"
                                            className={classes.inputTitle}
                                        >
                                            Adrès
                                        </Typography>
                                        <Controller
                                            as={TextField}
                                            id="houseAddress"
                                            name="houseAddress"
                                            label="Adrès"
                                            variant="outlined"
                                            fullWidth
                                            control={control}
                                            error={errors.houseAddress ? true : false}
                                        />
                                        {errors.houseAddress && <p style={{ color: '#bf1650' }}>{errors.houseAddress.message}</p>}
                                    </Grid>
                                    {(watch('notOwnHouse') === 'other' ?? request.notOwnHouse === 'other') &&
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Otro
                                            </Typography>
                                            <Controller
                                                id="otherHousing"
                                                name="otherHousing"
                                                render={({ value, onChange }) => (
                                                    <TextField
                                                        label="Otro"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={value || ''}
                                                        onChange={onChange}
                                                        error={errors.otherHousing ? true : false}
                                                    />
                                                )}
                                                control={control}
                                            />

                                            {errors.otherHousing && <p style={{ color: '#bf1650' }}>{errors.otherHousing.message}</p>}
                                        </Grid>}
                                    {
                                        JSON.parse(watch('hasOwnHouse') ?? request.hasOwnHouse) ?
                                            <>
                                                <Grid item xs={12} sm={6}>
                                                    <Controller
                                                        control={control}
                                                        name="payingMortgage"
                                                        error={errors.payingMortgage ? true : false}
                                                        render={({ onChange, value }) => (
                                                            <>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    color="textPrimary"
                                                                    className={classes.inputTitle}
                                                                >
                                                                    Bo ta paga hipotek?
                                                                </Typography>
                                                                <RadioGroup aria-label="payingMortgage" name="payingMortgage" value={JSON.parse(value)} onChange={onChange} row>
                                                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                                                </RadioGroup>
                                                            </>
                                                        )}
                                                    />
                                                    {errors.payingMortgage && <p style={{ color: '#bf1650' }}>{errors.payingMortgage.message}</p>}
                                                </Grid>
                                                {JSON.parse(watch('payingMortgage') ?? request.payingMortgage) &&
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            color="textPrimary"
                                                            className={classes.inputTitle}
                                                        >
                                                            Kuantu bo ta paga pa luna na hipotek?
                                                        </Typography>
                                                        <Controller
                                                            as={TextField}
                                                            id="houseMortgageDebt"
                                                            name="houseMortgageDebt"
                                                            variant="outlined"
                                                            fullWidth
                                                            control={control}
                                                            error={errors.houseMortgageDebt ? true : false}
                                                        />
                                                        {errors.houseMortgageDebt && <p style={{ color: '#bf1650' }}>{errors.houseMortgageDebt.message}</p>}
                                                    </Grid>
                                                }
                                                {
                                                    //(watch('payingMortgage') ?? request.payingMortgage !== null) &&
                                                    (!JSON.parse(watch('payingMortgage') ?? request.payingMortgage)) &&
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            color="textPrimary"
                                                            className={classes.inputTitle}
                                                        >
                                                            Dikon nò?
                                                        </Typography>
                                                        <Controller
                                                            as={TextField}
                                                            id="reasonNotPayingMortgage"
                                                            name="reasonNotPayingMortgage"
                                                            label="Dikon nò?"
                                                            variant="outlined"
                                                            multiline
                                                            rows={3}
                                                            fullWidth
                                                            control={control}
                                                            error={errors.reasonNotPayingMortgage ? true : false}
                                                        />
                                                        {errors.reasonNotPayingMortgage && <p style={{ color: '#bf1650' }}>{errors.reasonNotPayingMortgage.message}</p>}
                                                    </Grid>
                                                }

                                            </>
                                            : ['rent', 'fkp'].includes(watch('notOwnHouse') ?? request.notOwnHouse) ?
                                                <Grid item xs={12} sm={6}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        color="textPrimary"
                                                        className={classes.inputTitle}
                                                    >
                                                        Kuantu sèn bo ta paga na hür?
                                                    </Typography>
                                                    <Controller
                                                        as={TextField}
                                                        id="houseRentalPrice"
                                                        name="houseRentalPrice"
                                                        label="Kuantu sèn bo ta paga na hür?"
                                                        variant="outlined"
                                                        fullWidth
                                                        control={control}
                                                        error={errors.houseRentalPrice ? true : false}
                                                    />
                                                    {errors.houseRentalPrice && <p style={{ color: '#bf1650' }}>{errors.houseRentalPrice.message}</p>}
                                                </Grid> : (watch('notOwnHouse') === 'liveIn' ?? request.notOwnHouse === 'liveIn') &&
                                                <>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            color="textPrimary"
                                                            className={classes.inputTitle}
                                                        >
                                                            Por fabor spesifiká na unda bo ta kedando
                                                        </Typography>
                                                        <Controller
                                                            as={TextField}
                                                            id="liveInDescription"
                                                            name="liveInDescription"
                                                            label="Por fabor spesifiká na unda bo ta kedando"
                                                            variant="outlined"
                                                            fullWidth
                                                            control={control}
                                                            error={errors.liveInDescription ? true : false}
                                                        />
                                                        {errors.liveInDescription && <p style={{ color: '#bf1650' }}>{errors.liveInDescription.message}</p>}
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            color="textPrimary"
                                                            className={classes.inputTitle}
                                                        >
                                                            Kiko ta bo kontribushon pa luna aki?
                                                        </Typography>
                                                        <Controller
                                                            as={TextField}
                                                            id="houseContribution"
                                                            name="houseContribution"
                                                            label="Kiko ta bo kontribushon pa luna aki?"
                                                            variant="outlined"
                                                            fullWidth
                                                            control={control}
                                                            error={errors.houseContribution ? true : false}
                                                        />
                                                        {errors.houseContribution && <p style={{ color: '#bf1650' }}>{errors.houseContribution.message}</p>}
                                                    </Grid>
                                                </>

                                    }
                                    {!JSON.parse(watch('hasOwnHouse') ?? request.hasOwnHouse) && (watch('notOwnHouse') ?? request.hasOwnHouse !== 'other') &&
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="subtitle1"
                                                color="textPrimary"
                                                className={classes.inputTitle}
                                            >
                                                Ken mas ta biba den kas kubo? (skohe mas opshon si esaki ta e kaso)
                                            </Typography>
                                            {["Kasá", "Pareha", "Yu", "Ruman", "Otro famia", "Amigu/amiga"].map(name => (
                                                <FormControlLabel
                                                    control={
                                                        <Controller
                                                            name="houseResidents"
                                                            render={({ onChange, value }) => {
                                                                return (
                                                                    <Checkbox
                                                                        checked={value?.includes(name) || false}
                                                                        onChange={() => onChange(handleHouseResidentsSelect(name))}

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
                                            {errors.houseResidents && <p style={{ color: '#bf1650' }}>{errors.houseResidents.message}</p>}
                                        </Grid>}
                                    {
                                        ['rent', 'fkp'].includes(watch('notOwnHouse') ?? request.notOwnHouse) &&
                                        <>
                                            <Grid item xs={12} sm={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="textPrimary"
                                                    className={classes.inputTitle}
                                                >
                                                    ‘Upload’ kòntrakt di hur of apoderashon
                                                </Typography>
                                                <Controller
                                                    classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                                    name="proofOfRentalContract"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <DropzoneArea
                                                            {...field}
                                                            initialFiles={request.proofOfRentalContract}
                                                            dropzoneText="‘Upload’ kòntrakt di hur of apoderashon (image/* òf .pdf)"
                                                            error={errors.proofOfRentalContract ? true : false}
                                                            onDrop={(files) => onDropHandler(files, 16)}
                                                            onDelete={(file) => onDeleteHandler(file, 16)}
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
                                                {errors.proofOfRentalContract && <p style={{ color: '#bf1650' }}>{errors.proofOfRentalContract.message}</p>}
                                            </Grid>
                                            {
                                                (watch('notOwnHouse') === 'rent' ?? request.notOwnHouse === 'rent') &&
                                                <Grid item xs={12} sm={6}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        color="textPrimary"
                                                        className={classes.inputTitle}
                                                    >
                                                        ‘Upload’ prueba di pago
                                                    </Typography>
                                                    {
                                                        ((request.edited && request.proofOfRentalPayment) || !request.edited) &&
                                                        <Controller
                                                            classes={{ root: classes.dropzoneRoot, text: classes.dropzoneText, icon: classes.dropzoneIcon }}
                                                            name="proofOfRentalPayment"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <DropzoneArea
                                                                    {...field}
                                                                    initialFiles={request.proofOfRentalPayment}
                                                                    dropzoneText="‘Upload’ prueba di pago (image/* òf .pdf)"

                                                                    error={errors.proofOfRentalPayment ? true : false}
                                                                    onDrop={(files) => onDropHandler(files, 17)}
                                                                    onDelete={(file) => onDeleteHandler(file, 17)}
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
                                                    }
                                                    {errors.proofOfRentalPayment && <p style={{ color: '#bf1650' }}>{errors.proofOfRentalPayment.message}</p>}
                                                </Grid>
                                            }
                                        </>
                                    }

                                </>
                                : null
                        }
                    </>
                }


                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="hasSignupFkp"
                        error={errors.hasSignupFkp ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Bo ta inskribí na FKP pa bo risibí un kas?
                                </Typography>
                                <RadioGroup aria-label="hasSignupFkp" name="hasSignupFkp" value={JSON.parse(value)} onChange={onChange} row>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasSignupFkp && <p style={{ color: '#bf1650' }}>{errors.hasSignupFkp.message}</p>}
                </Grid>
                {
                    request.hasSignupFkp || JSON.parse(watch('hasSignupFkp')) ?
                        <>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    For di ki aña?
                                </Typography>
                                <Controller
                                    id="signupFkpYear"
                                    name="signupFkpYear"
                                    render={({ value, onChange }) => (
                                        <TextField
                                            variant="outlined"
                                            label="For di ki aña?"
                                            fullWidth
                                            type='number'
                                            value={value || ''}
                                            onChange={onChange}
                                            error={errors.signupFkpYear ? true : false}
                                        />
                                    )}
                                    control={control}
                                />
                                {errors.signupFkpYear && <p style={{ color: '#bf1650' }}>{errors.signupFkpYear.message}</p>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    Kuantu punto bo tin di spar?
                                </Typography>
                                <Controller
                                    as={TextField}
                                    id="fkpPoints"
                                    name="fkpPoints"
                                    label="Kuantu punto bo tin di spar?"
                                    variant="outlined"
                                    type='number'
                                    fullWidth
                                    control={control}
                                    error={errors.fkpPoints ? true : false}
                                />
                                {errors.fkpPoints && <p style={{ color: '#bf1650' }}>{errors.fkpPoints.message}</p>}
                            </Grid>
                        </> : null
                }
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="hasDependents"
                        error={errors.hasDependents ? true : false}
                        render={({ onChange, value }) => (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    className={classes.inputTitle}
                                >
                                    25. Tin mas persona ta depende di bo finansieramente? (skohe mas opshon si esaki ta e kaso)
                                </Typography>
                                <RadioGroup aria-label="hasDependents" name="hasDependents" value={JSON.parse(value)} onChange={onChange} row>
                                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                                    <FormControlLabel value={false} control={<Radio />} label="Nò" />
                                </RadioGroup>
                            </>
                        )}
                    />
                    {errors.hasDependents && <p style={{ color: '#bf1650' }}>{errors.hasDependents.message}</p>}
                </Grid>
                {
                    (JSON.parse(request.hasDependents || watch('hasDependents'))) ?
                        <Grid item xs={12} >
                            {["Kasá", "Pareha", "Yu", "Ruman", "Otro famia", "Amigu/amiga"].map(name => (
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="dependents"
                                            render={({ onChange, value }) => {
                                                return (
                                                    <Checkbox
                                                        checked={value?.includes(name) || false}
                                                        onChange={() => onChange(handleDependentsSelect(name))}

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
                            {errors.dependents && <p style={{ color: '#bf1650' }}>{errors.dependents.message}</p>}
                        </Grid>
                        : null
                }
                <Grid container item alignItems="center" justifyContent="center" xs={12} sm={6}>
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
                <Grid container item alignItems="center" justifyContent="center" xs={12} sm={6}>
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

export default PropertyForm
