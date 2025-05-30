import Button from "@mui/material/Button";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthContext } from "../context/AuthContext";
import { useFirebase } from "../hooks/useFirebase";
import { useToast } from "../hooks/useToast";
import { personDetailsSchema, fieldRequiredMessage } from "./checkOut";

export const signUpSchema = personDetailsSchema
  .extend({
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        "At least 8 characters including an uppercase and a lowercase letter, a number and a special character."
      )
      .min(8, { message: fieldRequiredMessage }),
    passwordConfirmation: z.string().min(1, { message: fieldRequiredMessage }),
  })
  .refine((schema) => schema.password === schema.passwordConfirmation, {
    message: "Passwords must match",
    path: ["passwordConfirmation"],
  });

export type TSignUp = z.infer<typeof signUpSchema>;

function SignUp() {
  const navigate = useNavigate();
  const { currentUser, signUp, loading } = useAuthContext();
  const { existingAccount } = useFirebase();

  const { control, handleSubmit, watch, getValues, setError, clearErrors, formState: {isValid, isSubmitting, errors, submitCount} } =
    useForm<TSignUp>({
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirmation: "",
        postcode: "",
        addressLine1: "",
        addressLine2: "",
        town: "",
      },
      resolver: zodResolver(signUpSchema),
      mode: "onTouched",
    });

    console.log({errors, isValid, submitCount})

  const watchEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(watch("email"));

  useQuery<boolean | undefined>(
    ["email", getValues("email")],
    existingAccount,
    {
      enabled: watchEmail,
      onSuccess: (data) => {
        if (data) {
          setError("email", {
            type: "duplicate",
            message: "email address already in use",
          });
        } else {
          clearErrors("email");
        }
      },
    }
  );

  const toast = useToast();

  const handleOnSubmit = async (values: TSignUp) => {
    //first check for existing account
    const email = values?.email;
    const phone = values?.phone;
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
          phone as string,
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
        toast.error(`Error siging up, please try again. ${err}`);
      }
    }
  };

  return currentUser.user ? (
    <Navigate to={"/logout"} />
  ) : (
    <>
      <Grid container sx={{ minHeight: "calc(100% - 12.5rem)" }}>
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
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  type="email"
                  label="Email Address"
                  disabled={loading}
                  error={!!error}
                  helperText={error?.message ?? ""}
                  autoFocus
                />
              )}
            />
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Phone number"
                  disabled={loading}
                  error={!!error}
                  helperText={error?.message ?? ""}
                />
              )}
            />
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  name="password"
                  error={!!error}
                  helperText="At least 8 characters including a uppercase and a lowercase letter, a number and a special character."
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
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  error={!!error}
                  helperText={error?.message ?? ""}
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
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  type="text"
                  label="First Name"
                  error={!!error}
                  helperText={error?.message ?? ""}
                />
              )}
            />
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  type="text"
                  label="Last Name"
                  error={!!error}
                  helperText={error?.message ?? ""}
                />
              )}
            />
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="postcode"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  error={!!error}
                  helperText={error?.message ?? ""}
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
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  type="text"
                  label="Address Line 1"
                  error={!!error}
                  helperText={error?.message ?? ""}
                />
              )}
            />
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="addressLine2"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  type="text"
                  label="Address Line 2"
                  error={!!error}
                  helperText={error?.message ?? ""}
                />
              )}
            />
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="town"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  type="text"
                  label="Town"
                  error={!!error}
                  helperText={error?.message ?? ""}
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
                disabled={isSubmitting || !isValid}
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
      <DevTool control={control} />
    </>
  );
}

export default SignUp;
