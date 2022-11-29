import React from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRequest } from "@/context/Provider";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: 900,
  },
  inputTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
}));

const EducationForm = (props) => {
  const { className, handleNext, handleBack, ...rest } = props;
  const { request, setRequest } = useRequest();
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const schema = yup.object().shape({
    education: yup.string().required("Mester skohe nivel di edukashon"),
    hasCertificate: yup
      .bool()
      .nullable()
      .required("Mester skohe si bo tin diploma"),
    certificateYear: yup
      .number()
      .nullable()
      .when("hasCertificate", {
        is: (val) => val && val === true,
        then: yup
          .number()
          .test(
            "len",
            "Mester ta 4 number",
            (val) => val && val.toString().length === 4
          )
          .moreThan(0, "Mester yena aña ku bo a risibi bo diploma")
          .typeError("Mester yena un number"),
      }),
    hasOtherCertificate: yup
      .bool()
      .nullable()
      .required(
        "Mester skohe si bo a risibí sertifikado di algun kurso/workshòp ku b'a partisipá na dje"
      ),
    otherCertificateDescription: yup.string().when("hasOtherCertificate", {
      is: (val) => val === true,
      then: yup
        .string()
        .required("Mester indiká sertifikado di kua kurso/workshòp"),
    }),
    otherCertificateYear: yup.number().when("hasOtherCertificate", {
      is: (val) => val,
      then: yup
        .number()
        .typeError("Mester yena number")
        .test(
          "len",
          "Mester ta 4 number",
          (val) => val && val.toString().length === 4
        )
        .moreThan(0, "Mester yena aña ku bo a risibi bo diploma"),
      otherwise: yup
        .number()
        .transform((v, o) => (o === "" ? null : v))
        .nullable(),
    }),
    hasCertificateWorkExperience: yup
      .bool()
      .nullable()
      .required(
        "Mester skohe si bo a yega di traha den e sektor ku bo a studia aden"
      ),
    certificateWorkExperienceCompany: yup
      .string()
      .when("hasCertificateWorkExperience", {
        is: (val) => val === true,
        then: yup.string().required("Mester yena na kua kompania"),
      }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: request,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setRequest({ ...request, ...data });
    handleNext();
  };
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <Typography variant="h6" color="textPrimary">
            Enseñansa
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
            26. Kua ta e nivel di skol mas haltu ku bo a kaba?
          </Typography>
          <Controller
            control={control}
            name="education"
            render={({ field }) => (
              <Select
                {...field}
                variant="outlined"
                fullWidth
                error={errors.education ? true : false}
              >
                <MenuItem value="None">Niun</MenuItem>
                <MenuItem value="BASIS">Skol básiko</MenuItem>
                <MenuItem value="AGO">AGO</MenuItem>
                <MenuItem value="VSBO">VSBO</MenuItem>
                <MenuItem value="SBO">SBO</MenuItem>
                <MenuItem value="ZMLK">ZMLK</MenuItem>
                <MenuItem value="MLK">MLK</MenuItem>
                <MenuItem value="LTS">LTS</MenuItem>
                <MenuItem value="MTS">MTS</MenuItem>
                <MenuItem value="HTS">HTS</MenuItem>
                <MenuItem value="VSBO/MAVO">VSBO/MAVO</MenuItem>
                <MenuItem value="Huishoudschool">Huishoudschool</MenuItem>
                <MenuItem value="Estudio profeshonal finalisá">
                  Estudio profeshonal finalisá
                </MenuItem>
                <MenuItem value="Havo">Havo</MenuItem>
                <MenuItem value="VWO">VWO</MenuItem>
                <MenuItem value="Bachelor">Nivel Bachelor</MenuItem>
                <MenuItem value="Academic">Nivel Akadémiko</MenuItem>
                <MenuItem value="PHD">PHD</MenuItem>
              </Select>
            )}
          />
          {errors.education && (
            <p style={{ color: "#bf1650" }}>{errors.education.message}</p>
          )}
        </Grid>
        <Grid item xs={6} sm={2}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin diploma?
          </Typography>
          <Controller
            control={control}
            name="hasCertificate"
            error={errors.hasCertificate ? true : false}
            render={({ field }) => (
              <RadioGroup {...field}>
                <FormControlLabel value={true} control={<Radio />} label="Si" />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Nò"
                />
              </RadioGroup>
            )}
          />
          {errors.hasCertificate && (
            <p style={{ color: "#bf1650" }}>{errors.hasCertificate.message}</p>
          )}
        </Grid>
        {JSON.parse(watch("hasCertificate") ?? request.hasCertificate) ? (
          <Grid item xs={6} sm={4}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Na ki aña bo a risibí e diploma?
            </Typography>
            <Controller
              control={control}
              id="certificateYear"
              name="certificateYear"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Na ki aña bo a risibí e diploma?"
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                  error={errors.certificateYear ? true : false}
                />
              )}
            />
            {errors.certificateYear && (
              <p style={{ color: "#bf1650" }}>
                {errors.certificateYear.message}
              </p>
            )}
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            27. Bo a risibí sertifikado di algun kurso/workshòp ku ba partisipá
            na dje?
          </Typography>
          <Controller
            control={control}
            name="hasOtherCertificate"
            render={({ field }) => (
              <RadioGroup
                {...field}
                error={errors.hasOtherCertificate ? true : false}
                row
              >
                <FormControlLabel value={true} control={<Radio />} label="Si" />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Nò"
                />
              </RadioGroup>
            )}
          />
          {errors.hasOtherCertificate && (
            <p style={{ color: "#bf1650" }}>
              {errors.hasOtherCertificate.message}
            </p>
          )}
        </Grid>
        {JSON.parse(
          watch("hasOtherCertificate") ?? request.hasOtherCertificate
        ) ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Por fabor indiká sertifikado di kua kurso/workshòp
              </Typography>
              <Controller
                id="otherCertificateDescription"
                name="otherCertificateDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Por fabor indiká sertifikado di kua kurso/workshòp"
                    variant="outlined"
                    fullWidth
                    error={errors.otherCertificateDescription ? true : false}
                  />
                )}
              />
              {errors.otherCertificateDescription && (
                <p style={{ color: "#bf1650" }}>
                  {errors.otherCertificateDescription.message}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Na ki aña bo a risibí e sertifikado?
              </Typography>
              <Controller
                name="otherCertificateYear"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Na ki aña bo a risibí e diploma?"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={field.value || ""}
                    error={errors.otherCertificateYear ? true : false}
                  />
                )}
              />
              {errors.otherCertificateYear && (
                <p style={{ color: "#bf1650" }}>
                  {errors.otherCertificateYear.message}
                </p>
              )}
            </Grid>
          </>
        ) : null}
        <Grid
          item
          xs={12}
          sm={
            JSON.parse(
              watch("hasCertificateWorkExperience") ??
                request.hasCertificateWorkExperience
            )
              ? 6
              : false
          }
        >
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            28. Bo a yega di traha den e sektor ku bo a studia aden?
          </Typography>
          <Controller
            control={control}
            name="hasCertificateWorkExperience"
            error={errors.hasCertificateWorkExperience ? true : false}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value={true} control={<Radio />} label="Si" />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Nò"
                />
              </RadioGroup>
            )}
          />
          {errors.hasCertificateWorkExperience && (
            <p style={{ color: "#bf1650" }}>
              {errors.hasCertificateWorkExperience.message}
            </p>
          )}
        </Grid>
        {JSON.parse(
          watch("hasCertificateWorkExperience") ??
            request.hasCertificateWorkExperience
        ) ? (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Na kua kompania?
            </Typography>
            <Controller
              id="certificateWorkExperienceCompany"
              name="certificateWorkExperienceCompany"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Na kua kompania?"
                  variant="outlined"
                  fullWidth
                  error={errors.certificateWorkExperienceCompany ? true : false}
                />
              )}
            />
            {errors.certificateWorkExperienceCompany && (
              <p style={{ color: "#bf1650" }}>
                {errors.certificateWorkExperienceCompany.message}
              </p>
            )}
          </Grid>
        ) : null}
        <Grid
          container
          item
          alignItems="center"
          justify="center"
          xs={12}
          sm={6}
        >
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
        <Grid
          container
          item
          alignItems="center"
          justify="center"
          xs={12}
          sm={6}
        >
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
          {Object.values(errors).length !== 0 && (
            <Alert severity="error">
              {Object.values(errors).map((error, key) => (
                <p key={key}>{error.message}</p>
              ))}
            </Alert>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default EducationForm;
