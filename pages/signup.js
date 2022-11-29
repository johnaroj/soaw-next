import React from 'react';
import { makeStyles } from '@mui/styles';
import  Form from '@/components/Signup/Form';
import { SectionHeader } from '@/components/molecules';
import { Section } from '@/components/organisms';
import { Minimal } from 'layouts';

const useStyles = makeStyles(theme => ({
  root: {},
  formContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
    maxWidth: 500,
    margin: `0 auto`,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const SignupPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Section className={classes.section}>
        <div className={classes.formContainer}>
          <SectionHeader
            title="Sign up"
            subtitle="Create beautiful marketing websites in hours instead of weeks."
            titleProps={{
              variant: 'h3',
            }}
          />
          <Form />
        </div>
      </Section>
    </div>
  );
};

export default SignupPage;
SignupPage.getLayout = function getLayout(SignupPage) {
  return (
    <Minimal>{SignupPage}</Minimal>
  )
}


