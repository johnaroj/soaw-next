import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { GeneralForm, WorkForm, PropertyForm, EducationForm } from './components';
import HealthForm from './components/HealthForm/HealthForm';
import Success from './components/Success/Success';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  stepper: {
    padding: theme.spacing(4),
    "& .Mui-active": { color: theme.palette.primary.main },
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

const MultiStepForm = ({ id }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  function getSteps() {
    return ['Informashon General', 'Entrada aktual', 'Propiedat', 'Enseñansa', 'Salú físiko i mental', 'Manda formulario'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <GeneralForm id={id} handleNext={handleNext} />;
      case 1:
        return <WorkForm handleNext={handleNext} handleBack={handleBack} />;
      case 2:
        return <PropertyForm handleNext={handleNext} handleBack={handleBack} />;
      case 3:
        return <EducationForm handleNext={handleNext} handleBack={handleBack} />;
      case 4:
        return <HealthForm handleNext={handleNext} handleBack={handleBack} />;
      case 5:
        return <Success handleBack={handleBack} />;
      default:
        return 'Unknown step';
    }
  }
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [activeStep])
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {getStepContent(activeStep)}
      </div>
    </div>
  );
}

export default MultiStepForm;