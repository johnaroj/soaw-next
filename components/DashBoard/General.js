import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles'
import {
    useMediaQuery,
    Grid,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { NEXT_URL } from '@/config/index.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const useStyles = makeStyles(theme => ({
    root: {
    },
    inputTitle: {
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
}));

const General = props => {
    const { className, ...rest } = props;
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState(null);
    const [error, setError] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear())

    const fetchRequest = async () => {
        setLoading(true);
        const result = await fetch(`${NEXT_URL}/api/request/year/${year}`)
        let data;
        if (result.ok) {
            data = await result.json()
        } else {
            setError({ message: `Oops algu a bai robes: ${result.statusText}` });
        }
        setLoading(false);
        let month;
        setRequest({
            labels: data?.map(label => label.monthName),
            datasets: [
                {
                    label: 'Onderstand',
                    data: data.map(r => {
                        if (month !== r.month) {
                            return r.type === 1 ? r.total : 0;
                        }
                        month = r.month;
                    }),
                    backgroundColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'Pakete di kuminda',
                    data: data.map(r => {
                        if (month !== r.month) {
                            return r.type === 2 ? r.total : 0;
                        }
                        month = r.month;
                    }),
                    backgroundColor: 'rgb(54, 162, 235)',
                },
                {
                    label: 'Karchi Sosial',
                    data: data.map(r => {
                        if (month !== r.month) {
                            return r.type === 3 ? r.total : 0;
                        }
                        month = r.month;
                    }),
                    backgroundColor: 'rgb(75, 192, 192)',
                },
            ],
        });
    }

    useEffect(() => {
        fetchRequest();
    }, [year, fetchRequest])

    const classes = useStyles

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });




    if (error) return (<Grid container spacing={isMd ? 4 : 2}><Grid item xs={12}><Alert severity='error'>{error.message}</Alert></Grid></Grid>)

    return (
        <div className={clsx(classes.root, className)} {...rest} style={{ width: '100%' }}>
            <Grid container spacing={isMd ? 4 : 2}>
                {!loading && request ? (
                    <>
                        <Grid item xs={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="year-label">Year</InputLabel>
                                <Select
                                    labelId="year-label"
                                    id="year-select"
                                    value={year}
                                    onChange={e => setYear(e.target.value)}
                                >

                                    <MenuItem value={2020}>2020</MenuItem>
                                    <MenuItem value={2021}>2021</MenuItem>
                                    <MenuItem value={2022}>2022</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Bar data={request} />
                        </Grid>
                    </>) : <CircularProgress color="primary" />}

            </Grid>

        </div>
    );
};

General.propTypes = {
    /**
     * External classes
     */
    className: PropTypes.string,
};

export default General;
