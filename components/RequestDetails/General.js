import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import {
  useMediaQuery,
  Grid,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Image from "next/image";
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
  ImageList: {
    paddingTop: 40,
    transform: "translateZ(0)",
  },
  ImageListTile: {
    width: "100%",
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

const General = (props) => {
  const { className, ...rest } = props;
  const { request } = useRequest();
  const router = useRouter();
  const classes = useStyles;

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
      style={{ width: "100%" }}
    >
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            size="large"
            onClick={() => router.push("/request/status")}
          >
            Bai Bèk
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Status
          </Typography>
          <Typography variant="h4" color="secondary">
            {request?.status}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Komentario
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request.comments ? request.comments : "No Tin Komentario"}
          </Typography>
        </Grid>
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
          <Typography variant="body1" color="textSecondary">
            {request?.lastName}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            2. Nòmber
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.firstName}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            3. Adrès kaminda ta registrá ofisialmente na Kranshi
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request.registeredAddress}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            4. Number di adrès na Kranshi
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request.registeredAddressNumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            5. Adrès kaminda bo ta biba aktualmente
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request.currentAddress}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            6. Number di adrès aktual
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request.currentAddressNumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            7. Pais di nasementu
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request.placeOfBirth}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            8. Nashonalidat Hulandes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request.hasDutchNationality ? "Si" : "No"}
          </Typography>
        </Grid>
        {!request?.hasDutchNationality &&
        request.images?.find((img) => img.categoryId === 1) ? (
          <Grid item xs={12}>
            <Typography variant="h6" color="textPrimary">
              Pèrmit di estadia
            </Typography>
            <ImageList className={classes.gridList} rowHeight={"auto"} cols={0}>
              {request.images ? (
                request.images
                  .filter((img) => img.categoryId === 1)
                  .map((image, index) => (
                    <ImageListItem key={index} className={classes.gridListTile}>
                      {image.type.includes("application/pdf") ? (
                        <iframe
                          title={image.name}
                          src={`${image.type},${image.base64}`}
                          width="100%"
                          height="580px"
                        ></iframe>
                      ) : (
                        <div style={{ height: 500, position: "relative" }}>
                          <Image
                            src={`${image.type},${image.base64}`}
                            alt={image.name}
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover" }}
                          />
                          <ImageListItemBar
                            title={image.name}
                            actionIcon={
                              <IconButton
                                aria-label={`info about ${image.name}`}
                              >
                                <InfoIcon />
                              </IconButton>
                            }
                          />
                        </div>
                      )}
                    </ImageListItem>
                  ))
              ) : (
                <ImageListItem />
              )}
            </ImageList>
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            9. Fecha di nasementu
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {format(new Date(request?.dateOfBirth), "dd-MM-yyyy")}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            10. Number di identifikashon
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.identificationNumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            11. Sekso
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.gender}
          </Typography>
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
          <Typography variant="body1" color="textSecondary">
            {request?.identificationType}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            13. Fecha di vensementu
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {format(new Date(request?.expiryDate), "dd-MM-yyyy")}
          </Typography>
        </Grid>
        {request.images?.find((img) => img.categoryId === 22) ? (
          <Grid item xs={12}>
            <Typography variant="h6" color="textPrimary">
              Prueba di bo identifikashon
            </Typography>
            <ImageList className={classes.gridList} rowHeight={"auto"} cols={0}>
              {request.images ? (
                request.images
                  .filter((img) => img.categoryId === 22)
                  .map((image, index) => (
                    <ImageListItem key={index} className={classes.gridListTile}>
                      {image.type.includes("application/pdf") ? (
                        <iframe
                          title={image.name}
                          src={`${image.type},${image.base64}`}
                          width="100%"
                          height="580px"
                        ></iframe>
                      ) : (
                        <div style={{ height: 500, position: "relative" }}>
                          <Image
                            src={`${image.type},${image.base64}`}
                            alt={image.name}
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover" }}
                          />
                          <ImageListItemBar
                            title={image.name}
                            actionIcon={
                              <IconButton
                                aria-label={`info about ${image.name}`}
                              >
                                <InfoIcon />
                              </IconButton>
                            }
                          />
                        </div>
                      )}
                    </ImageListItem>
                  ))
              ) : (
                <ImageListItem />
              )}
            </ImageList>
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            14. Number di telefòn di selular
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.phone1}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Number di telefòn di whatsapp
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.whatsapp}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            15. Number di telefòn kas
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.phone2}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}></Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            16. E-mail
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.email}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            18. Estado sivil
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.maritalStatus}
          </Typography>
        </Grid>
        {["divorced", "divorcedPartnership"].includes(
          request?.maritalStatus
        ) && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" color="textPrimary">
                prueba di divorsio{" "}
                {request?.maritalStatus === "divorcedPartnership" ??
                  "di konbibensia legalisá di pareha"}
              </Typography>
              <ImageList
                className={classes.gridList}
                rowHeight={"auto"}
                cols={0}
              >
                {request.images ? (
                  request.images
                    .filter((img) => img.categoryId === 5)
                    .map((image, index) => (
                      <ImageListItem
                        key={index}
                        className={classes.gridListTile}
                      >
                        {image.type.includes("application/pdf") ? (
                          <iframe
                            title={image.name}
                            src={`${image.type},${image.base64}`}
                            width="100%"
                            height="500px"
                          ></iframe>
                        ) : (
                          <div style={{ height: 500, position: "relative" }}>
                            <Image
                              src={`${image.type},${image.base64}`}
                              alt={image.name}
                              fill
                              sizes="100vw"
                              style={{ objectFit: "cover" }}
                            />
                            <ImageListItemBar
                              title={image.name}
                              actionIcon={
                                <IconButton
                                  aria-label={`info about ${image.name}`}
                                >
                                  <InfoIcon />
                                </IconButton>
                              }
                            />
                          </div>
                        )}
                      </ImageListItem>
                    ))
                ) : (
                  <ImageListItem />
                )}
              </ImageList>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="textPrimary">
                prueba di veredikto
              </Typography>
              <ImageList
                className={classes.gridList}
                rowHeight={"auto"}
                cols={0}
              >
                {request.images ? (
                  request.images
                    .filter((img) => img.categoryId === 21)
                    .map((image, index) => (
                      <ImageListItem
                        key={index}
                        className={classes.gridListTile}
                      >
                        {image.type.includes("application/pdf") ? (
                          <iframe
                            title={image.name}
                            src={`${image.type},${image.base64}`}
                            width="100%"
                            height="500px"
                          ></iframe>
                        ) : (
                          <div style={{ height: 500, position: "relative" }}>
                            <Image
                              src={`${image.type},${image.base64}`}
                              alt={image.name}
                              fill
                              sizes="100vw"
                              style={{ objectFit: "cover" }}
                            />
                            <ImageListItemBar
                              title={image.name}
                              actionIcon={
                                <IconButton
                                  aria-label={`info about ${image.name}`}
                                >
                                  <InfoIcon />
                                </IconButton>
                              }
                            />
                          </div>
                        )}
                      </ImageListItem>
                    ))
                ) : (
                  <ImageListItem />
                )}
              </ImageList>
            </Grid>
          </>
        )}
        {(request.maritalStatus === "divorced" ||
          request.maritalStatus === "single") && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Bo ta den un relashon aktualmente?
            </Typography>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              {request?.hasRelationship ? "Si" : "Nò"}
            </Typography>
          </Grid>
        )}
        {[
          "married",
          "registeredPartnership",
          "widow",
          "divorcedPartnership",
        ].includes(request?.maritalStatus) || request?.hasRelationship ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Fam di{" "}
                {request?.maritalStatus === "married"
                  ? "kasá"
                  : request?.maritalStatus === "widow"
                  ? "kasá ku a fayesé"
                  : "pareha"}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                {request?.lastNamePartner}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Nòmber di{" "}
                {request?.maritalStatus === "married"
                  ? "kasá"
                  : request?.maritalStatus === "widow"
                  ? "kasá ku a fayesé"
                  : "pareha"}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                {request.firstNamePartner}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Number di identifikashon riba sédula di{" "}
                {request?.maritalStatus === "married"
                  ? "kasá"
                  : request?.maritalStatus === "widow"
                  ? "kasá ku a fayesé"
                  : "pareha"}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                {request?.identificationNumberPartner}
              </Typography>
            </Grid>
            {[
              "married",
              "registeredPartnership",
              "single",
              "divorced",
            ].includes(request?.maritalStatus) && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  Prueba di entrada di bo{" "}
                  {request?.maritalStatus === "married" ? "kasá" : "pareha"}
                </Typography>
                <ImageList
                  className={classes.gridList}
                  rowHeight={"auto"}
                  cols={0}
                >
                  {request.images ? (
                    request.images
                      .filter((img) => img.categoryId === 2)
                      .map((image, index) => (
                        <ImageListItem
                          key={index}
                          className={classes.gridListTile}
                        >
                          {image.type.includes("application/pdf") ? (
                            <iframe
                              title={image.name}
                              src={`${image.type},${image.base64}`}
                              width="100%"
                              height="500px"
                            ></iframe>
                          ) : (
                            <div style={{ height: 500, position: "relative" }}>
                              <Image
                                src={`${image.type},${image.base64}`}
                                alt={image.name}
                                fill
                                sizes="100vw"
                                style={{ objectFit: "cover" }}
                              />
                              <ImageListItemBar
                                title={image.name}
                                actionIcon={
                                  <IconButton
                                    aria-label={`info about ${image.name}`}
                                  >
                                    <InfoIcon />
                                  </IconButton>
                                }
                              />
                            </div>
                          )}
                        </ImageListItem>
                      ))
                  ) : (
                    <ImageListItem />
                  )}
                </ImageList>
              </Grid>
            )}
            {request?.maritalStatus === "widow" && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  Prueba di fayesementu di bo kasá
                </Typography>
                <ImageList
                  className={classes.gridList}
                  rowHeight={"auto"}
                  cols={0}
                >
                  {request.images ? (
                    request.images
                      .filter((img) => img.categoryId === 6)
                      .map((image, index) => (
                        <ImageListItem
                          key={index}
                          className={classes.gridListTile}
                        >
                          {image.type.includes("application/pdf") ? (
                            <iframe
                              title={image.name}
                              src={`${image.type},${image.base64}`}
                              width="100%"
                              height="500px"
                            ></iframe>
                          ) : (
                            <div style={{ height: 500, position: "relative" }}>
                              <Image
                                src={`${image.type},${image.base64}`}
                                alt={image.name}
                                fill
                                sizes="100vw"
                                style={{ objectFit: "cover" }}
                              />
                              <ImageListItemBar
                                title={image.name}
                                actionIcon={
                                  <IconButton
                                    aria-label={`info about ${image.name}`}
                                  >
                                    <InfoIcon />
                                  </IconButton>
                                }
                              />
                            </div>
                          )}
                        </ImageListItem>
                      ))
                  ) : (
                    <ImageListItem />
                  )}
                </ImageList>
              </Grid>
            )}
          </>
        ) : null}
        {request?.maritalStatus === "single" && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Bo ta biba huntu ku bo pareha?
            </Typography>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              {request?.livingTogether ? "Si" : "No"}
            </Typography>
          </Grid>
        )}
        {request?.livingTogether && (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Na kua adrès boso ta biba?
              </Typography>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                {request?.livingTogetherAddress}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Na kua number di adrès boso ta biba?
              </Typography>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                {request?.livingTogetherAddressNumber}
              </Typography>
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin yu?
          </Typography>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            {request?.hasChildren ? "Si" : "No"}
          </Typography>
        </Grid>
        {request?.hasChildren ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Propio yu
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.inputTitle}
              >
                {request?.ownChildren}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Akto di nasementu di bo yu(nan)/buki di famia
              </Typography>
              <ImageList
                className={classes.gridList}
                rowHeight={"auto"}
                cols={0}
              >
                {request.images ? (
                  request.images
                    .filter((img) => img.categoryId === 7)
                    .map((image, index) => (
                      <ImageListItem
                        key={index}
                        className={classes.gridListTile}
                      >
                        {image.type.includes("application/pdf") ? (
                          <iframe
                            title={image.name}
                            src={`${image.type},${image.base64}`}
                            width="100%"
                            height="500px"
                          ></iframe>
                        ) : (
                          <div style={{ height: 500, position: "relative" }}>
                            <Image
                              src={`${image.type},${image.base64}`}
                              alt={image.name}
                              fill
                              sizes="100vw"
                              style={{ objectFit: "cover" }}
                            />
                            <ImageListItemBar
                              title={image.name}
                              actionIcon={
                                <IconButton
                                  aria-label={`info about ${image.name}`}
                                >
                                  <InfoIcon />
                                </IconButton>
                              }
                            />
                          </div>
                        )}
                      </ImageListItem>
                    ))
                ) : (
                  <ImageListItem />
                )}
              </ImageList>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Yu di kriansa
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.inputTitle}
              >
                {request?.notOwnChildren}
              </Typography>
            </Grid>
          </>
        ) : null}
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
            Bo tin entrada aktualmente?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasIncome ? "Si" : "No"}
          </Typography>
        </Grid>
        {request?.hasIncome && (
          <>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kon bo a yega na e entrada aki ?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.work === "freelance" && "Mi ta kue djòp"}
                {request?.work === "employee" && "Mi ta traha na un kompania"}
                {request?.work === "selfEmployed" &&
                  "Mi ta traha riba mi mes (lora man)"}
              </Typography>
            </Grid>
            {["freelance", "employee"].includes(request?.work) && (
              <>
                {request?.work === "freelance" && (
                  <>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Mi ta kue djòp
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {request?.contractee}
                    </Typography>
                  </>
                )}
                {(["company", "person"].includes(request?.contractee) ||
                  request?.work === "employee") && (
                  <>
                    {request?.contractee === "company" ||
                    request?.work === "employee" ? (
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          Nòmber di kompania
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {request?.employerCompanyName}
                        </Typography>
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
                      <Typography variant="body1" color="textSecondary">
                        {request?.employerName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        Adrès di e trabou
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {request?.employerAddress}
                      </Typography>
                    </Grid>
                  </>
                )}
              </>
            )}
            {["freelance", "employee", "selfEmployed"].includes(
              request?.work
            ) && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    {`Ki tipo di ${
                      request?.work === "freelance"
                        ? "djòp bo ta kue"
                        : "trabou bo ta hasi"
                    }?`}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {request?.employerJobType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Kuantu sèn bo tabata risibí pa bo trabou?
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {request?.employerSalary}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Ku ki frekuensia bo ta risibí e sèn aki?
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {request?.employerPayFrequency}
                    </Typography>
                  </>
                </Grid>
                {request?.work === "employee" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        Bo tin un kòntrakt di trabou?
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {request?.hasContract ? "Si" : "No"}
                      </Typography>
                    </Grid>
                    {request.hasContract && (
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          ‘Upload’ e kòntrakt
                        </Typography>
                        <ImageList
                          className={classes.gridList}
                          rowHeight={"auto"}
                          cols={0}
                        >
                          {request.images ? (
                            request.images
                              .filter((img) => img.categoryId === 20)
                              .map((image, index) => (
                                <ImageListItem
                                  key={index}
                                  className={classes.gridListTile}
                                >
                                  {image.type.includes("application/pdf") ? (
                                    <iframe
                                      title={image.name}
                                      src={`${image.type},${image.base64}`}
                                      width="100%"
                                      height="500px"
                                    ></iframe>
                                  ) : (
                                    <div
                                      style={{
                                        height: 500,
                                        position: "relative",
                                      }}
                                    >
                                      <Image
                                        src={`${image.type},${image.base64}`}
                                        alt={image.name}
                                        fill
                                        sizes="100vw"
                                        style={{ objectFit: "cover" }}
                                      />
                                      <ImageListItemBar
                                        title={image.name}
                                        actionIcon={
                                          <IconButton
                                            aria-label={`info about ${image.name}`}
                                          >
                                            <InfoIcon />
                                          </IconButton>
                                        }
                                      />
                                    </div>
                                  )}
                                </ImageListItem>
                              ))
                          ) : (
                            <ImageListItem />
                          )}
                        </ImageList>
                      </Grid>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" className={classes.title}>
            Motibu di Petishon
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              21. Motibu di petishon
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.reason}
            </Typography>
          </>
        </Grid>
        {request.reason === "lostJob" ? (
          <>
            <Grid item xs={12}>
              <>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  Último bia ku bo a traha tabata pa kua persona òf kompania?
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {request?.lastWork}
                </Typography>
              </>
            </Grid>
            {["person", "company"].includes(request.lastWork) ? (
              <>
                {request.lastWork === "company" && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Nòmber di kompania
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {request?.lastEmployerCompanyName}
                    </Typography>
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
                  <Typography variant="body1" color="textSecondary">
                    {request?.lastEmployerName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Adrès di e último lugá di trabou
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {request?.lastEmployerAddress}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Ki tipo di trabou bo a traha último biaha?
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {request?.lastEmployerJobType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Kuantu tempu pasá esaki tabata?
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {request?.lastEmployerTimeAgo}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Si bo tin mas ku 1 aña ku bo a pèrdè bo trabou, ‘upload’ bo
                    deklarashon di entrada.
                  </Typography>

                  <ImageList
                    className={classes.gridList}
                    rowHeight={"auto"}
                    cols={0}
                  >
                    {request.images ? (
                      request.images
                        .filter((img) => img.categoryId === 15)
                        .map((image, index) => (
                          <ImageListItem
                            key={index}
                            className={classes.gridListTile}
                          >
                            {image.type.includes("application/pdf") ? (
                              <iframe
                                title={image.name}
                                src={`${image.type},${image.base64}`}
                                width="100%"
                                height="500px"
                              ></iframe>
                            ) : (
                              <div
                                style={{ height: 500, position: "relative" }}
                              >
                                <Image
                                  src={`${image.type},${image.base64}`}
                                  alt={image.name}
                                  fill
                                  sizes="100vw"
                                  style={{ objectFit: "cover" }}
                                />
                                <ImageListItemBar
                                  title={image.name}
                                  actionIcon={
                                    <IconButton
                                      aria-label={`info about ${image.name}`}
                                    >
                                      <InfoIcon />
                                    </IconButton>
                                  }
                                />
                              </div>
                            )}
                          </ImageListItem>
                        ))
                    ) : (
                      <ImageListItem />
                    )}
                  </ImageList>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Kuantu sèn bo tabata gana na bo último trabou?
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {request?.lastEmployerSalary}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Ku ki frekuensia bo ta risibí e sèn aki?
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {request?.lastEmployerPayFrequency}
                    </Typography>
                  </>
                </Grid>
              </>
            ) : null}
          </>
        ) : (
          request.reason === "cannotWork" && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  Kiko ta e motibu ku bo no por traha?
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {request?.reasonCannotWork}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  ‘Upload’ prueba ku bo no por traha
                </Typography>
                <ImageList
                  className={classes.gridList}
                  rowHeight={"auto"}
                  cols={0}
                >
                  {request.images ? (
                    request.images
                      .filter((img) => img.categoryId === 9)
                      .map((image, index) => (
                        <ImageListItem
                          key={index}
                          className={classes.gridListTile}
                        >
                          {image.type.includes("application/pdf") ? (
                            <iframe
                              title={image.name}
                              src={`${image.type},${image.base64}`}
                              width="100%"
                              height="500px"
                            ></iframe>
                          ) : (
                            <div style={{ height: 500, position: "relative" }}>
                              <Image
                                src={`${image.type},${image.base64}`}
                                alt={image.name}
                                fill
                                sizes="100vw"
                                style={{ objectFit: "cover" }}
                              />
                              <ImageListItemBar
                                title={image.name}
                                actionIcon={
                                  <IconButton
                                    aria-label={`info about ${image.name}`}
                                  >
                                    <InfoIcon />
                                  </IconButton>
                                }
                              />
                            </div>
                          )}
                        </ImageListItem>
                      ))
                  ) : (
                    <ImageListItem />
                  )}
                </ImageList>
              </Grid>
            </>
          )
        )}
        {["cannotWork", "other", "lostJob"].includes(request.reason) && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor amplia bo motibu di petishon
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.otherReason}
            </Typography>
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
          <Typography variant="body1" color="textSecondary">
            {request?.activelyJobSeeking ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request.activelyJobSeeking ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kon bo ta solisitá?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.jobSeekingMethod}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Karta(nan) di solisitut
              </Typography>
              <ImageList
                className={classes.gridList}
                rowHeight={"auto"}
                cols={0}
              >
                {request.images ? (
                  request.images
                    .filter((img) => img.categoryId === 8)
                    .map((image, index) => (
                      <ImageListItem
                        key={index}
                        className={classes.gridListTile}
                      >
                        {image.type.includes("application/pdf") ? (
                          <iframe
                            title={image.name}
                            src={`${image.type},${image.base64}`}
                            width="100%"
                            height="500px"
                          ></iframe>
                        ) : (
                          <div style={{ height: 500, position: "relative" }}>
                            <Image
                              src={`${image.type},${image.base64}`}
                              alt={image.name}
                              fill
                              sizes="100vw"
                              style={{ objectFit: "cover" }}
                            />
                            <ImageListItemBar
                              title={image.name}
                              actionIcon={
                                <IconButton
                                  aria-label={`info about ${image.name}`}
                                >
                                  <InfoIcon />
                                </IconButton>
                              }
                            />
                          </div>
                        )}
                      </ImageListItem>
                    ))
                ) : (
                  <ImageListItem />
                )}
              </ImageList>
            </Grid>
          </>
        ) : request.activelyJobSeeking !== null ? (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Dikon nò?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.reasonNoJobSeeking}
            </Typography>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" className={classes.title}>
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
          <Typography variant="body1" color="textSecondary">
            {request?.hasVehicle ? "Si" : "No"}
          </Typography>
        </Grid>
        {request.hasVehicle && (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kiko ta e tipo di vehíkulo
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.vehicle}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kiko ta e plachi number?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.numberPlate ? "Si" : "No"}
              </Typography>
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={request?.hasBoat ? 6 : false}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin boto
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasBoat ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request?.hasBoat && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Kiko ta su datos di registrashon?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.boatInformation}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={request?.hasRentedHouse ? 6 : false}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin kas ta hür
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasRentedHouse ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request?.hasRentedHouse && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Kuantu esaki ta generá pa luna?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.rentalMonthlyPrice}
            </Typography>
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
          <Typography variant="body1" color="textSecondary">
            {request?.hasBankAccount ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request?.hasBankAccount && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Ki tipo di kuenta di banko bo tin?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.bankAccountType}
            </Typography>
          </Grid>
        )}
        {(request?.bankAccountType === "current" ||
          request?.bankAccountType === "both") && (
          <Grid
            item
            xs={12}
            sm={
              request?.bankAccountType === "savings" ||
              request?.bankAccountType === "both"
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
            <ImageList className={classes.gridList} rowHeight={"auto"} cols={0}>
              {request.images ? (
                request.images
                  .filter((img) => img.categoryId === 10)
                  .map((image, index) => (
                    <ImageListItem key={index} className={classes.gridListTile}>
                      {image.type.includes("application/pdf") ? (
                        <iframe
                          title={image.name}
                          src={`${image.type},${image.base64}`}
                          width="100%"
                          height="500px"
                        ></iframe>
                      ) : (
                        <div style={{ height: 500, position: "relative" }}>
                          <Image
                            src={`${image.type},${image.base64}`}
                            alt={image.name}
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover" }}
                          />
                          <ImageListItemBar
                            title={image.name}
                            actionIcon={
                              <IconButton
                                aria-label={`info about ${image.name}`}
                              >
                                <InfoIcon />
                              </IconButton>
                            }
                          />
                        </div>
                      )}
                    </ImageListItem>
                  ))
              ) : (
                <ImageListItem />
              )}
            </ImageList>
          </Grid>
        )}
        {(request.bankAccountType === "savings" ||
          request.bankAccountType === "both") && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Kuenta di spar di bo banko
            </Typography>
            <ImageList className={classes.gridList} rowHeight={"auto"} cols={0}>
              {request.images ? (
                request.images
                  .filter((img) => img.categoryId === 11)
                  .map((image, index) => (
                    <ImageListItem key={index} className={classes.gridListTile}>
                      {image.type.includes("application/pdf") ? (
                        <iframe
                          title={image.name}
                          src={`${image.type},${image.base64}`}
                          width="100%"
                          height="500px"
                        ></iframe>
                      ) : (
                        <div style={{ height: 500, position: "relative" }}>
                          <Image
                            src={`${image.type},${image.base64}`}
                            alt={image.name}
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover" }}
                          />
                          <ImageListItemBar
                            title={image.name}
                            actionIcon={
                              <IconButton
                                aria-label={`info about ${image.name}`}
                              >
                                <InfoIcon />
                              </IconButton>
                            }
                          />
                        </div>
                      )}
                    </ImageListItem>
                  ))
              ) : (
                <ImageListItem />
              )}
            </ImageList>
          </Grid>
        )}
        <Grid item xs={12} sm={request?.hasMoreSourceOfIncome ? 6 : false}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin mas fuente di entrada?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasMoreSourceOfIncome ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request?.hasMoreSourceOfIncome && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor spesifiká esaki
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.moreSourceOfIncome}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            24. Bo ta biba den bo mes kas?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasOwnHouse ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request?.hasOwnHouse !== null && (
          <>
            {!request?.hasOwnHouse && (
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary">
                  {request?.notOwnHouse}
                </Typography>
              </Grid>
            )}
            {(request?.hasOwnHouse ||
              (!request?.hasOwnHouse && request?.notOwnHouse !== "")) && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.inputTitle}
                  >
                    Adrès
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {request?.houseAddress}
                  </Typography>
                </Grid>
                {request?.notOwnHouse === "other" && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Otro
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {request?.otherHousing}
                    </Typography>
                  </Grid>
                )}
                {request?.hasOwnHouse ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        Bo ta paga hipotek?
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {request?.payingMortgage ? "Si" : "Nò"}
                      </Typography>
                    </Grid>
                    {request?.payingMortgage && (
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          Kuantu bo ta paga pa luna na hipotek?
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {request?.houseMortgageDebt}
                        </Typography>
                      </Grid>
                    )}
                    {request?.payingMortgage !== null &&
                      !request?.payingMortgage && (
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.inputTitle}
                          >
                            Dikon nò?
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            {request?.reasonNotPayingMortgage}
                          </Typography>
                        </Grid>
                      )}
                  </>
                ) : ["rent", "fkp"].includes(request?.notOwnHouse) ? (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Kuantu sèn bo ta paga na hür?
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {request?.houseRentalPrice}
                    </Typography>
                  </Grid>
                ) : (
                  request?.notOwnHouse === "liveIn" && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          Por fabor spesifiká na unda bo ta kedando
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {request?.liveInDescription}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          Kiko ta bo kontribushon pa luna aki?
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {request?.houseContribution}
                        </Typography>
                      </Grid>
                    </>
                  )
                )}
                {!request.hasOwnHouse && request.notOwnHouse !== "other" && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                      className={classes.inputTitle}
                    >
                      Ken mas ta biba den kas kubo?
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {request?.houseResidents}
                    </Typography>
                  </Grid>
                )}
                {["rent", "fkp"].includes(request?.notOwnHouse) && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        color="textPrimary"
                        className={classes.inputTitle}
                      >
                        Kòntrakt di hur of apoderashon
                      </Typography>
                      <ImageList
                        className={classes.gridList}
                        rowHeight={"auto"}
                        cols={0}
                      >
                        {request.images ? (
                          request.images
                            .filter((img) => img.categoryId === 16)
                            .map((image, index) => (
                              <ImageListItem
                                key={index}
                                className={classes.gridListTile}
                              >
                                {image.type.includes("application/pdf") ? (
                                  <iframe
                                    title={image.name}
                                    src={`${image.type},${image.base64}`}
                                    width="100%"
                                    height="500px"
                                  ></iframe>
                                ) : (
                                  <div
                                    style={{
                                      height: 500,
                                      position: "relative",
                                    }}
                                  >
                                    <Image
                                      src={`${image.type},${image.base64}`}
                                      alt={image.name}
                                      fill
                                      sizes="100vw"
                                      style={{ objectFit: "cover" }}
                                    />
                                    <ImageListItemBar
                                      title={image.name}
                                      actionIcon={
                                        <IconButton
                                          aria-label={`info about ${image.name}`}
                                        >
                                          <InfoIcon />
                                        </IconButton>
                                      }
                                    />
                                  </div>
                                )}
                              </ImageListItem>
                            ))
                        ) : (
                          <ImageListItem />
                        )}
                      </ImageList>
                    </Grid>
                    {request.notOwnHouse === "rent" && (
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          color="textPrimary"
                          className={classes.inputTitle}
                        >
                          Prueba di pago
                        </Typography>
                        <ImageList
                          className={classes.gridList}
                          rowHeight={"auto"}
                          cols={0}
                        >
                          {request.images ? (
                            request.images
                              .filter((img) => img.categoryId === 17)
                              .map((image, index) => (
                                <ImageListItem
                                  key={index}
                                  className={classes.gridListTile}
                                >
                                  {image.type.includes("application/pdf") ? (
                                    <iframe
                                      title={image.name}
                                      src={`${image.type},${image.base64}`}
                                      width="100%"
                                      height="500px"
                                    ></iframe>
                                  ) : (
                                    <div
                                      style={{
                                        height: 500,
                                        position: "relative",
                                      }}
                                    >
                                      <Image
                                        src={`${image.type},${image.base64}`}
                                        alt={image.name}
                                        fill
                                        sizes="100vw"
                                        style={{ objectFit: "cover" }}
                                      />
                                      <ImageListItemBar
                                        title={image.name}
                                        actionIcon={
                                          <IconButton
                                            aria-label={`info about ${image.name}`}
                                          >
                                            <InfoIcon />
                                          </IconButton>
                                        }
                                      />
                                    </div>
                                  )}
                                </ImageListItem>
                              ))
                          ) : (
                            <ImageListItem />
                          )}
                        </ImageList>
                      </Grid>
                    )}
                  </>
                )}
              </>
            )}
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
          <Typography variant="body1" color="textSecondary">
            {request?.hasSignupFkp ? "Si" : "No"}
          </Typography>
        </Grid>
        {request.hasSignupFkp && (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                For di ki aña?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.signupFkpYear}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Kuantu punto bo tin di spar?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.fkpPoints}
              </Typography>
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            25. Tin mas persona ta depende di bo finansieramente?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasDependents ? request?.dependents : "Nò"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" className={classes.title}>
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
          <Typography variant="body1" color="textSecondary">
            {request?.education}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin diploma?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasCertificate ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request?.hasCertificate && (
          <Grid item xs={6} sm={4}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Na ki aña bo a risibí e diploma?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.certificateYear}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            27. Bo a risibí sertifikado di algun kurso/workshòp ku ba partisipá
            na dje?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasOtherCertificate ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request.hasOtherCertificate && (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Por fabor indiká sertifikado di kua kurso/workshòp
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.otherCertificateDescription}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Na ki aña bo a risibí e sertifikado?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.otherCertificateYear}
              </Typography>
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            28. Bo a yega di traha den e sektor ku bo a studia aden?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasCertificateWorkExperience ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request?.hasCertificateWorkExperience && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Na kua kompania?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.certificateWorkExperienceCompany}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" className={classes.title}>
            Salú físiko i mental
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
            29. Kon bo estado di salú físiko ta?
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Kon bo mobilidat ta?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.mobility}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Kon bo oidu ta?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hearing}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Kon bo bista ta?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.visibility}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Kon bo abla ta?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.speakingAbility}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={request?.hasAdiction ? 6 : false}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo ta sufri di un òf mas adikshon?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasAdiction ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request.hasAdiction && (
          <Grid item xs={6} sm={request.hasAdictionTreatment ? 3 : false}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Bo ta hañando yudansa di un instansia?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.hasAdictionTreatment ? "Si" : "Nò"}
            </Typography>
          </Grid>
        )}
        {request.hasAdictionTreatment && (
          <Grid item xs={6} sm={3}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor indiká kua instansia
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.adictionTreatmentCenter}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={request.hasDiseases ? 6 : false}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            30. Bo ta sufri di algun malesa
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasDiseases ? request?.diseases : "Nò"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            31. Bo ta bou di tratamentu di un médiko òf paramédiko?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasMedicalTreatment ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request.hasMedicalTreatment && (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Ki tipo di médiko òf paramédiko?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.medicalTreatment}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Ki ta e nòmber di e médiko òf paramédiko?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.medicalPractitionerName}
              </Typography>
            </Grid>
          </>
        )}
        {request?.medicalTreatment === "specialist" && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Karta di bo spesialista médiko
            </Typography>
            <ImageList className={classes.gridList} rowHeight={"auto"} cols={0}>
              {request.images ? (
                request.images
                  .filter((img) => img.categoryId === 12)
                  .map((image, index) => (
                    <ImageListItem key={index} className={classes.gridListTile}>
                      {image.type.includes("application/pdf") ? (
                        <iframe
                          title={image.name}
                          src={`${image.type},${image.base64}`}
                          width="100%"
                          height="500px"
                        ></iframe>
                      ) : (
                        <div style={{ height: 500, position: "relative" }}>
                          <Image
                            src={`${image.type},${image.base64}`}
                            alt={image.name}
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover" }}
                          />
                          <ImageListItemBar
                            title={image.name}
                            actionIcon={
                              <IconButton
                                aria-label={`info about ${image.name}`}
                              >
                                <InfoIcon />
                              </IconButton>
                            }
                          />
                        </div>
                      )}
                    </ImageListItem>
                  ))
              ) : (
                <ImageListItem />
              )}
            </ImageList>
          </Grid>
        )}
        {request?.medicalTreatment === "psychologist" && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor ‘upload’ e karta di bo sikólogo
            </Typography>
            <ImageList className={classes.gridList} rowHeight={"auto"} cols={0}>
              {request.images ? (
                request.images
                  .filter((img) => img.categoryId === 13)
                  .map((image, index) => (
                    <ImageListItem key={index} className={classes.gridListTile}>
                      {image.type.includes("application/pdf") ? (
                        <iframe
                          title={image.name}
                          src={`${image.type},${image.base64}`}
                          width="100%"
                          height="500px"
                        ></iframe>
                      ) : (
                        <div style={{ height: 500, position: "relative" }}>
                          <Image
                            src={`${image.type},${image.base64}`}
                            alt={image.name}
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover" }}
                          />
                          <ImageListItemBar
                            title={image.name}
                            actionIcon={
                              <IconButton
                                aria-label={`info about ${image.name}`}
                              >
                                <InfoIcon />
                              </IconButton>
                            }
                          />
                        </div>
                      )}
                    </ImageListItem>
                  ))
              ) : (
                <ImageListItem />
              )}
            </ImageList>
          </Grid>
        )}{" "}
        {request?.medicalTreatment === "psychiatrist" && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor ‘upload’ e karta di bo sikiatra
            </Typography>
            <ImageList className={classes.gridList} rowHeight={"auto"} cols={0}>
              {request.images ? (
                request.images
                  .filter((img) => img.categoryId === 14)
                  .map((image, index) => (
                    <ImageListItem key={index} className={classes.gridListTile}>
                      {image.type.includes("application/pdf") ? (
                        <iframe
                          title={image.name}
                          src={`${image.type},${image.base64}`}
                          width="100%"
                          height="500px"
                        ></iframe>
                      ) : (
                        <div style={{ height: 500, position: "relative" }}>
                          <Image
                            src={`${image.type},${image.base64}`}
                            alt={image.name}
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover" }}
                          />
                          <ImageListItemBar
                            title={image.name}
                            actionIcon={
                              <IconButton
                                aria-label={`info about ${image.name}`}
                              >
                                <InfoIcon />
                              </IconButton>
                            }
                          />
                        </div>
                      )}
                    </ImageListItem>
                  ))
              ) : (
                <ImageListItem />
              )}
            </ImageList>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            32. Dor di bo limitashon bo ta hasi huzo di
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.equipments}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            33. Kua instansia ta guia bo den esaki?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.treatmentCenters}
          </Typography>
        </Grid>
        {request?.treatmentCenters?.includes("Otro") && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Otro instansia
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.otherTreatmentCenter}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            34. Bo tin problema sígiko?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasPsychologicalLimitation ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request?.hasPsychologicalLimitation && (
          <Grid
            item
            xs={12}
            sm={request.hasPsychologicalLimitationTreatment ? 6 : false}
          >
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Bo ta haña yudansa di un instansia?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.hasPsychologicalLimitationTreatment ? "Si" : "Nò"}
            </Typography>
          </Grid>
        )}
        {request.hasPsychologicalLimitationTreatment && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor indiká kua instansia?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.psychologicalLimitationCenter}
            </Typography>
          </Grid>
        )}
        {request.hasPsychologicalLimitation && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Tin un diagnóstiko?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.hasPsychologicalLimitationDiagnostic ? "Si" : "Nò"}
            </Typography>
          </Grid>
        )}
        {request.hasPsychologicalLimitationDiagnostic ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Ken a hasi e diagnóstiko aki?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.psychologicalLimitationDiagnostician}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Fecha di diagnóstiko
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.psychologicalLimitationDiagnosticDate}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={
                request.hasPsychologicalLimitationDiagnosticReport ? 6 : false
              }
            >
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Tin un rapòrt di e diagnóstiko?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.hasPsychologicalLimitationDiagnosticReport
                  ? "Si"
                  : "Nò"}
              </Typography>
            </Grid>
            {request.hasPsychologicalLimitationDiagnosticReport && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  ‘Upload’ e karta di diagnóstiko di bo médiko
                </Typography>
                <ImageList
                  className={classes.gridList}
                  rowHeight={"auto"}
                  cols={0}
                >
                  {request.images ? (
                    request.images
                      .filter((img) => img.categoryId === 18)
                      .map((image, index) => (
                        <ImageListItem
                          key={index}
                          className={classes.gridListTile}
                        >
                          {image.type.includes("application/pdf") ? (
                            <iframe
                              title={image.name}
                              src={`${image.type},${image.base64}`}
                              width="100%"
                              height="500px"
                            ></iframe>
                          ) : (
                            <div style={{ height: 500, position: "relative" }}>
                              <Image
                                src={`${image.type},${image.base64}`}
                                alt={image.name}
                                fill
                                sizes="100vw"
                                style={{ objectFit: "cover" }}
                              />
                              <ImageListItemBar
                                title={image.name}
                                actionIcon={
                                  <IconButton
                                    aria-label={`info about ${image.name}`}
                                  >
                                    <InfoIcon />
                                  </IconButton>
                                }
                              />
                            </div>
                          )}
                        </ImageListItem>
                      ))
                  ) : (
                    <ImageListItem />
                  )}
                </ImageList>
              </Grid>
            )}
          </>
        ) : null}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Bo tin retardashon mental ?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasMentalDisorder ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request.hasMentalDisorder && request.hasMentalDisorder && (
          <Grid
            item
            xs={12}
            sm={request.hasMentalDisorderTreatment ? 6 : false}
          >
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Bo ta haña yudansa di un instansia?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.hasMentalDisorderTreatment ? "Si" : "Nò"}
            </Typography>
          </Grid>
        )}
        {request.hasMentalDisorderTreatment && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor indiká kua instansia?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.mentalDisorderTreatmentCenter}
            </Typography>
          </Grid>
        )}
        {request.hasMentalDisorder && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Tin un diagnóstiko?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.hasMentalDisorderDiagnostic ? "Si" : "Nò"}
            </Typography>
          </Grid>
        )}
        {request.hasMentalDisorderDiagnostic ? (
          <>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Ken a hasi e diagnóstiko aki?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.mentalDisorderDiagnostician}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Fecha di diagnóstiko
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.mentalDisorderDiagnosticDate}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={request.hasMentalDisorderDiagnosticReport ? 6 : false}
            >
              <Typography
                variant="subtitle1"
                color="textPrimary"
                className={classes.inputTitle}
              >
                Tin un rapòrt di e diagnóstiko?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {request?.hasMentalDisorderDiagnosticReport ? "Si" : "Nò"}
              </Typography>
            </Grid>
            {request.hasMentalDisorderDiagnosticReport && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  className={classes.inputTitle}
                >
                  ‘Upload’ e karta di diagnóstiko di bo médiko
                </Typography>
                <ImageList
                  className={classes.gridList}
                  rowHeight={"auto"}
                  cols={0}
                >
                  {request.images ? (
                    request.images
                      .filter((img) => img.categoryId === 19)
                      .map((image, index) => (
                        <ImageListItem
                          key={index}
                          className={classes.gridListTile}
                        >
                          {image.type.includes("application/pdf") ? (
                            <iframe
                              title={image.name}
                              src={`${image.type},${image.base64}`}
                              width="100%"
                              height="500px"
                            ></iframe>
                          ) : (
                            <div style={{ height: 500, position: "relative" }}>
                              <Image
                                src={`${image.type},${image.base64}`}
                                alt={image.name}
                                fill
                                sizes="100vw"
                                style={{ objectFit: "cover" }}
                              />
                              <ImageListItemBar
                                title={image.name}
                                actionIcon={
                                  <IconButton
                                    aria-label={`info about ${image.name}`}
                                  >
                                    <InfoIcon />
                                  </IconButton>
                                }
                              />
                            </div>
                          )}
                        </ImageListItem>
                      ))
                  ) : (
                    <ImageListItem />
                  )}
                </ImageList>
              </Grid>
            )}
          </>
        ) : null}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            35. Bo tin yu ku limitashon mental?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasPsychologicalLimitationChild ? "Si" : "Nò"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            36. Ki tipo di seguro bo tin?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.insurance}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}></Grid>
        <Grid item xs={12} sm={request.useMedicalSupplies ? 6 : false}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            37. Bo ta usa medikamentu?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.useMedicalSupplies ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request.useMedicalSupplies && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Ki tipo di medikamentu?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.medicalSupplies}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={request.hasWelfare ? 6 : null}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            38. Bo ta risibí yudansa sosial pa motibu di bo estado di salú?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.medicalSupplies ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request.hasWelfare && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Ki tipo di yudansa?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.welfare}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            39. Bo tin seguro di entiero?
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {request?.hasFuneralInsurance ? "Si" : "Nò"}
          </Typography>
        </Grid>
        {request.hasFuneralInsurance && (
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Por fabor indiká na kua kompania
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {request?.funeralInsurance}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            size="large"
            onClick={() => router.push("/request/status")}
          >
            Bai Bèk
          </Button>
        </Grid>
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
