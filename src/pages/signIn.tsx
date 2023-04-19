import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  IUserDetails,
  IAuthSignIn,
  useAuthContext,
} from "../context/AuthContext";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { auth } from "../firebase";
import { useFirebase } from "../hooks/useFirebase";
import { useToast } from "../hooks/useToast";
import { useQuery } from "@tanstack/react-query";

function SignInSide() {
  const navigate = useNavigate();
  const { getUserDetails } = useFirebase();
  const { currentUser, signIn, loading } = useAuthContext();
  const toast = useToast();

  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [uid, setUid] = useState<string>("");

  const { isLoading } = useQuery<IUserDetails[] | undefined>(
    ["uid", uid],
    getUserDetails,
    {
      enabled: !!uid,
      onSuccess: (data) => {
        const user = data || [];
        toast.success(
          `Hi ${user[0]?.firstName}, you have successfully logged in!`
        );
        navigate("/");
      },
    }
  );

  const { control, handleSubmit } = useForm<IAuthSignIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onBlur",
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

  const handleOnSubmit = async (values: IAuthSignIn) => {
    const email = values?.email;
    const password = values?.password;
    if (password && email) {
      try {
        await signIn(email as string, password as string);
        const user = auth.currentUser;
        const uid = user?.uid || "";
        setUid(uid);
      } catch (err) {
        console.error(err);
        toast.error("Error logging in, please try again!");
      }
    }
  };

  // useEffect(() => {
  //   //password or email autocomplete on first load
  //   handleValidateEmail()
  //   handleValidatePassword()
  // }, [])

  return currentUser.user ? (
    <Navigate to={"/logout"} />
  ) : (
    <Grid container sx={{ minHeight: "calc(100vh - 12.5rem)" }}>
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
        <Grid item xs={8}>
          <Typography component="h1" variant="h3">
            Sign In
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          container
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="caption">Don't have an account?</Typography>
            <Link to="/signup">Sign Up</Link>
          </Box>
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
                name="email"
                disabled={loading}
                onBlur={handleValidateEmail}
                error={emailValid === false}
                color={emailValid ? "success" : "primary"}
                helperText={
                  emailValid || emailValid == null
                    ? ""
                    : "Please enter a valid email address."
                }
                autoComplete="email"
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
                autoComplete="current-password"
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isLoading}
          >
            Sign In
          </Button>
        </Grid>
      </Grid>
      <Grid
        item
        flexGrow="1"
        sx={{
          backgroundImage:
            "url(https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Fgarden1.jfif?alt=media&token=e44d8a9c-192e-45fc-a427-956974c79724)",
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
  );
}

export default SignInSide;
