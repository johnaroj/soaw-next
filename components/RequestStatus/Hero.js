import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { Section } from '@/components/organisms';
import { SectionHeader } from '@/components/molecules';




const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.primary.main,
    },
    textWhite: {
        color: 'white',
    },
    title: {
        fontWeight: 'bold',
    },
}));

const Hero = props => {
    const { className, ...rest } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Section className={classes.section}>
                <SectionHeader
                    title="Petishon"
                    subtitle="Pedido pa Onderstant, Pakete di kuminda i Karchi Sosial"
                    align="left"
                    disableGutter
                    titleProps={{
                        className: clsx(classes.title, classes.textWhite),
                        variant: 'h3',
                    }}
                    subtitleProps={{
                        className: classes.textWhite,
                    }}
                />
            </Section>
        </div>
    );
};

Hero.propTypes = {
    /**
     * External classes
     */
    className: PropTypes.string,
};

export default Hero;
