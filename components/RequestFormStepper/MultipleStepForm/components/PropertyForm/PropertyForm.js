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
  Checkbox,
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

const PropertyForm = (props) => {
  const { className, handleNext, handleBack, ...rest } = props;
  const { request, setRequest } = useRequest();
  const [images, setImages] = useState([]);
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const schema = yup.object().shape({
    hasVehicle: yup
      .bool()
      .nullable()
      .required("Mester skohe si bo tin kas ta vehiculo"),
    vehicle: yup.string().when("hasVehicle", {
      is: (val) => val && val === true,
      then: yup.string().required("Mester yena ki tipo di vehikulo"),
    }),
    numberPlate: yup.string().when("hasVehicle", {
      is: (val) => val && val === true,
      then: yup.string().required("Mester yena e plachi number"),
    }),
    hasBoat: yup.bool().nullable().required("Mester skohe si bo tin boto"),
    boatInformation: yup.string().when("hasBoat", {
      is: (val) => val && val === true,
      then: yup
        .string()
        .nullable()
        .required("Mester yena datos di registrashon di e boto"),
    }),
    hasRentedHouse: yup
      .bool()
      .nullable()
      .required("Mester skohe si bo tin kas ta hür"),
    hasBankAccount: yup
      .bool()
      .nullable()
      .required("Mester skohe si bo tin kuenta di banko"),
    bankAccountType: yup.string().when("hasBankAccount", {
      is: (val) => val && val === true,
      then: yup.string().required("Mester skohe ki tipo di kuenta di banko"),
    }),
    currentAccountStatements: yup.array().when("bankAccountType", {
      is: (val) => val && (val === "current" || val === "both"),
      then: yup
        .array()
        .required(
          "Mester ‘upload’ último dos statement di bo kuenta di koriente"
        ),
    }),
    savingsAccountStatements: yup.array().when("bankAccountType", {
      is: (val) => val && (val === "savings" || val === "both"),
      then: yup
        .array()
        .required("Mester ‘upload’ último dos statement di bo kuenta di spar"),
    }),
    hasMoreSourceOfIncome: yup
      .bool()
      .nullable()
      .required("Mester skohe si bo tin mas fuente di entrada"),
    moreSourceOfIncome: yup.string().when("hasMoreSourceOfIncome", {
      is: (val) => val && val === true,
      then: yup.string().required("Mester spesifiká esaki"),
    }),
    rentalMonthlyPrice: yup.string().when("hasRentedHouse", {
      is: (val) => val && val === true,
      then: yup.string().required("Mester yena e montante pa luna"),
    }),
    hasOwnHouse: yup
      .bool()
      .nullable()
      .required("Mester skohe si bo ta biba den bo mes kas"),
    payingMortgage: yup
      .bool()
      .nullable()
      .when("hasOwnHouse", {
        is: (val) => val && val === true,
        then: yup
          .bool()
          .nullable()
          .required("Mester skohe si bo ta pagando hipotek"),
      }),
    reasonNotPayingMortgage: yup.string().when("payingMortgage", {
      is: (val) => val !== null && val === false,
      then: yup.string().required("Mester yena dikon bo no ta pagando hipotek"),
    }),
    notOwnHouse: yup
      .string()
      .nullable()
      .when("hasOwnHouse", {
        is: (val) => val !== null && val === false,
        then: yup
          .string()
          .nullable()
          .required("Mester skohe si bo ta biba den bo mes kas"),
      }),
    houseAddress: yup
      .string()
      .when("hasOwnHouse", {
        is: (val) => val && val === true,
        then: yup.string().required("Mester yena e adres"),
      })
      .when("hasOwnHouse", {
        is: (val) => val !== null && val === false,
        then: yup.string().required("Mester yena e adres"),
      }),
    houseMortgageDebt: yup.string().when("payingMortgage", {
      is: (val) => val && val === true,
      then: yup.string().required("Mester yena e montante"),
    }),
    houseRentalPrice: yup.string().when("notOwnHouse", {
      is: (val) => val && ["rent", "fkp"].includes(val),
      then: yup.string().required("Mester yena kuantu sèn bo ta paga na hür"),
    }),
    houseContribution: yup.string().when("notOwnHouse", {
      is: (val) => val && val === "liveIn",
      then: yup
        .string()
        .required("Mester yena kuantu sèn bo ta paga na kontribushon"),
    }),
    liveInDescription: yup.string().when("notOwnHouse", {
      is: (val) => val && val === "liveIn",
      then: yup.string().required("Mester spesifiká na unda bo ta kedando"),
    }),
    // houseResidents: [],
    proofOfRentalContract: yup.array().when("notOwnHouse", {
      is: (val) => val && ["rent", "fkp"].includes(val),
      then: yup
        .array()
        .required("Mester ‘upload’ kòntrakt di hur of apoderashon"),
    }),
    otherHousing: yup.string().when("notOwnHouse", {
      is: (val) => val && val === "other",
      then: yup.string().nullable().required("Mester otro"),
    }),
    hasDependents: yup
      .bool()
      .nullable()
      .required(
        "Mester skohe si tin mas persona ta depende di bo finansieramente"
      ),
    hasSignupFkp: yup
      .bool()
      .nullable()
      .required("Mester skohe si bo ta inskribí na FKP pa bo risibí un kas"),
    signupFkpYear: yup.number().when("hasSignupFkp", {
      is: (val) => val && val === true,
      then: yup
        .number()
        .nullable()
        .test(
          "len",
          "Mester ta 4 number",
          (val) => !val || (val && val.toString().length === 4)
        )
        .moreThan(0, "Mester yena for di ki aña"),
    }),
    fkpPoints: yup.number().when("hasSignupFkp", {
      is: (val) => val && val === true,
      then: yup
        .number()
        .nullable()
        .moreThan(0, "Mester yena e kantidat di punto"),
    }),
    dependents: yup.array().when("hasDependents", {
      is: (val) => val === true,
      then: yup.array().required("Mester yena ken mas ta biba den kas kubo"),
    }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm({
    defaultValues: request,
    resolver: yupResolver(schema),
  });

  const onDeleteHandler = (file) => {
    setImages(images.filter((image) => image !== file));
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

  const handleDependentsSelect = (checkedName) => {
    const newNames = getValues("dependents")?.includes(checkedName)
      ? getValues("dependents")?.filter((name) => name !== checkedName)
      : [...(getValues("dependents") ?? []), checkedName];

    setValue("dependents", newNames);
    return newNames;
  };

  const handleHouseResidentsSelect = (checkedName) => {
    const newNames = getValues("houseResidents")?.includes(checkedName)
      ? getValues("houseResidents")?.filter((name) => name !== checkedName)
      : [...(getValues("houseResidents") ?? []), checkedName];

    setValue("houseResidents", newNames);
    return newNames;
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
          <Typography variant="h6" color="textPrimary">
            Propiedat
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
            23. Kiko ta bo propiedatnan
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin vehíkulo?
          </Typography>
          <Controller
            control={control}
            name="hasVehicle"
            render={({ field }) => (
              <RadioGroup
                {...field}
                error={errors?.hasVehicle ? true : false}
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
          {errors.hasVehicle ? (
            <p style={{ color: "#bf1650" }}>{errors.hasVehicle.message}</p>
          ) : null}
        </Grid>
        {JSON.parse(watch("hasVehicle") ?? request.hasVehicle) && (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kiko ta e tipo di vehíkulo
              </Typography>
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Kiko ta e tipo di vehíkulo"
                    variant="outlined"
                    fullWidth
                    error={errors.vehicle ? true : false}
                  />
                )}
                id="vehicle"
                name="vehicle"
                control={control}
              />
              {errors.vehicle ? (
                <p style={{ color: "#bf1650" }}>{errors.vehicle.message}</p>
              ) : null}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kiko ta e plachi number?
              </Typography>
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Kiko ta e plachi number?"
                    variant="outlined"
                    fullWidth
                    error={errors.numberPlate ? true : false}
                  />
                )}
                id="numberPlate"
                name="numberPlate"
                control={control}
              />
              {errors.numberPlate && (
                <p style={{ color: "#bf1650" }}>{errors.numberPlate.message}</p>
              )}
            </Grid>
          </>
        )}

        <Grid
          item
          xs={12}
          sm={JSON.parse(watch("hasBoat") ?? request.hasBoat) ? 6 : false}
        >
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin boto
          </Typography>
          <Controller
            control={control}
            name="hasBoat"
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
          {errors.hasBoat ? (
            <p style={{ color: "#bf1650" }}>{errors.hasBoat.message}</p>
          ) : null}
        </Grid>
        {JSON.parse(watch("hasBoat") ?? request.hasBoat) && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Kiko ta su datos di registrashon?
            </Typography>
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Kiko ta su datos di registrashon?"
                  variant="outlined"
                  fullWidth
                  error={errors.boatInformation ? true : false}
                />
              )}
              id="boatInformation"
              name="boatInformation"
              control={control}
            />
            {errors.boatInformation && (
              <p style={{ color: "#bf1650" }}>
                {errors.boatInformation.message}
              </p>
            )}
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm={
            JSON.parse(watch("hasRentedHouse") ?? request.hasRentedHouse)
              ? 6
              : false
          }
        >
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin kas ta hür
          </Typography>
          <Controller
            control={control}
            name="hasRentedHouse"
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
          {errors.hasRentedHouse && (
            <p style={{ color: "#bf1650" }}>{errors.hasRentedHouse.message}</p>
          )}
        </Grid>
        {JSON.parse(watch("hasRentedHouse") ?? request.hasRentedHouse) && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Kuantu esaki ta generá pa luna?
            </Typography>
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Kuantu esaki ta generá pa luna?"
                  variant="outlined"
                  fullWidth
                  error={errors.rentalMonthlyPrice ? true : false}
                />
              )}
              id="rentalMonthlyPrice"
              name="rentalMonthlyPrice"
              control={control}
            />
            {errors.rentalMonthlyPrice && (
              <p style={{ color: "#bf1650" }}>
                {errors.rentalMonthlyPrice.message}
              </p>
            )}
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin kuenta di banko?
          </Typography>
          <Controller
            control={control}
            name="hasBankAccount"
            render={({ field }) => (
              <RadioGroup
                {...field}
                error={errors?.hasBankAccount ? true : false}
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
          {errors.hasBankAccount ? (
            <p style={{ color: "#bf1650" }}>{errors.hasBankAccount.message}</p>
          ) : null}
        </Grid>
        {JSON.parse(watch("hasBankAccount") ?? request.hasBankAccount) && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Ki tipo di kuenta di banko bo tin?
            </Typography>
            <Controller
              control={control}
              name="bankAccountType"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  error={errors?.bankAccountType ? true : false}
                  row
                >
                  <FormControlLabel
                    value="current"
                    control={<Radio />}
                    label="kuenta di koriente"
                  />
                  <FormControlLabel
                    value="savings"
                    control={<Radio />}
                    label="kuenta di spar"
                  />
                  <FormControlLabel
                    value="both"
                    control={<Radio />}
                    label="tur dos"
                  />
                </RadioGroup>
              )}
            />
            {errors?.bankAccountType ? (
              <p style={{ color: "#bf1650" }}>
                {errors.bankAccountType.message}
              </p>
            ) : null}
          </Grid>
        )}
        {((watch("bankAccountType") ?? request.bankAccountType) === "current" ||
          (watch("bankAccountType") ?? request.bankAccountType) === "both") && (
          <Grid
            item
            xs={12}
            sm={
              (watch("bankAccountType") ?? request.bankAccountType) ===
                "savings" ||
              (watch("bankAccountType") ?? request.bankAccountType) === "both"
                ? 6
                : false
            }
          >
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Kuenta koriente di bo banko
            </Typography>
            <Controller
              name="currentAccountStatements"
              control={control}
              render={({ field }) => (
                <DropzoneArea
                  {...field}
                  clearOnUnmount={false}
                  initialFiles={request.currentAccountStatements || []}
                  dropzoneText="‘Upload’ último dos statement di bo kuenta koriente (image/* òf .pdf)"
                  error={errors.currentAccountStatements ? true : false}
                  onDrop={(files) => onDropHandler(files, 10)}
                  onDelete={(file) => onDeleteHandler(file, 10)}
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
            {errors.currentAccountStatements && (
              <p style={{ color: "#bf1650" }}>
                {errors.currentAccountStatements.message}
              </p>
            )}
          </Grid>
        )}
        {((watch("bankAccountType") ?? request.bankAccountType) === "savings" ||
          (watch("bankAccountType") ?? request.bankAccountType) === "both") && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Kuenta di spar di bo banko
            </Typography>

            <Controller
              name="savingsAccountStatements"
              control={control}
              render={({ field }) => (
                <DropzoneArea
                  {...field}
                  initialFiles={request.savingsAccountStatements || []}
                  dropzoneText="‘Upload’ último dos statement di bo kuenta di spar(image/* òf .pdf)"
                  error={errors.savingsAccountStatements ? true : false}
                  onDrop={(files) => onDropHandler(files, 11)}
                  onDelete={(file) => onDeleteHandler(file, 11)}
                  clearOnUnmount={false}
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
            {errors.savingsAccountStatements && (
              <p style={{ color: "#bf1650" }}>
                {errors.savingsAccountStatements.message}
              </p>
            )}
          </Grid>
        )}

        <Grid
          item
          xs={12}
          sm={
            JSON.parse(
              watch("hasMoreSourceOfIncome") ?? request.hasMoreSourceOfIncome
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
            Bo tin mas fuente di entrada?
          </Typography>
          <Controller
            control={control}
            name="hasMoreSourceOfIncome"
            render={({ field }) => (
              <RadioGroup
                {...field}
                error={errors?.hasMoreSourceOfIncome ? true : false}
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
          {errors.hasMoreSourceOfIncome ? (
            <p style={{ color: "#bf1650" }}>
              {errors.hasMoreSourceOfIncome.message}
            </p>
          ) : null}
        </Grid>
        {JSON.parse(
          watch("hasMoreSourceOfIncome") ?? request.hasMoreSourceOfIncome
        ) ? (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor spesifiká esaki
            </Typography>
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Por fabor spesifiká esaki"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  error={errors.moreSourceOfIncome ? true : false}
                />
              )}
              id="moreSourceOfIncome"
              name="moreSourceOfIncome"
              control={control}
            />
            {errors.moreSourceOfIncome && (
              <p style={{ color: "#bf1650" }}>
                {errors.moreSourceOfIncome.message}
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
            24. Bo ta biba den bo mes kas?
          </Typography>
          <Controller
            control={control}
            name="hasOwnHouse"
            render={({ field }) => (
              <RadioGroup
                {...field}
                error={errors?.hasOwnHouse ? true : false}
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
          {errors.hasOwnHouse ? (
            <p style={{ color: "#bf1650" }}>{errors.hasOwnHouse.message}</p>
          ) : null}
        </Grid>
        {JSON.parse(watch("hasOwnHouse") ?? request.hasOwnHouse) !== null && (
          <>
            {!JSON.parse(watch("hasOwnHouse") ?? request.hasOwnHouse) && (
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="notOwnHouse"
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      error={errors?.notOwnHouse ? true : false}
                      row
                    >
                      <FormControlLabel
                        value="inherit"
                        control={<Radio />}
                        label="Mi a heredá e kas"
                      />
                      <FormControlLabel
                        value="rent"
                        control={<Radio />}
                        label="Mi ta biba den kas di hür"
                      />
                      <FormControlLabel
                        value="fkp"
                        control={<Radio />}
                        label="Mi ta biba den kas di FKP"
                      />
                      <FormControlLabel
                        value="liveIn"
                        control={<Radio />}
                        label="Mi ta biba otro kaminda"
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Otro"
                      />
                    </RadioGroup>
                  )}
                />
                {errors.notOwnHouse && (
                  <p style={{ color: "#bf1650" }}>
                    {errors.notOwnHouse.message}
                  </p>
                )}
              </Grid>
            )}
            {JSON.parse(watch("hasOwnHouse") ?? request.hasOwnHouse) ||
            (!JSON.parse(watch("hasOwnHouse") ?? request.hasOwnHouse) &&
              (watch("notOwnHouse") ?? request.notOwnHouse) !== "") ? (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Adrès
                  </Typography>
                  <Controller
                    id="houseAddress"
                    name="houseAddress"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Adrès"
                        variant="outlined"
                        fullWidth
                        error={errors.houseAddress ? true : false}
                      />
                    )}
                  />
                  {errors.houseAddress && (
                    <p style={{ color: "#bf1650" }}>
                      {errors.houseAddress.message}
                    </p>
                  )}
                </Grid>
                {(watch("notOwnHouse") === "other" ??
                  request.notOwnHouse === "other") && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Otro
                    </Typography>
                    <Controller
                      id="otherHousing"
                      name="otherHousing"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Otro"
                          variant="outlined"
                          fullWidth
                          error={errors.otherHousing ? true : false}
                        />
                      )}
                    />

                    {errors.otherHousing && (
                      <p style={{ color: "#bf1650" }}>
                        {errors.otherHousing.message}
                      </p>
                    )}
                  </Grid>
                )}
                {JSON.parse(watch("hasOwnHouse") ?? request.hasOwnHouse) ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        Bo ta paga hipotek?
                      </Typography>
                      <Controller
                        control={control}
                        name="payingMortgage"
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            error={errors?.payingMortgage ? true : false}
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
                      {errors.payingMortgage && (
                        <p style={{ color: "#bf1650" }}>
                          {errors.payingMortgage.message}
                        </p>
                      )}
                    </Grid>
                    {JSON.parse(
                      watch("payingMortgage") ?? request.payingMortgage
                    ) && (
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          Kuantu bo ta paga pa luna na hipotek?
                        </Typography>
                        <Controller
                          id="houseMortgageDebt"
                          name="houseMortgageDebt"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              variant="outlined"
                              fullWidth
                              label="Kuantu bo ta paga pa luna na hipotek?"
                              error={errors.houseMortgageDebt ? true : false}
                            />
                          )}
                        />
                        {errors.houseMortgageDebt && (
                          <p style={{ color: "#bf1650" }}>
                            {errors.houseMortgageDebt.message}
                          </p>
                        )}
                      </Grid>
                    )}
                    {
                      //(watch('payingMortgage') ?? request.payingMortgage !== null) &&
                      !JSON.parse(
                        watch("payingMortgage") ?? request.payingMortgage
                      ) && (
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                          >
                            Dikon nò?
                          </Typography>
                          <Controller
                            id="reasonNotPayingMortgage"
                            name="reasonNotPayingMortgage"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Dikon nò?"
                                variant="outlined"
                                multiline
                                rows={3}
                                fullWidth
                                error={
                                  errors.reasonNotPayingMortgage ? true : false
                                }
                              />
                            )}
                          />
                          {errors.reasonNotPayingMortgage && (
                            <p style={{ color: "#bf1650" }}>
                              {errors.reasonNotPayingMortgage.message}
                            </p>
                          )}
                        </Grid>
                      )
                    }
                  </>
                ) : ["rent", "fkp"].includes(
                    watch("notOwnHouse") ?? request.notOwnHouse
                  ) ? (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Kuantu sèn bo ta paga na hür?
                    </Typography>
                    <Controller
                      id="houseRentalPrice"
                      name="houseRentalPrice"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Kuantu sèn bo ta paga na hür?"
                          variant="outlined"
                          fullWidth
                          error={errors.houseRentalPrice ? true : false}
                        />
                      )}
                    />
                    {errors.houseRentalPrice && (
                      <p style={{ color: "#bf1650" }}>
                        {errors.houseRentalPrice.message}
                      </p>
                    )}
                  </Grid>
                ) : (
                  (watch("notOwnHouse") === "liveIn" ??
                    request.notOwnHouse === "liveIn") && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          Por fabor spesifiká na unda bo ta kedando
                        </Typography>
                        <Controller
                          id="liveInDescription"
                          name="liveInDescription"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Por fabor spesifiká na unda bo ta kedando"
                              variant="outlined"
                              fullWidth
                              error={errors.liveInDescription ? true : false}
                            />
                          )}
                        />
                        {errors.liveInDescription && (
                          <p style={{ color: "#bf1650" }}>
                            {errors.liveInDescription.message}
                          </p>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          Kiko ta bo kontribushon pa luna aki?
                        </Typography>
                        <Controller
                          id="houseContribution"
                          name="houseContribution"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              variant="outlined"
                              fullWidth
                              label="Kiko ta bo kontribushon pa luna aki?"
                              error={errors.houseContribution ? true : false}
                            />
                          )}
                        />
                        {errors.houseContribution && (
                          <p style={{ color: "#bf1650" }}>
                            {errors.houseContribution.message}
                          </p>
                        )}
                      </Grid>
                    </>
                  )
                )}
                {!JSON.parse(watch("hasOwnHouse") ?? request.hasOwnHouse) &&
                  (watch("notOwnHouse") ?? request.hasOwnHouse !== "other") && (
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        Ken mas ta biba den kas kubo? (skohe mas opshon si esaki
                        ta e kaso)
                      </Typography>
                      {[
                        "Kasá",
                        "Pareha",
                        "Yu",
                        "Ruman",
                        "Otro famia",
                        "Amigu/amiga",
                      ].map((name) => (
                        <FormControlLabel
                          control={
                            <Controller
                              name="houseResidents"
                              render={({ field }) => {
                                return (
                                  <Checkbox
                                    {...field}
                                    checked={
                                      field.value?.includes(name) || false
                                    }
                                    onChange={() =>
                                      field.onChange(
                                        handleHouseResidentsSelect(name)
                                      )
                                    }
                                  />
                                );
                              }}
                              control={control}
                            />
                          }
                          key={name}
                          label={name}
                        />
                      ))}
                      {errors.houseResidents && (
                        <p style={{ color: "#bf1650" }}>
                          {errors.houseResidents.message}
                        </p>
                      )}
                    </Grid>
                  )}
                {["rent", "fkp"].includes(
                  watch("notOwnHouse") ?? request.notOwnHouse
                ) && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        ‘Upload’ kòntrakt di hur of apoderashon
                      </Typography>
                      <Controller
                        name="proofOfRentalContract"
                        control={control}
                        render={({ field }) => (
                          <DropzoneArea
                            {...field}
                            initialFiles={request.proofOfRentalContract || []}
                            dropzoneText="‘Upload’ kòntrakt di hur of apoderashon (image/* òf .pdf)"
                            error={errors.proofOfRentalContract ? true : false}
                            onDrop={(files) => onDropHandler(files, 16)}
                            onDelete={(file) => onDeleteHandler(file, 16)}
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
                      {errors.proofOfRentalContract && (
                        <p style={{ color: "#bf1650" }}>
                          {errors.proofOfRentalContract.message}
                        </p>
                      )}
                    </Grid>
                    {(watch("notOwnHouse") === "rent" ??
                      request.notOwnHouse === "rent") && (
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          ‘Upload’ prueba di pago
                        </Typography>
                        {((request.edited && request.proofOfRentalPayment) ||
                          !request.edited) && (
                          <Controller
                            name="proofOfRentalPayment"
                            control={control}
                            render={({ field }) => (
                              <DropzoneArea
                                {...field}
                                initialFiles={
                                  request.proofOfRentalPayment || []
                                }
                                dropzoneText="‘Upload’ prueba di pago (image/* òf .pdf)"
                                error={
                                  errors.proofOfRentalPayment ? true : false
                                }
                                onDrop={(files) => onDropHandler(files, 17)}
                                onDelete={(file) => onDeleteHandler(file, 17)}
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
                        {errors.proofOfRentalPayment && (
                          <p style={{ color: "#bf1650" }}>
                            {errors.proofOfRentalPayment.message}
                          </p>
                        )}
                      </Grid>
                    )}
                  </>
                )}
              </>
            ) : null}
          </>
        )}

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo ta inskribí na FKP pa bo risibí un kas?
          </Typography>
          <Controller
            control={control}
            name="hasSignupFkp"
            render={({ field }) => (
              <RadioGroup
                {...field}
                error={errors?.hasSignupFkp ? true : false}
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
          {errors.hasSignupFkp && (
            <p style={{ color: "#bf1650" }}>{errors.hasSignupFkp.message}</p>
          )}
        </Grid>
        {request.hasSignupFkp || JSON.parse(watch("hasSignupFkp")) ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                For di ki aña?
              </Typography>
              <Controller
                id="signupFkpYear"
                name="signupFkpYear"
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="For di ki aña?"
                    fullWidth
                    type="number"
                    value={field.value || ""}
                    error={errors.signupFkpYear ? true : false}
                  />
                )}
                control={control}
              />
              {errors.signupFkpYear && (
                <p style={{ color: "#bf1650" }}>
                  {errors.signupFkpYear.message}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kuantu punto bo tin di spar?
              </Typography>
              <Controller
                id="fkpPoints"
                name="fkpPoints"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Kuantu punto bo tin di spar?"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={field.value || ""}
                    error={errors.fkpPoints ? true : false}
                  />
                )}
              />
              {errors.fkpPoints && (
                <p style={{ color: "#bf1650" }}>{errors.fkpPoints.message}</p>
              )}
            </Grid>
          </>
        ) : null}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            25. Tin mas persona ta depende di bo finansieramente? (skohe mas
            opshon si esaki ta e kaso)
          </Typography>
          <Controller
            control={control}
            name="hasDependents"
            render={({ field }) => (
              <RadioGroup
                {...field}
                error={errors?.hasDependents ? true : false}
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
          {errors.hasDependents && (
            <p style={{ color: "#bf1650" }}>{errors.hasDependents.message}</p>
          )}
        </Grid>
        {JSON.parse(request.hasDependents || watch("hasDependents")) ? (
          <Grid item xs={12}>
            {["Kasá", "Pareha", "Yu", "Ruman", "Otro famia", "Amigu/amiga"].map(
              (name) => (
                <FormControlLabel
                  control={
                    <Controller
                      name="dependents"
                      render={({ field }) => {
                        return (
                          <Checkbox
                            {...field}
                            checked={field.value?.includes(name) || false}
                            onChange={() =>
                              field.onChange(handleDependentsSelect(name))
                            }
                          />
                        );
                      }}
                      control={control}
                    />
                  }
                  key={name}
                  label={name}
                />
              )
            )}
            {errors.dependents && (
              <p style={{ color: "#bf1650" }}>{errors.dependents.message}</p>
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

export default PropertyForm;
