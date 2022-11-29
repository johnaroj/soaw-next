import React from 'react';
import { makeStyles } from '@mui/styles';
import Form from '@/components/Login/Form';
import { LearnMoreLink } from '@/components/atoms';
import { SectionHeader } from '@/components/molecules';
import { Section } from '@/components/organisms';
import { getSession } from 'next-auth/react';
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

const LoginPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Section className={classes.section}>
        <div className={classes.formContainer}>
          <SectionHeader
            title="Sign in"
            subtitle={
              <span>
                Don’t have an account?{' '}
                <LearnMoreLink
                  title="Sign up."
                  href="/signup"
                  typographyProps={{ variant: 'h6' }}
                />
              </span>
            }
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

export default LoginPage;
LoginPage.getLayout = function getLayout(LoginPage) {
  return (
    <Minimal>{LoginPage}</Minimal>
  )
}
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const redirect = context.query.redirect ? context.query.redirect : '/';

  if (session) {
    return {
      redirect: {
        destination: redirect,
        permanent: false
      }
    }
  }

  return {
    props: {
      redirect
    }
  }
}
