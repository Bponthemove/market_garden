import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { IAuthSignUp, useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Box } from "@mui/material";
import { useToast } from "../hooks/useToast";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { DevTool } from "@hookform/devtools";

function SignUp() {
  const navigate = useNavigate();
  const { currentUser, signUp, loading } = useAuthContext();

  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null);

  const toast = useToast();

  const { control, handleSubmit } = useForm<IAuthSignUp>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: "",
      password: "",
      passwordConfirmation: "",
      postcode: "",
      addressLine1: "",
      addressLine2: "",
      town: "",
    },
    reValidateMode: "onBlur",
  });

  const password = useWatch({
    control,
    name: "password",
  });

  const handleValidateEmail = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const value = event.target.value;
    if (value) {
      setEmailValid(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value));
    }
  };

  const handleValidatePassword = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const value = event.target.value;
    if (value) {
      setPasswordValid(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)
      );
    }
  };

  const handlePasswordConfirmation = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const value = event.target.value;
    console.log("password confirmation", password, value);
    if (value && password && value === password) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  const handleValidatePostcode = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const value = event.target.value;
    if (value) {
      setPostcodeValid(
        /^([A-Za-z]{2}[\d]{1,2}[A-Za-z]?)[\s]+([\d][A-Za-z]{2})$/.test(value)
      );
    }
  };

  const handleOnSubmit = async (values: IAuthSignUp) => {
    console.log({ values }, "submit signing up");
    const email = values?.email;
    const password = values?.password;
    const firstName = values?.firstName;
    const lastName = values?.lastName;
    const postcode = values?.postcode;
    const addressLine1 = values?.addressLine1;
    const addressLine2 = values?.addressLine2;
    const town = values?.town;
    if (password && email) {
      try {
        signUp(
          email as string,
          password as string,
          firstName as string,
          lastName as string,
          postcode as string,
          addressLine1 as string,
          addressLine2 as string,
          town as string
        );
        toast.success(`Welcome ${firstName}, you have successfully signed up!`);
        navigate("/");
      } catch (err) {
        console.error(err);
        toast.error(`Error siging up, please try again.`);
      }
    }
  };

  return currentUser.user ? (
    <Navigate to={"/logout"} />
  ) : (
    <>
    <Grid container sx={{ minHeight: "calc(100vh - 12.5rem)" }}>
      <Grid item xs={0} md={1} />
      <Grid
        item
        container
        xs={12}
        md={6.5}
        gap={1}
        component="form"
        display="flex"
        justifyContent="center"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <Grid item xs={8} my={2}>
          <Typography component="h1" variant="h4">
            Sign Up
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                type="email"
                label="Email Address"
                disabled={loading}
                onBlur={handleValidateEmail}
                error={emailValid === false}
                color={emailValid ? "success" : "primary"}
                helperText={
                  emailValid || emailValid == null
                    ? ""
                    : "Please enter a valid email address."
                }
                autoFocus
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                name="password"
                onBlur={handleValidatePassword}
                focused={!!passwordValid}
                color={passwordValid ? "success" : "primary"}
                error={passwordValid === false}
                disabled={loading}
                helperText={
                  passwordValid || passwordValid == null
                    ? ""
                    : "Password must contain at least 8 chararcters including one uppercase and one lowercae letter and one number."
                }
                label="Password"
                type="password"
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <Controller
            name="passwordConfirmation"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                onBlur={handlePasswordConfirmation}
                focused={!!passwordMatch && !!passwordValid}
                color={passwordMatch && passwordValid ? "success" : "primary"}
                error={passwordMatch === false}
                disabled={loading}
                helperText={
                  passwordMatch || passwordMatch == null
                    ? ""
                    : "Password must match."
                }
                label="Password Confirmation"
                type="password"
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                type="text"
                label="First Name"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                type="text"
                label="Last Name"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <Controller
            name="postcode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                onBlur={handleValidatePostcode}
                color={postcodeValid ? "success" : "primary"}
                error={postcodeValid === false}
                disabled={loading}
                helperText={
                  postcodeValid || postcodeValid == null
                    ? ""
                    : "Please enter a valid postcode, including spaces. "
                }
                label="Postcode"
                type="text"
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <Controller
            name="addressLine1"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                type="text"
                label="Address Line 1"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <Controller
            name="addressLine2"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                type="text"
                label="Address Line 2"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <Controller
            name="town"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                type="text"
                label="Town"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          my={2}
          container
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
              startIcon={<AssignmentTurnedInIcon />}
            >
              Sign Up
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={0} md={1} />
      <Grid
        item
        flexGrow="1"
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Grid>
    <DevTool control={control}/>
    </>
  );
}

export default SignUp;
