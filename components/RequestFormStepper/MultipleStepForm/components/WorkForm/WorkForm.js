import React, { useState } from "react";
import clsx from "clsx";
import imageCompression from "browser-image-compression";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { DropzoneArea } from "react-mui-dropzone";
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
  dropzoneRoot: {
    minHeight: 100,
  },
  dropzoneText: {
    fontSize: 16,
    marginTop: 14,
    marginBottom: 14,
  },
  dropzoneIcon: {
    height: 40,
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210,
  },
}));
const WorkForm = (props) => {
  const { className, handleNext, handleBack, ...rest } = props;
  const { request, setRequest } = useRequest();
  const [images, setImages] = useState([]);
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const schema = yup.object().shape({
    hasIncome: yup
      .bool()
      .nullable()
      .required("Mester skohe si bo tin entrada aktualmente"),
    work: yup.string().when("hasIncome", {
      is: (val) => val && val === true,
      then: yup.string().required("Mester yena kon a yega na e entrada"),
    }),
    contractee: yup.string().when("work", {
      is: (val) => val && val === "freelance",
      then: yup.string().required("Mester skohe pa ken"),
    }),
    employerCompanyName: yup
      .string()
      .when("contractee", {
        is: (val) => val && val === "company",
        then: yup.string().required("Mester yena nòmber di kompania"),
      })
      .when("work", {
        is: (val) => val && val === "employee",
        then: yup.string().required("Mester yena nòmber di kompania"),
      }),
    employerName: yup
      .string()
      .when("contractee", {
        is: (val) => val && ["company", "person"].includes(val),
        then: yup.string().required("Mester yena nòmber di e dunadó di trabou"),
      })
      .when("work", {
        is: (val) => val && val === "employee",
        then: yup.string().required("Mester yena nòmber di e dunadó di trabou"),
      }),
    employerAddress: yup
      .string()
      .when("contractee", {
        is: (val) => val && ["company", "person"].includes(val),
        then: yup.string().required("Mester yena adrès di e trabou"),
      })
      .when("work", {
        is: (val) => val && val === "employee",
        then: yup.string().required("Mester yena adrès di e trabou"),
      }),
    employerJobType: yup
      .string()
      .when("contractee", {
        is: (val) => val && ["company", "person"].includes(val),
        then: yup.string().required("Mester yena tipo di djòp"),
      })
      .when("work", {
        is: (val) =>
          val && ["employee", "freelance", "selfEmployed"].includes(val),
        then: yup.string().required("Mester yena tipo di djòp"),
      }),
    employerSalary: yup
      .string()
      .when("contractee", {
        is: (val) => val && ["company", "person"].includes(val),
        then: yup.string().required("Mester yena e kantidat di sèn risibí"),
      })
      .when("work", {
        is: (val) =>
          val && ["employee", "freelance", "selfEmployed"].includes(val),
        then: yup.string().required("Mester yena e kantidat di sèn risibí"),
      }),
    employerPayFrequency: yup
      .string()
      .when("contractee", {
        is: (val) => val && ["company", "person"].includes(val),
        then: yup
          .string()
          .required("Mester yena ku ki frekuensia a risibí e sèn aki"),
      })
      .when("work", {
        is: (val) =>
          val && ["employee", "freelance", "selfEmployed"].includes(val),
        then: yup
          .string()
          .required("Mester yena ku ki frekuensia a risibí e sèn aki"),
      }),
    reason: yup.string().required("Mester yena motibu di petishon"),
    activelyJobSeeking: yup
      .bool()
      .nullable()
      .required("Mester skohe si bo ta buska trabou aktivamente"),
    jobSeekingMethod: yup.string().when("activelyJobSeeking", {
      is: (val) => val && val === true,
      then: yup.string().required("Mester yena metodo di buska trabou"),
    }),
    reasonNoJobSeeking: yup.string().when("activelyJobSeeking", {
      is: (val) => val !== null && val === false,
      then: yup.string().required("Mester yena e motibu dikon no"),
    }),
    reasonCannotWork: yup.string().when("reason", {
      is: (val) => val && val === "cannotWork",
      then: yup.string().required("Mester yena e motibu dikon no por traha"),
    }),
    lastWork: yup.string().when("reason", {
      is: (val) => val && val === "lostJob",
      then: yup.string().required("Mester yena e lastu trabou"),
    }),
    proofOfCannotWork: yup.array().when("reason", {
      is: (val) => val && val === "cannotWork",
      then: yup.array().required("Mester ‘upload’ prueba ku bo no por traha"),
    }),
    // reason: '',
    otherReason: yup.string().when("reason", {
      is: (val) => val !== null,
      then: yup
        .string()
        .nullable()
        .required("Mester ampliá bo motibu di petishon"),
    }),
    lastEmployerCompanyName: yup.string().when("lastWork", {
      is: (val) => val && val === "company",
      then: yup.string().required("Mester yena nòmber di kompania"),
    }),
    lastEmployerName: yup.string().when("lastWork", {
      is: (val) => val && ["company", "person"].includes(val),
      then: yup.string().required("Mester yena nòmber di e dunadó di trabou"),
    }),
    lastEmployerAddress: yup.string().when("lastWork", {
      is: (val) => val && ["company", "person"].includes(val),
      then: yup.string().required("Mester yena adrès di e trabou"),
    }),
    lastEmployerWorkType: yup.string().when("lastWork", {
      is: (val) => val && ["company", "person"].includes(val),
      then: yup.string().required("Mester yena e tipo di trabou"),
    }),
    lastEmployerTimeAgo: yup.string().when("lastWork", {
      is: (val) => val && ["company", "person"].includes(val),
      then: yup.string().required("Mester yena e kantidat di tempu"),
    }),
    // ProofOfIncomeLastEmployer: [],
    lastEmployerSalary: yup.string().when("lastWork", {
      is: (val) => val && ["company", "person"].includes(val),
      then: yup.string().required("Mester yena kuantu bo a gana"),
    }),
    lastEmployerPayFrequency: yup.string().when("lastWork", {
      is: (val) => val && ["company", "person"].includes(val),
      then: yup
        .string()
        .required("Mester yena ku ki frekuensia a risibí e sèn aki"),
    }),
    proofOfContract: yup.array().when("hasContract", {
      is: (val) => val && (val === true || val === "true"),
      then: yup.array().required("Mester ‘upload’ e kòntrakt"),
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

  const onDeleteHandler = (file, category) => {
    setImages(
      images.filter(
        (image) => image.name !== file.name && image.categoryId !== category
      )
    );
  };

  const onDropHandler = (files, category) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    files.forEach((file) => {
      let img = {};
      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (event) => {
          img.base64 = event.target.result.split(",")[1];
          img.type = event.target.result.split(",")[0];
        };
        img.name = file.name;
        img.categoryId = category;
        setImages([...images, img]);
        return reader.readAsDataURL(file);
      } else {
        imageCompression(file, options).then((compressedFile) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            img.base64 = event.target.result.split(",")[1];
            img.type = event.target.result.split(",")[0];
          };
          img.name = compressedFile.name;
          img.categoryId = category;

          setImages([...images, img]);
          return reader.readAsDataURL(compressedFile);
        });
      }
    });
  };
  const onSubmit = (data) => {
    data.images = [...request.images, ...images];
    setRequest({ ...request, ...data });
    handleNext();
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" className={classes.title}>
            Entrada aktual
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            20. Bo tin entrada aktualmente?
          </Typography>
          <Controller
            control={control}
            name="hasIncome"
            error={errors.hasIncome ? true : false}
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
          {errors.hasIncome && (
            <p style={{ color: "#bf1650" }}>{errors.hasIncome.message}</p>
          )}
        </Grid>
        {(watch("hasIncome")
          ? JSON.parse(watch("hasIncome"))
          : request.hasIncome) && (
          <>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kon bo a yega na e entrada aki ?
              </Typography>
              <Controller
                control={control}
                name="work"
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="outlined"
                    fullWidth
                    error={errors.work ? true : false}
                  >
                    <MenuItem value="freelance">Mi ta kue djòp</MenuItem>
                    <MenuItem value="employee">
                      Mi ta traha na un kompania
                    </MenuItem>
                    <MenuItem value="selfEmployed">
                      Mi ta traha riba mi mes (lora man)
                    </MenuItem>
                  </Select>
                )}
              />
              {errors.work && (
                <p style={{ color: "#bf1650" }}>{errors.work.message}</p>
              )}
            </Grid>
            {(watch("work")
              ? ["freelance", "employee"].includes(watch("work"))
              : ["freelance", "employee"].includes(request.work)) && (
              <>
                {(watch("work") ? watch("work") : request.work) ===
                "freelance" ? (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Mi ta kue djòp
                    </Typography>
                    <Controller
                      control={control}
                      name="contractee"
                      render={({ field }) => (
                        <>
                          <RadioGroup {...field} row>
                            <FormControlLabel
                              value="person"
                              control={<Radio />}
                              label="serka un persona"
                            />
                            <FormControlLabel
                              value="company"
                              control={<Radio />}
                              label="na un kompania"
                            />
                          </RadioGroup>
                        </>
                      )}
                    />
                    {errors.contractee && (
                      <p style={{ color: "#bf1650" }}>
                        {errors.contractee.message}
                      </p>
                    )}
                  </Grid>
                ) : null}
                {(["company", "person"].includes(
                  watch("contractee") ?? request.contractee
                ) ||
                  (watch("work") ?? request.work) === "employee") && (
                  <>
                    {(watch("contractee") ?? request.contractee) ===
                      "company" ||
                    (watch("work") ?? request.work) === "employee" ? (
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          Nòmber di kompania
                        </Typography>
                        <Controller
                          id="employerCompanyName"
                          name="employerCompanyName"
                          control={control}
                          error={errors.employerCompanyName ? true : false}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Nòmber di kompania"
                              variant="outlined"
                              fullWidth
                              error={
                                errors?.livingTogetherAddressNumber
                                  ? true
                                  : false
                              }
                              value={field.value || ""}
                            />
                          )}
                        />
                        {errors.employerCompanyName && (
                          <p style={{ color: "#bf1650" }}>
                            {errors.employerCompanyName.message}
                          </p>
                        )}
                      </Grid>
                    ) : null}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        Nòmber i fam di e persona dunadó di trabou
                      </Typography>
                      <Controller
                        id="employerName"
                        name="employerName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Nòmber i fam di e persona dunadó di trabou"
                            variant="outlined"
                            fullWidth
                            error={errors?.employerName ? true : false}
                            value={field.value || ""}
                          />
                        )}
                      />
                      {errors.employerName && (
                        <p style={{ color: "#bf1650" }}>
                          {errors.employerName.message}
                        </p>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        Adrès di e trabou
                      </Typography>
                      <Controller
                        id="employerAddress"
                        name="employerAddress"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Adrès di e trabou"
                            variant="outlined"
                            fullWidth
                            error={errors?.employerAddress ? true : false}
                            value={field.value || ""}
                          />
                        )}
                      />
                      {errors.employerAddress && (
                        <p style={{ color: "#bf1650" }}>
                          {errors.employerAddress.message}
                        </p>
                      )}
                    </Grid>
                  </>
                )}
              </>
            )}
            {["freelance", "employee", "selfEmployed"].includes(
              watch("work") ?? request.work
            ) && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    {`Ki tipo di ${
                      (watch("work") ?? request.work) === "freelance"
                        ? "djòp bo ta kue"
                        : "trabou bo ta hasi"
                    }?`}
                  </Typography>
                  <Controller
                    id="employerJobType"
                    name="employerJobType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={`Ki tipo di ${
                          (watch("work") ?? request.work) === "freelance"
                            ? "djòp bo ta kue"
                            : "trabou bo ta hasi"
                        }?`}
                        variant="outlined"
                        fullWidth
                        value={field.value || ""}
                        error={errors.employerJobType ? true : false}
                      />
                    )}
                  />
                  {errors.employerJobType && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.employerJobType.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Kuantu sèn bo tabata risibí pa bo trabou?
                  </Typography>
                  <Controller
                    id="employerSalary"
                    name="employerSalary"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Kuantu sèn bo tabata risibí pa bo trabou?"
                        variant="outlined"
                        fullWidth
                        error={errors.employerSalary ? true : false}
                      />
                    )}
                  />
                  {errors.employerSalary && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.employerSalary.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Ku ki frekuensia bo ta risibí e sèn aki?
                  </Typography>
                  <Controller
                    control={control}
                    name="employerPayFrequency"
                    error={errors.employerPayFrequency ? true : false}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="daily"
                          control={<Radio />}
                          label="Pa dia"
                        />
                        <FormControlLabel
                          value="weekly"
                          control={<Radio />}
                          label="Pa siman"
                        />
                        <FormControlLabel
                          value="fortnight"
                          control={<Radio />}
                          label="Pa kinsena"
                        />
                        <FormControlLabel
                          value="monthly"
                          control={<Radio />}
                          label="Pa luna"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.employerPayFrequency && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.employerPayFrequency.message}
                    </p>
                  )}
                </Grid>
                {(watch("work") ?? request.work) === "employee" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        Bo tin un kòntrakt di trabou?
                      </Typography>
                      <Controller
                        control={control}
                        name="hasContract"
                        error={errors.hasContract ? true : false}
                        render={({ field }) => (
                          <RadioGroup {...field} row>
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Si"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="Nò"
                            />
                          </RadioGroup>
                        )}
                      />
                      {errors.hasContract && (
                        <p style={{ color: "#bf1650" }}>
                          {errors.hasContract.message}
                        </p>
                      )}
                    </Grid>
                    {JSON.parse(
                      watch("hasContract") ?? request.hasContract
                    ) && (
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          ‘Upload’ e kòntrakt
                        </Typography>
                        {((request.edited && request.proofOfContract) ||
                          !request.edited) && (
                          <Controller
                            name="proofOfContract"
                            control={control}
                            render={({ field }) => (
                              <DropzoneArea
                                {...field}
                                initialFiles={request.proofOfContract || []}
                                dropzoneText="‘Upload’ e kòntrakt (image/* òf .pdf)"
                                error={errors.proofOfContract ? true : false}
                                onDrop={(files) => onDropHandler(files, 20)}
                                onDelete={(file) => onDeleteHandler(file, 20)}
                                filesLimit={1}
                                acceptedFiles={["image/*", ".pdf"]}
                                showPreviews={true}
                                showPreviewsInDropzone={false}
                                useChipsForPreview
                                classes={{
                                  root: classes.dropzoneRoot,
                                  text: classes.dropzoneText,
                                  icon: classes.dropzoneIcon,
                                }}
                                previewGridProps={{
                                  container: { spacing: 1, direction: "row" },
                                }}
                                previewChipProps={{
                                  classes: { root: classes.previewChip },
                                }}
                                previewText="Selected files"
                              />
                            )}
                          />
                        )}
                        {errors.proofOfContract && (
                          <p style={{ color: "#bf1650" }}>
                            {errors.proofOfContract.message}
                          </p>
                        )}
                      </Grid>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        <Grid item xs={12}>
          <Typography variant="h6" color="textPrimary">
            Motibu di Petishon
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            21. Motibu di petishon
          </Typography>
          <Controller
            control={control}
            render={({ field }) => (
              <Select {...field} fullWidth variant="outlined">
                <MenuItem value="lostJob">Pèrdè trabou</MenuItem>
                <MenuItem value="cannotWork">No por traha</MenuItem>
                <MenuItem value="other">Otro</MenuItem>
              </Select>
            )}
            variant="outlined"
            fullWidth
            name="reason"
            error={errors.reason ? true : false}
          />
          {errors.reason && (
            <p style={{ color: "#bf1650" }}>{errors.reason.message}</p>
          )}
        </Grid>
        {(watch("reason") ?? request.reason) === "lostJob" ? (
          <>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Último bia ku bo a traha tabata pa kua persona òf kompania?
              </Typography>
              <Controller
                control={control}
                name="lastWork"
                error={errors.lastWork ? true : false}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value="person"
                      control={<Radio />}
                      label="Persona"
                    />
                    <FormControlLabel
                      value="company"
                      control={<Radio />}
                      label="Kompania"
                    />
                  </RadioGroup>
                )}
              />
              {errors.lastWork && (
                <p style={{ color: "#bf1650" }}>{errors.lastWork.message}</p>
              )}
            </Grid>
            {["person", "company"].includes(
              watch("lastWork") ?? request.lastWork
            ) ? (
              <>
                {watch("lastWork") === "company" && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Nòmber di kompania
                    </Typography>
                    <Controller
                      id="lastEmployerCompanyName"
                      name="lastEmployerCompanyName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nòmber di kompania"
                          variant="outlined"
                          fullWidth
                          error={errors.lastEmployerCompanyName ? true : false}
                        />
                      )}
                    />
                    {errors.lastEmployerCompanyName && (
                      <p style={{ color: "#bf1650" }}>
                        {errors.lastEmployerCompanyName.message}
                      </p>
                    )}
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Nòmber i fam di èks dunadó di trabou
                  </Typography>
                  <Controller
                    id="lastEmployerName"
                    name="lastEmployerName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Nòmber i fam di èks dunadó di trabou"
                        variant="outlined"
                        fullWidth
                        error={errors.lastEmployerName ? true : false}
                      />
                    )}
                  />
                  {errors.lastEmployerName && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.lastEmployerName.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Adrès di e último lugá di trabou
                  </Typography>
                  <Controller
                    id="lastEmployerAddress"
                    name="lastEmployerAddress"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Adrès di e último lugá di trabou"
                        variant="outlined"
                        fullWidth
                        error={errors.lastEmployerAddress ? true : false}
                      />
                    )}
                  />
                  {errors.lastEmployerAddress && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.lastEmployerAddress.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Ki tipo di trabou bo a traha último biaha?
                  </Typography>
                  <Controller
                    id="lastEmployerWorkType"
                    name="lastEmployerWorkType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Ki tipo di trabou bo a traha último biaha?"
                        variant="outlined"
                        fullWidth
                        error={errors.lastEmployerWorkType ? true : false}
                      />
                    )}
                  />
                  {errors.lastEmployerWorkType && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.lastEmployerWorkType.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Kuantu tempu pasá esaki tabata?
                  </Typography>
                  <Controller
                    id="lastEmployerTimeAgo"
                    name="lastEmployerTimeAgo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Kuantu tempu pasá esaki tabata?"
                        variant="outlined"
                        fullWidth
                        error={errors.lastEmployerTimeAgo ? true : false}
                      />
                    )}
                  />
                  {errors.lastEmployerTimeAgo && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.lastEmployerTimeAgo.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Si bo tin mas ku 1 aña ku bo a pèrdè bo trabou, ‘upload’ bo
                    deklarashon di entrada.
                  </Typography>
                  <Controller
                    name="proofOfIncomeLastEmployer"
                    control={control}
                    render={({ field }) => (
                      <DropzoneArea
                        {...field}
                        initialFiles={request.proofOfIncomeLastEmployer}
                        dropzoneText="‘Upload’ bo deklarashon di entrada (image/* òf .pdf)"
                        error={errors.proofOfIncomeLastEmployer ? true : false}
                        onDrop={(files) => onDropHandler(files, 15)}
                        onDelete={(file) => onDeleteHandler(file, 15)}
                        filesLimit={1}
                        acceptedFiles={["image/*", ".pdf"]}
                        showPreviews={true}
                        showPreviewsInDropzone={false}
                        classes={{
                          root: classes.dropzoneRoot,
                          text: classes.dropzoneText,
                          icon: classes.dropzoneIcon,
                        }}
                        useChipsForPreview
                        previewGridProps={{
                          container: { spacing: 1, direction: "row" },
                        }}
                        previewChipProps={{
                          classes: { root: classes.previewChip },
                        }}
                        previewText="Selected files"
                      />
                    )}
                  />
                  {errors.proofOfIncomeLastEmployer && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.proofOfIncomeLastEmployer.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Kuantu sèn bo tabata gana na bo último trabou?
                  </Typography>
                  <Controller
                    id="lastEmployerSalary"
                    name="lastEmployerSalary"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Kuantu sèn bo tabata gana na bo último trabou?"
                        variant="outlined"
                        fullWidth
                        error={errors.lastEmployerSalary ? true : false}
                      />
                    )}
                  />
                  {errors.lastEmployerSalary && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.lastEmployerSalary.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Ku ki frekuensia bo ta risibí e sèn aki?
                  </Typography>
                  <Controller
                    control={control}
                    name="lastEmployerPayFrequency"
                    error={errors.lastEmployerPayFrequency ? true : false}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="daily"
                          control={<Radio />}
                          label="Pa dia"
                        />
                        <FormControlLabel
                          value="weekly"
                          control={<Radio />}
                          label="Pa siman"
                        />
                        <FormControlLabel
                          value="fortnight"
                          control={<Radio />}
                          label="Pa kinsena"
                        />
                        <FormControlLabel
                          value="monthly"
                          control={<Radio />}
                          label="Pa luna"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.lastEmployerPayFrequency && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.lastEmployerPayFrequency.message}
                    </p>
                  )}
                </Grid>
              </>
            ) : null}
          </>
        ) : (
          (watch("reason") ?? request.reason) === "cannotWork" && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  Kiko ta e motibu ku bo no por traha?
                </Typography>
                <Controller
                  id="reasonCannotWork"
                  name="reasonCannotWork"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Kiko ta e motibu ku bo no por traha?"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      error={errors.reasonCannotWork ? true : false}
                    />
                  )}
                />
                {errors.reasonCannotWork && (
                  <p style={{ color: "#bf1650" }}>
                    {errors.reasonCannotWork.message}
                  </p>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  ‘Upload’ prueba ku bo no por traha
                </Typography>
                <Controller
                  name="proofOfCannotWork"
                  control={control}
                  render={({ field }) => (
                    <DropzoneArea
                      {...field}
                      initialFiles={request.proofOfCannotWork}
                      dropzoneText="‘Upload’ prueba ku bo no por traha (image/* òf .pdf)"
                      error={errors.proofOfCannotWork ? true : false}
                      onDrop={(files) => onDropHandler(files, 9)}
                      onDelete={(file) => onDeleteHandler(file, 9)}
                      filesLimit={1}
                      acceptedFiles={["image/*", ".pdf"]}
                      showPreviews={true}
                      showPreviewsInDropzone={false}
                      useChipsForPreview
                      classes={{
                        root: classes.dropzoneRoot,
                        text: classes.dropzoneText,
                        icon: classes.dropzoneIcon,
                      }}
                      previewGridProps={{
                        container: { spacing: 1, direction: "row" },
                      }}
                      previewChipProps={{
                        classes: { root: classes.previewChip },
                      }}
                      previewText="Selected files"
                    />
                  )}
                />
                {errors.proofOfCannotWork && (
                  <p style={{ color: "#bf1650" }}>
                    {errors.proofOfCannotWork.message}
                  </p>
                )}
              </Grid>
            </>
          )
        )}
        {["cannotWork", "other", "lostJob"].includes(
          watch("reason") ?? request.reason
        ) && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor amplia bo motibu di petishon
            </Typography>
            <Controller
              id="otherReason"
              name="otherReason"
              error={errors.otherReason ? true : false}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Por fabor amplia bo motibu di petishon"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={field.value || ""}
                />
              )}
            />
            {errors.otherReason && (
              <p style={{ color: "#bf1650" }}>{errors.otherReason.message}</p>
            )}
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            22. Bo ta buska trabou aktivamente?
          </Typography>
          <Controller
            control={control}
            name="activelyJobSeeking"
            error={errors.activelyJobSeeking ? true : false}
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
          {errors.activelyJobSeeking && (
            <p style={{ color: "#bf1650" }}>
              {errors.activelyJobSeeking.message}
            </p>
          )}
        </Grid>
        {JSON.parse(
          watch("activelyJobSeeking") ?? request.activelyJobSeeking
        ) ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kon bo ta solisitá?
              </Typography>
              <Controller
                id="jobSeekingMethod"
                name="jobSeekingMethod"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Kon bo ta solisitá?"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    error={errors.jobSeekingMethod ? true : false}
                  />
                )}
              />
              {errors.jobSeekingMethod && (
                <p style={{ color: "#bf1650" }}>
                  {errors.jobSeekingMethod.message}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                ‘Upload’ bo karta(nan) di solisitut
              </Typography>
              {((request.edited && request.proofOfJobSeeking) ||
                !request.edited) && (
                <Controller
                  name="proofOfJobSeeking"
                  control={control}
                  render={({ field }) => (
                    <DropzoneArea
                      {...field}
                      initialFiles={request.proofOfJobSeeking || []}
                      dropzoneText="‘Upload’ bo karta(nan) di solisitut (image/* òf .pdf)"
                      error={errors.proofOfJobSeeking ? true : false}
                      onDrop={(files) => onDropHandler(files, 8)}
                      onDelete={(file) => onDeleteHandler(file, 8)}
                      acceptedFiles={["image/*", ".pdf"]}
                      showPreviews={true}
                      showPreviewsInDropzone={false}
                      useChipsForPreview
                      classes={{
                        root: classes.dropzoneRoot,
                        text: classes.dropzoneText,
                        icon: classes.dropzoneIcon,
                      }}
                      previewGridProps={{
                        container: { spacing: 1, direction: "row" },
                      }}
                      previewChipProps={{
                        classes: { root: classes.previewChip },
                      }}
                      previewText="Selected files"
                    />
                  )}
                />
              )}
              {errors.proofOfJobSeeking && (
                <p style={{ color: "#bf1650" }}>
                  {errors.proofOfJobSeeking.message}
                </p>
              )}
            </Grid>
          </>
        ) : (watch("activelyJobSeeking") ?? request.activelyJobSeeking) !==
          null ? (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Dikon nò?
            </Typography>
            <Controller
              name="reasonNoJobSeeking"
              control={control}
              id="reasonNoJobSeeking"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Dikon nò?"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  error={errors.reasonNoJobSeeking ? true : false}
                />
              )}
            />
            {errors.reasonNoJobSeeking && (
              <p style={{ color: "#bf1650" }}>
                {errors.reasonNoJobSeeking.message}
              </p>
            )}
          </Grid>
        ) : null}
        <Grid
          container
          item
          alignItems="center"
          justifyContent="center"
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
          justifyContent="center"
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

export default WorkForm;
