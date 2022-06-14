import React from 'react';
import clsx from 'clsx';
import { useForm, Controller } from "react-hook-form"
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import {
    Button,
    Grid,
    Typography,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    useMediaQuery
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useMutation } from "react-query";
import { Alert } from '@mui/material/Alert';
import { useStateValue } from 'StateProvider';
import { useRouter } from 'next/router';


const useStyles = makeStyles(theme => ({
    root: {},
    inputTitle: {
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },
}));


const Success = (props) => {
    const { className, handleBack, ...rest } = props;
    const { request, setRequest } = useStateValue()
    const router = useRouter();
    const [mutateRequest, { isLoading, isSuccess, isError, error }] = useMutation(async (data) => {
        let result = null;
        if (data.edited) {
            result = await fetch(`${process.env.REACT_APP_API}/api/request/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        } else {
            result = await fetch(`${process.env.REACT_APP_API}/api/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        }

        if (result.ok) {
            return result.json()
        } else {
            throw { message: `Oops algu a bai robes: ${result.statusText}` };
        }

    }, {
        throwOnError: true
    })
    const classes = useStyles();

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    const schema = yup.object().shape({
        confirmation: yup.bool().oneOf([true], 'Mester konfirmá ku a yena mas kompleto posibel i segun bèrdat')
    });
    const { control, handleSubmit, errors, reset } = useForm({
        defaultValues: {
            confirmation: false
        },
        resolver: yupResolver(schema),
    });

    const onSubmit = () => {
        try {
            mutateRequest({ ...request, type: 1, created: request.edited ? request.created : new Date().toISOString(), createdBy: 'internet', updated: new Date().toISOString(), updatedBy: 'internet' })
        } catch (error) {
            console.error(error)
        }

    }

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Grid container spacing={isMd ? 4 : 2}>
                {isSuccess ? (
                    <>
                        <Grid item xs={12}><Typography variant="h6" color="textPrimary">Danki pa bo petishon</Typography></Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                size="large"
                                onClick={() => router.push('/request-status')}
                            >
                                Bo Estado
                            </Button>
                        </Grid></>
                ) :
                    isError ? <Grid item xs={12}><Alert severity='error'>{error.message}</Alert> </Grid> :
                        <>
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
                Mi ta pèrmití e autoridatnan di Gobiernu di Korsou pa kontrolá si mi ta bin na remarke pa mi petishon, pa bishitá kaminda mi ta biba kontrolando esey i pa verifiká mi datos nan i interkambiá mi informashon ku otro instansia relevante, por ehempel registro nan di residente ('Kranshi'), di trahador (SVB, Kamera di Komersio, MEO, posibel dunador nan di trabou, etc.), di poseshon di bien nan immobil (por ehempel kas, auto, boto), departamentu di estadistika, etc.
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
                                    color={isLoading ? 'default' : 'primary'}
                                    size="large"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {isLoading ? <CircularProgress /> : 'Manda Formulario'}
                                </Button>
                            </Grid>
                        </>
                }

            </Grid>
        </div>
    )
}

export default Success
