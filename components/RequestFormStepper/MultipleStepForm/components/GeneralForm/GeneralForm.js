import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import imageCompression from "browser-image-compression";
import {
  useMediaQuery,
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
  Alert,
  CircularProgress,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import nlLocale from "date-fns/locale/nl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddressSelect from "../AddressSelect";
import CountrySelect from "../CountrySelect";
import StatusSelect from "../StatusSelect";
import { useSession } from "next-auth/react";
import { DropzoneArea } from "react-mui-dropzone";
import { useRequest } from "@/context/Provider";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    marginTop: 20,
    textAlign: "center",
  },
  inputTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  select: {
    width: "100%",
    padding: "14px 12px",
  },
  errorSelect: {
    width: "100%",
    padding: "14px 12px",
    border: "1px solid red",
    color: "red",
  },
  dropzoneRoot: {
    minHeight: "100px !important",
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

const General = (props) => {
  const { className, handleNext, ...rest } = props;
  const { request, setRequest } = useRequest();
  const [images, setImages] = useState([]);
  const classes = useStyles();

  const { data: session, status } = useSession();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const schema = yup.object().shape({
    firstName: yup.string().required("Mester yena nòmber"),
    lastName: yup.string().required("Mester yena fam"),
    registeredAddress: yup
      .string()
      .nullable()
      .required("Mester yena adrès na kranshi"),
    registeredAddressNumber: yup
      .string()
      .required("Mester yena number di adrès na kranshi"),
    currentAddress: yup
      .string()
      .nullable()
      .required("Mester yena adrès aktual"),
    currentAddressNumber: yup
      .string()
      .required("Mester yena number di adrès aktual"),
    hasDutchNationality: yup
      .bool()
      .nullable()
      .required("Mester yena nashonalidat"),
    proofOfResident: yup.array().when("hasDutchNationality", {
      is: (val) => val && val === false,
      then: yup.array().required("Mester ‘upload’ bo pèrmit di estadia"),
    }),
    dateOfBirth: yup
      .string()
      .required("Mester yena fecha di nasementu")
      .test("age", "Bo mester ta mas ku 18 aña", (val) => {
        return (
          new Date(
            new Date(val).getFullYear() + 18,
            new Date(val).getMonth(),
            new Date(val).getDate()
          ) <
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          )
        );
      }),
    placeOfBirth: yup.string().required("Mester yena pais di nasementu"),
    gender: yup.string().required("Mester yena sekso"),
    mobile: yup
      .number()
      .test(
        "len",
        "Mester ta minimó 7 number",
        (val) => !val || (val && val.toString().length >= 7)
      )
      .moreThan(0, "Mester yena number di selular")
      .typeError("Mester yena number"),
    // phone: yup.number().nullable().min(7, 'Mester yena minimó 7 number'),
    // whatsapp: yup.number().nullable().min(7, 'Mester yena minimó 7 number'),
    email: yup
      .string()
      .email("Mester ta un “e-mail”")
      .required("Mester yena “e-mail”"),
    confirmEmail: yup
      .string()
      .oneOf([yup.ref("email"), null], "“E-mail” no ta meskos"),
    identificationNumber: yup
      .number()
      .test(
        "len",
        "Mester ta 10 number",
        (val) => !val || (val && val.toString().length === 10)
      )
      .moreThan(0, "Mester yena number di identifikashon")
      .test(
        "already exists",
        "Bo a registra kaba ku bo number di identification",
        async (val) => {
          const result = await fetch(
            `${
              process.env.NEXT_PUBLIC_FRONTEND_URL
            }/api/request/idcheck?identificationNumber=${val}&type=1&updated=${
              !!request.id || !!request.reapply
            }`
          ).then((res) => res.json());
          return !result;
        }
      ),
    identificationType: yup
      .string()
      .nullable()
      .required("Mester skohe e tipo di identifikashon"),
    expiryDate: yup.string().required("Mester yena fecha di vensementu"),
    proofOfID: yup
      .array()
      .required("Mester ‘upload’ prueba di bo identifikashon"),
    maritalStatus: yup.string().nullable().required("Mester yena estado sivil"),
    lastNamePartner: yup.string().when("maritalStatus", {
      is: (val) =>
        val &&
        ([
          "gehuwd",
          "geregistreerd partnerschap",
          "weduwe",
          "gescheiden partnerschap",
        ].includes(val.value) ||
          val.value === "hasRelationship"),
      then: yup.string().required("Mester yena fam di kasá"),
    }),
    firstNamePartner: yup.string().when("maritalStatus", {
      is: (val) =>
        val &&
        ([
          "gehuwd",
          "geregistreerd partnerschap",
          "widow",
          "gescheiden partnerschap",
        ].includes(val.value) ||
          val.value === "hasRelationship"),
      then: yup.string().required("Mester yena nòmber di kasá"),
    }),
    identificationNumberPartner: yup.number().when("maritalStatus", {
      is: (val) =>
        val &&
        ([
          "gehuwd",
          "geregistreerd partnerschap",
          "weduwe",
          "gescheiden partnerschap",
        ].includes(val.value) ||
          val.value === "hasRelationship"),
      then: yup
        .number()
        .moreThan(0, "Mester yena number di identifikashon di kasá")
        .test(
          "len",
          "Mester ta 10 number",
          (val) => !val || (val && val.toString().length === 10)
        ),
    }),
    proofOfPartnerIncome: yup.array().when("maritalStatus", {
      is: (val) => val && val.value === "gehuwd",
      then: yup
        .array()
        .required('Mester ‘upload’ prueba di entrada di bo kasá"'),
    }),
    proofOfMarriage: yup.array().when("maritalStatus", {
      is: (val) => val && val.value === "gehuwd",
      then: yup
        .array()
        .required("Mester ‘upload’ prueba di matrimonio, familieboek"),
    }),
    proofOfDivorce: yup.array().when("maritalStatus", {
      is: (val) => val && val.value === "gescheiden",
      then: yup.array().required("Mester ‘upload’ prueba di divorsio"),
    }),
    proofOfVerdict: yup.array().when("maritalStatus", {
      is: (val) => val && val.value === "gescheiden",
      then: yup.array().required("Mester ‘upload’ prueba di veredikto"),
    }),
    hasChildren: yup.bool().nullable().required("Mester skohe si bo tin yu"),
    // ownChildren: yup.array().when('hasChildren', {
    //     is: (val) => val && val === true,
    //     then: yup.array().required('Mester ‘upload’ akto di nasementu di bo yu(nan)/buki di famia'),
    // })yup.number().min(1, 'Mester skohe kuantu ju'),
    proofOfChildren: yup.array().when("ownChildren", {
      is: (val) => val && val > 0,
      then: yup
        .array()
        .required(
          "Mester ‘upload’ akto di nasementu di bo yu(nan)/buki di famia"
        ),
    }),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    reset,
  } = useForm({
    defaultValues: request,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    data.images = [...request.images, ...images];
    setRequest({
      ...request,
      ...data,
      userId: session.user.id,
    });

    handleNext();
  };

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

  const handleBirthdayChange = (date) => {
    getValues("identificationNumber") &&
      !request.edited &&
      String(getValues("identificationNumber"))?.substr(0, 7) !==
        date.split("-").join("") &&
      setValue("identificationNumber", date.split("-").join(""));
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const day = date.split("-")[2];
    setValue(
      "dateOfBirth",
      new Date(+year, +month - 1, +day)?.toISOString().substr(0, 10)
    );
    !getValues("identificationNumber") &&
      setValue("identificationNumber", date.split("-").join(""));
    if (
      new Date(+year + 18, +month - 1, +day) >
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      )
    ) {
      setError("dateOfBirth", {
        type: "date",
        message: "Bo mester ta mas ku 18 aña",
      });
    } else {
      clearErrors("dateOfBirth");
    }
  };
  const handleExpiryDate = (date) => {
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const day = date.split("-")[2];
    setValue(
      "expiryDate",
      new Date(+year, +month - 1, +day)?.toISOString()?.substr(0, 10)
    );
    clearErrors("expiryDate");
  };

  const handleWhatsappNumber = (e) => {
    const whatsappNum = "5999" + e.target.value?.substr("5999".length);
    setValue("whatsapp", +whatsappNum);
    return +whatsappNum;
  };

  const handleAutoFillDate = (e) => {
    const id = fixFormatDate() + e.target.value?.substr(fixFormatDate().length);
    setValue("identificationNumber", id);
    return id;
  };

  const fixFormatDate = () => {
    const tempMonth = (Number(getValues("monthOfBirth")) + 1).toString();
    const year = getValues("yearOfBirth") || "";
    const month = getValues("monthOfBirth")
      ? tempMonth.length < 2
        ? "0" + tempMonth
        : tempMonth
      : "";
    const day = getValues("dayOfBirth")
      ? getValues("dayOfBirth").length < 2
        ? "0" + getValues("dayOfBirth")
        : getValues("dayOfBirth")
      : "";

    return year + month + day;
  };

  return request.id && !request.reapply && !request.edited ? (
    <Alert severity="warning" style={{ width: "100%" }}>
      Bo tin un petishon kaba
    </Alert>
  ) : (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" className={classes.title}>
            Informashon General
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
            1. Fam
          </Typography>
          <Controller
            id="lastName"
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fam"
                placeholder="Fam"
                size="medium"
                required
                variant="outlined"
                fullWidth
                value={field.value || ""}
                error={errors?.lastName ? true : false}
              />
            )}
          />
          {errors?.lastName && (
            <p style={{ color: "#bf1650" }}>{errors?.lastName.message}</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            2. Nòmber
          </Typography>
          <Controller
            control={control}
            id="firstName"
            name="firstName"
            render={({ field }) => (
              <TextField
                {...field}
                label="Nòmber"
                size="medium"
                required
                variant="outlined"
                fullWidth
                value={field.value || ""}
                error={errors?.firstName ? true : false}
              />
            )}
          />
          {errors?.firstName && (
            <p style={{ color: "#bf1650" }}>{errors?.firstName.message}</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            3. Adrès kaminda ta registrá ofisialmente na Kranshi
          </Typography>
          <AddressSelect
            name="registeredAddress"
            label="Adrès kaminda ta registrá ofisialmente na Kranshi"
            control={control}
            required={true}
            placeholder="Si bo no por haña bo adrès, por fabor skibi'é."
            error={errors?.registeredAddress ? true : false}
          />
          {errors?.registeredAddress && (
            <p style={{ color: "#bf1650" }}>
              {errors?.registeredAddress.message}
            </p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            4. Number di adrès na Kranshi
          </Typography>
          <Controller
            id="registeredAddressNumber"
            name="registeredAddressNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Number di adrès na Kranshi"
                variant="outlined"
                required
                fullWidth
                value={field.value || ""}
                error={errors?.registeredAddressNumber ? true : false}
              />
            )}
          />
          {errors?.registeredAddressNumber && (
            <p style={{ color: "#bf1650" }}>
              {errors?.registeredAddressNumber.message}
            </p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            5. Adrès kaminda bo ta biba aktualmente
          </Typography>
          <AddressSelect
            name="currentAddress"
            label="Adrès kaminda bo ta biba aktualmente"
            control={control}
            required={true}
            placeholder="Si bo no por haña bo adrès, por fabor skibi'é"
            error={errors?.currentAddress ? true : false}
          />
          {errors?.currentAddress && (
            <p style={{ color: "#bf1650" }}>{errors?.currentAddress.message}</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            6. Number di adrès aktual
          </Typography>
          <Controller
            id="currentAddressNumber"
            name="currentAddressNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Number di adrès aktual"
                variant="outlined"
                required
                fullWidth
                value={field.value || ""}
                error={errors?.currentAddressNumber ? true : false}
              />
            )}
          />
          {errors?.currentAddressNumber && (
            <p style={{ color: "#bf1650" }}>
              {errors?.currentAddressNumber.message}
            </p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            7. Pais di nasementu
          </Typography>
          <CountrySelect
            control={control}
            name="placeOfBirth"
            label="Pais di nasementu"
            required={true}
            error={errors?.placeOfBirth ? true : false}
          />
          {errors?.placeOfBirth && (
            <p style={{ color: "#bf1650" }}>{errors?.placeOfBirth.message}</p>
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            8. Nashonalidat Hulandes
          </Typography>
          <Controller
            control={control}
            name="hasDutchNationality"
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
          {errors?.hasDutchNationality && (
            <p style={{ color: "#bf1650" }}>
              {errors?.hasDutchNationality?.message}
            </p>
          )}
        </Grid>
        {(watch("hasDutchNationality") !== null ??
          request.hasDutchNationality !== null) &&
          !JSON.parse(
            watch("hasDutchNationality") ?? !!request.hasDutchNationality
          ) && (
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                ‘Upload’ bo pèrmit di estadia
              </Typography>
              <Controller
                name="proofOfResident"
                control={control}
                render={({ field }) => (
                  <DropzoneArea
                    {...field}
                    initialFiles={request.proofOfResident || []}
                    dropzoneText="‘Upload’ bo pèrmit di estadia (image/* òf .pdf)"
                    error={errors?.proofOfResident ? true : false}
                    onDrop={(files) => onDropHandler(files, 1)}
                    onDelete={(file) => onDeleteHandler(file, 1)}
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

              {errors?.proofOfResident && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.proofOfResident.message}
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
            9. Fecha di nasementu
          </Typography>
          <Controller
            id="dateOfBirth"
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={nlLocale}
              >
                <DatePicker
                  {...field}
                  label="Fecha di nasementu"
                  disableFuture
                  mask="__-__-____"
                  inputFormat="dd-MM-yyyy"
                  value={field.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={errors?.dateOfBirth ? true : false}
                    />
                  )}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
              </LocalizationProvider>
            )}
          />
          {errors?.dateOfBirth && (
            <p style={{ color: "#bf1650" }}>{errors?.dateOfBirth.message}</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            10. Number di identifikashon
          </Typography>
          <Controller
            id="identificationNumber"
            name="identificationNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Number di sédula"
                label="Si bo sédula no ta bálido, nota e number tòg."
                variant="outlined"
                fullWidth
                required
                type="text"
                error={errors?.identificationNumber ? true : false}
                value={field.value || ""}
              />
            )}
          />
          {errors?.identificationNumber && (
            <p style={{ color: "#bf1650" }}>
              {errors?.identificationNumber.message}
            </p>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            11. Sekso
          </Typography>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Femenino"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Maskulino"
                />
              </RadioGroup>
            )}
          />
          {errors?.gender && (
            <p style={{ color: "#bf1650" }}>{errors?.gender.message}</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            12. Ki tipo di identifikashon lo bo bai usa, pa identifiká bo mes na
            kas di bario?
          </Typography>
          <Controller
            control={control}
            name="identificationType"
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="driversLicense"
                  control={<Radio />}
                  label="Reibeweis"
                />
                <FormControlLabel
                  value="ID"
                  control={<Radio />}
                  label="Sédula"
                />
              </RadioGroup>
            )}
          />

          {errors?.identificationType && (
            <p style={{ color: "#bf1650" }}>
              {errors?.identificationType.message}
            </p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            13. Fecha di vensementu di e{" "}
            {(watch("identificationType") ?? request.identificationType) ===
            "driversLicense"
              ? "reibeweis"
              : "sédula"}
          </Typography>
          <Controller
            id="expiryDate"
            name="expiryDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={nlLocale}
              >
                <DatePicker
                  {...field}
                  label={`Fecha di vensementu di e ${
                    (watch("identificationType") ??
                      request.identificationType) === "driversLicense"
                      ? "reibeweis"
                      : "sédula"
                  }`}
                  inputFormat="dd-MM-yyyy"
                  mask="__-__-____"
                  value={field.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={errors?.expiryDate ? true : false}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
          {errors?.expiryDate && (
            <p style={{ color: "#bf1650" }}>{errors?.expiryDate.message}</p>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            ‘Upload’ prueba di bo identifikashon
          </Typography>
          <Controller
            name="proofOfID"
            control={control}
            render={({ field }) => (
              <DropzoneArea
                {...field}
                initialFiles={request.proofOfID || []}
                dropzoneText="‘Upload’ prueba di bo identifikashon"
                error={errors?.proofOfID ? true : false}
                onDrop={(files) => onDropHandler(files, 22)}
                onDelete={(file) => onDeleteHandler(file, 22)}
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
                previewChipProps={{ classes: { root: classes.previewChip } }}
                previewText="Selected files"
              />
            )}
          />
          {errors?.proofOfID && (
            <p style={{ color: "#bf1650" }}>{errors?.proofOfID.message}</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            14. Number di telefòn di selular
          </Typography>
          <Controller
            id="mobile"
            name="mobile"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Number di telefòn di selular"
                variant="outlined"
                type="number"
                required
                fullWidth
                value={field.value || ""}
                error={errors?.mobile ? true : false}
              />
            )}
          />
          {errors?.mobile && (
            <p style={{ color: "#bf1650" }}>{errors?.mobile.message}</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Number di telefòn di whatsapp
          </Typography>
          <Controller
            control={control}
            id="whatsapp"
            name="whatsapp"
            render={({ field }) => (
              <TextField
                {...field}
                label="Number di telefòn di whatsapp"
                fullWidth
                type="number"
                variant="outlined"
                value={field.value || ""}
                error={errors?.whatsapp ? true : false}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            15. Number di telefòn kas
          </Typography>
          <Controller
            id="phone"
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Number di telefòn kas"
                variant="outlined"
                type="number"
                fullWidth
                value={field.value || ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}></Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            16. E-mail
          </Typography>
          <Controller
            id="email"
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={field.value || ""}
                error={errors?.confirmEmail ? true : false}
              />
            )}
          />
          {errors?.email && (
            <p style={{ color: "#bf1650" }}>{errors?.email.message}</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            17. Konfirmá e-mail
          </Typography>
          <Controller
            control={control}
            id="confirmEmail"
            name="confirmEmail"
            render={({ field }) => (
              <TextField
                {...field}
                label="Konfirmá Email"
                fullWidth
                type="email"
                variant="outlined"
                value={field.value || ""}
                error={errors?.confirmEmail ? true : false}
              />
            )}
          />
          {errors?.confirmEmail && (
            <p style={{ color: "#bf1650" }}>{errors?.confirmEmail.message}</p>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            18. Estado sivil
          </Typography>
          <StatusSelect
            name="maritalStatus"
            label="Estado sivil"
            control={control}
            required={true}
            error={errors?.maritalStatus ? true : false}
          />
          {errors?.maritalStatus && (
            <p style={{ color: "#bf1650" }}>{errors?.maritalStatus.message}</p>
          )}
        </Grid>

        {["gescheiden", "gescheiden partnerschap"].includes(
          watch("maritalStatus") ?? request.maritalStatus
        ) && (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                ‘Upload’ prueba di divorsio{" "}
                {(watch("maritalStatus") ?? request.maritalStatus) ===
                  "gescheiden partnerschap" &&
                  `di konbibensia legalisá di pareha`}
              </Typography>
              <Controller
                name="proofOfDivorce"
                control={control}
                render={({ field }) => (
                  <DropzoneArea
                    {...field}
                    initialFiles={request.proofOfDivorce || []}
                    dropzoneText={`‘Upload’ prueba di divorsio ${
                      (watch("maritalStatus") ?? request.maritalStatus) ===
                        "gescheiden partnerschap" &&
                      `di konbibensia legalisá di pareha`
                    }(image/* òf .pdf)`}
                    error={errors?.proofOfDivorce ? true : false}
                    onDrop={(files) => onDropHandler(files, 5)}
                    onDelete={(file) => onDeleteHandler(file, 5)}
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

              {errors?.proofOfDivorce && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.proofOfDivorce.message}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                ‘Upload’ prueba di veredikto
              </Typography>
              <Controller
                name="proofOfVerdict"
                control={control}
                render={({ field }) => (
                  <DropzoneArea
                    {...field}
                    initialFiles={request.proofOfVerdict || []}
                    dropzoneText={`‘Upload’ prueba di veredikto (image/* òf .pdf)`}
                    error={errors?.proofOfVerdict ? true : false}
                    onDrop={(files) => onDropHandler(files, 21)}
                    onDelete={(file) => onDeleteHandler(file, 21)}
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
              {errors?.proofOfVerdict && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.proofOfVerdict.message}
                </p>
              )}
            </Grid>
          </>
        )}
        {(watch("maritalStatus") ?? request.maritalStatus) === "gescheiden" ||
        (watch("maritalStatus") ?? request.maritalStatus) === "ongehuwd" ? (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Bo ta den un relashon aktualmente?
            </Typography>
            <Controller
              control={control}
              name="hasRelationship"
              render={({ field }) => (
                <RadioGroup {...field} value={JSON.parse(field.value)} row>
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
            {errors?.hasRelationship ? (
              <p style={{ color: "#bf1650" }}>
                {errors?.hasRelationship.message}
              </p>
            ) : null}
          </Grid>
        ) : null}
        {[
          "gehuwd",
          "geregistreerd partnerschap",
          "weduwe",
          "gescheiden partnerschap",
        ].includes(watch("maritalStatus") ?? request.maritalStatus) ||
        JSON.parse(watch("hasRelationship") ?? !!request.hasRelationship) ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Fam di{" "}
                {watch("maritalStatus") === "gehuwd"
                  ? "kasá"
                  : watch("maritalStatus") === "weduwe"
                  ? "kasá ku a fayesé"
                  : "pareha"}
              </Typography>
              <Controller
                id="lastNamePartner"
                name="lastNamePartner"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Fam"
                    label="Fam"
                    variant="outlined"
                    size="medium"
                    fullWidth
                    required
                    type="text"
                    error={errors?.lastNamePartner ? true : false}
                    value={field.value || ""}
                  />
                )}
              />
              {errors?.lastNamePartner && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.lastNamePartner.message}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Nòmber di{" "}
                {(watch("maritalStatus") ?? request.maritalStatus) === "gehuwd"
                  ? "kasá"
                  : (watch("maritalStatus") ?? request.maritalStatus) ===
                    "weduwe"
                  ? "kasá ku a fayesé"
                  : "pareha"}
              </Typography>
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nòmber"
                    variant="outlined"
                    size="medium"
                    required
                    fullWidth
                    error={errors?.firstNamePartner ? true : false}
                  />
                )}
                id="firstNamePartner"
                name="firstNamePartner"
                control={control}
              />
              {errors?.firstNamePartner && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.firstNamePartner.message}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Number di identifikashon riba sédula di{" "}
                {(watch("maritalStatus") ?? request.maritalStatus) === "gehuwd"
                  ? "kasá"
                  : (watch("maritalStatus") ?? request.maritalStatus) ===
                    "weduwe"
                  ? "kasá ku a fayesé"
                  : "pareha"}
              </Typography>
              <Controller
                id="identificationNumberPartner"
                name="identificationNumberPartner"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`Number di identifikashon riba sédula di ${
                      (watch("maritalStatus") ?? request.maritalStatus) ===
                      "gehuwd"
                        ? "kasá"
                        : (watch("maritalStatus") ?? request.maritalStatus) ===
                          "weduwe"
                        ? "kasá ku a fayesé"
                        : "pareha"
                    }`}
                    variant="outlined"
                    type="number"
                    fullWidth
                    error={errors?.identificationNumberPartner ? true : false}
                    value={field.value || ""}
                  />
                )}
              />
              {errors?.identificationNumberPartner && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.identificationNumberPartner.message}
                </p>
              )}
            </Grid>
            {[
              "gehuwd",
              "geregistreerd partnerschap",
              "ongehuwd",
              "gescheiden",
            ].includes(
              watch("maritalStatus")?.value ?? request.maritalStatus
            ) && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  ‘Upload’ prueba di entrada di bo{" "}
                  {(watch("maritalStatus") ?? request.maritalStatus) ===
                  "gehuwd"
                    ? "kasá"
                    : "pareha"}
                </Typography>
                <Controller
                  control={control}
                  name="proofOfPartnerIncome"
                  render={({ field }) => (
                    <DropzoneArea
                      {...field}
                      initialFiles={request.proofOfPartnerIncome || []}
                      label="‘Upload’ prueba di entrada di bo kas"
                      dropzoneText={`‘Upload’ prueba di entrada di bo ${
                        watch("maritalStatus") === "gehuwd" ? "kasá" : "pareha"
                      } (image/* òf .pdf)`}
                      error={errors?.proofOfPartnerIncome ? true : false}
                      onDrop={(files) => onDropHandler(files, 2)}
                      onDelete={(file) => onDeleteHandler(file, 2)}
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

                {errors?.proofOfPartnerIncome && (
                  <p style={{ color: "#bf1650" }}>
                    {errors?.proofOfPartnerIncome.message}
                  </p>
                )}
              </Grid>
            )}
            {["geregistreerd partnerschap", "gehuwd"].includes(
              watch("maritalStatus") ?? request.maritalStatus
            ) && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  {`‘Upload’ prueba di ${
                    (watch("maritalStatus") ?? request.maritalStatus) ===
                    "gehuwd"
                      ? "matrimonio òf buki di matrimonio"
                      : "konbibensia legalisá di pareha"
                  }`}
                </Typography>
                <Controller
                  name="proofOfMarriage"
                  control={control}
                  render={({ field }) => (
                    <DropzoneArea
                      {...field}
                      initialFiles={request.proofOfMarriage || []}
                      dropzoneText={`‘Upload’ prueba di ${
                        watch("maritalStatus") === "gehuwd"
                          ? "matrimonio òf buki di matrimonio"
                          : "konbibensia legalisá di pareha"
                      } (image/* òf .pdf)`}
                      label="Prueba di matrimonio"
                      error={errors?.proofOfMarriage ? true : false}
                      classes={{
                        root: classes.dropzoneRoot,
                        text: classes.dropzoneText,
                        icon: classes.dropzoneIcon,
                      }}
                      onDrop={(files) =>
                        onDropHandler(
                          files,
                          watch("maritalStatus") === "gehuwd" ? 3 : 4
                        )
                      }
                      onDelete={(file) =>
                        onDeleteHandler(
                          file,
                          watch("maritalStatus") === "gehuwd" ? 3 : 4
                        )
                      }
                      filesLimit={1}
                      acceptedFiles={["image/*", ".pdf"]}
                      showPreviews={true}
                      showPreviewsInDropzone={false}
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

                {errors?.proofOfMarriage && (
                  <p style={{ color: "#bf1650" }}>
                    {errors?.proofOfMarriage.message}
                  </p>
                )}
              </Grid>
            )}
            {(watch("maritalStatus") ?? request.maritalStatus) === "weduwe" && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  ‘Upload’ e prueba di fayesementu di bo kasá
                </Typography>
                <Controller
                  control={control}
                  name="proofOfDeath"
                  render={({ field }) => (
                    <DropzoneArea
                      {...field}
                      initialFiles={request.proofOfDeath || []}
                      label="Prueba di matrimonio"
                      dropzoneText="‘Upload’ e prueba di fayesementu di bo kasá(image/* òf .pdf)"
                      error={errors?.proofOfDeath ? true : false}
                      onDrop={(files) => onDropHandler(files, 6)}
                      onDelete={(file) => onDeleteHandler(file, 6)}
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
                {errors?.proofOfDeath && (
                  <p style={{ color: "#bf1650" }}>
                    {errors?.proofOfDeath.message}
                  </p>
                )}
              </Grid>
            )}
          </>
        ) : null}
        {JSON.parse(watch("hasRelationship") ?? !!request.hasRelationship) && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Bo ta biba huntu ku bo pareha?
            </Typography>
            <Controller
              control={control}
              name="livingTogether"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  error={errors?.children ? true : false}
                  row
                >
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
            {errors?.livingTogether && (
              <p style={{ color: "#bf1650" }}>
                {errors?.livingTogether.message}
              </p>
            )}
          </Grid>
        )}
        {JSON.parse(watch("livingTogether") ?? !!request.livingTogether) && (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Na kua adrès boso ta biba?
              </Typography>
              <AddressSelect
                name="livingTogetherAddress"
                label="Na kua adrès boso ta biba"
                control={control}
                required={true}
                error={errors?.livingTogetherAddress ? true : false}
              />
              {errors?.livingTogetherAddress && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.livingTogetherAddress.message}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Na kua number di adrès boso ta biba?
              </Typography>
              <Controller
                id="livingTogetherAddressNumber"
                name="livingTogetherAddressNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Na kua number di adrès boso ta biba? "
                    variant="outlined"
                    required
                    fullWidth
                    error={errors?.livingTogetherAddressNumber ? true : false}
                    value={field.value || ""}
                  />
                )}
              />
              {errors?.livingTogetherAddressNumber && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.livingTogetherAddressNumber.message}
                </p>
              )}
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            19. Bo tin yu?
          </Typography>
          <Controller
            control={control}
            name="hasChildren"
            error={errors?.children ? true : false}
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
          {errors?.hasChildren && (
            <p style={{ color: "#bf1650" }}>{errors?.hasChildren.message}</p>
          )}
        </Grid>
        {JSON.parse(watch("hasChildren") ?? !!request.hasChildren) ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Yu propio
              </Typography>
              <Controller
                control={control}
                name="ownChildren"
                render={({ field }) => (
                  <Select variant="outlined" fullWidth {...field}>
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                  </Select>
                )}
                error={errors?.ownChildren ? true : false}
              />
              {errors?.ownChildren && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.ownChildren.message}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                ‘Upload’ akto di nasementu di bo yu(nan)/buki di famia
              </Typography>
              <Controller
                name="proofOfChildren"
                control={control}
                render={({ field }) => (
                  <DropzoneArea
                    {...field}
                    initialFiles={request.proofOfChildren || []}
                    dropzoneText="‘Upload’ akto di nasementu di bo yu(nan)/buki di famia (image/* òf .pdf)"
                    error={errors?.proofOfChildren ? true : false}
                    onDrop={(files) => onDropHandler(files, 7)}
                    onDelete={(file) => onDeleteHandler(file, 7)}
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
              {errors?.proofOfChildren && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.proofOfChildren.message}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Yu di kriansa
              </Typography>
              <Controller
                control={control}
                name="notOwnChildren"
                render={({ field }) => (
                  <Select variant="outlined" fullWidth {...field}>
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                  </Select>
                )}
                error={errors?.notOwnChildren ? true : false}
              />
              {errors?.notOwnChildren && (
                <p style={{ color: "#bf1650" }}>
                  {errors?.notOwnChildren.message}
                </p>
              )}
            </Grid>
          </>
        ) : null}
        <Grid
          container
          item
          alignItems="center"
          justifyContent="center"
          xs={12}
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
          {errors && Object.values(errors).length !== 0 && (
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

export default General;
