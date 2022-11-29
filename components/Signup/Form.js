import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Typography, Grid, Button, TextField } from '@mui/material';
import validate from 'validate.js';
import { LearnMoreLink } from '@/components/atoms';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 300,
    },
  },
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 120,
    },
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 120,
    },
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
    },
  },
  confirm:{
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
    },
    equality: "password"
  },
};

const Form = props => {
  const router = useRouter()

  const classes = useStyles();

  const [formState, setFormState] = React.useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (formState.isValid) {
      const result = await fetch(`/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...formState.values })
        })
      if (result.ok) {
        setSuccess(true);
        router.push('/login');
      } else {
        let data = await result.json();
        setSuccess(data.success);
        setMessage(data.message);
      }
    }

    setFormState(formState => ({
      ...formState,
      touched: {
        ...formState.touched,
        ...formState.errors,
      },
    }));
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <form name="password-reset-form" method="post" onSubmit={handleSubmit}>
      {(!success && message) && <Grid item xs={12}>
            <p style={{ color: '#bf1650' }}>{message}</p>
          </Grid>}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              placeholder="First name"
              label="First name *"
              variant="outlined"
              size="medium"
              name="firstName"
              fullWidth
              helperText={
                hasError('firstName') ? formState.errors.firstName[0] : null
              }
              error={hasError('firstName')}
              onChange={handleChange}
              type="firstName"
              value={formState.values.firstName || ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              placeholder="Last name"
              label="Last name *"
              variant="outlined"
              size="medium"
              name="lastName"
              fullWidth
              helperText={
                hasError('lastName') ? formState.errors.lastName[0] : null
              }
              error={hasError('lastName')}
              onChange={handleChange}
              type="lastName"
              value={formState.values.lastName || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              placeholder="E-mail"
              label="E-mail *"
              variant="outlined"
              size="medium"
              name="email"
              fullWidth
              helperText={hasError('email') ? formState.errors.email[0] : null}
              error={hasError('email')}
              onChange={handleChange}
              type="email"
              value={formState.values.email || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              placeholder="Password"
              label="Password *"
              variant="outlined"
              size="medium"
              name="password"
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              error={hasError('password')}
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              placeholder="Confirm Password"
              label="Confirm Password *"
              variant="outlined"
              size="medium"
              name="confirm"
              fullWidth
              helperText={
                hasError('confirm') ? formState.errors.confirm[0] : null
              }
              error={hasError('confirm')}
              onChange={handleChange}
              type="password"
              value={formState.values.confirm || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <i>
              <Typography variant="subtitle2">
                Fields that are marked with * sign are required.
              </Typography>
            </i>
          </Grid>
          <Grid item xs={12}>
            <Button
              size="large"
              variant="contained"
              type="submit"
              color="primary"
              fullWidth
            >
              Send
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              align="center"
            >
              Already have an account?{' '}
              <LearnMoreLink title="Sign in" href="/login" />
            </Typography>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Form;
