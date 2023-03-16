import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

export default function SignInSide() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { signUp, currentUser, logOut, signIn } = useAuthContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [upNotIn, setUpNotIn] = useState<boolean>(false);
  const loggingOut = pathname === "/logout";

  const handleValidateEmail = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.currentTarget.value;
    if (error !== "") {
      setError("");
    }
    if (value) {
      setEmailValid(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value));
    }
    console.log('emailcheck')
  };

  const handleValidatePassword = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.currentTarget.value;
    if (error !== "") {
      setError("");
    }
    if (value) {
      setPasswordValid(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)
      );
    }
  };

  // const handlePasswordMatch = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const value = event.currentTarget.value;
  //   if (value === data.get('password')) {
  //     setPasswordValidMatch(true)
  //   }
  // }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(upNotIn);
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const passwordRepeat = data.get("passwordRepeat") ?? null;
    setIsLoading(true);
    if (upNotIn) {
      if (password === passwordRepeat && email) {
        signUp(data.get("email") as string, data.get("password") as string)
          .then(() => {
            setSuccess("Successfully logged in!");
            setTimeout(() => {
              navigate(-1);
            }, 1000);
          })
          .catch((err) => {
            setError("Sign up credentials are not correct.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      if (email && password) {
        signIn(data.get("email") as string, data.get("password") as string)
          .then(() => {
            setSuccess("Successfully signed in!");
            console.log({ currentUser });
            setTimeout(() => {
              navigate(-1);
            }, 1000);
          })
          .catch((err) => {
            setError("Sign up credentials are not correct.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };

  // useEffect(() => {
  //   //password or email autocomplete on first load
  //   handleValidateEmail()
  //   handleValidatePassword()
  // }, [])

  return (
    <Grid 
      container 
      display="flex"                 
      sx={{ height: "calc(100vh - 8rem)" }}
    >
      <Grid 
        xs={0}
        md={1.5}
      >        
      </Grid>
      <Grid
        item              
        md={3.5}
        xs={12}
        container        
        alignSelf='center'
        sx={{
          my: 8,
          mx: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {currentUser && loggingOut ? (
          <Box>
            <Typography variant="h3">
              Are you sure you want to log out?
            </Typography>
            <Button onClick={logOut}>Log out</Button>
          </Box>
        ) : (
          <>
            <Grid item>
              <Typography component="h1" variant="h5">
                Sign {upNotIn ? "up" : "in"}
              </Typography>
            </Grid>
            <Grid item>
              <Box
                component="form"
                //noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField                
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  disabled={!!success}
                  onChange={handleValidateEmail}
                  error={emailValid === false}
                  color={emailValid? 'success' : 'primary'}               
                  helperText={
                    emailValid || emailValid == null
                      ? ""
                      : "Please enter a valid email address."
                  }
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  onChange={handleValidatePassword}
                  color={passwordValid? 'success' : 'primary'} 
                  error={passwordValid === false}
                  disabled={!!success}
                  helperText={
                    passwordValid || passwordValid == null
                      ? ""
                      : "Password must contain at least 8 chararcters including one uppercase and one lowercae letter and one number."
                  }
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                {upNotIn && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="passwordRepeat"
                    label="Repeat Password"
                    type="password"
                    id="passwordRepeat"
                    disabled={!!success}
                    autoComplete="off"
                  />
                )}
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Grid
                  item
                  container
                  xs={12}
                  display="flex"
                  alignContent="center"
                  flexDirection="column"
                >
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Button
                      type="submit"
                      variant="outlined"
                      disabled={isLoading || !!success || !emailValid || !passwordValid || (upNotIn && !passwordMatch)}
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign {upNotIn ? "up" : "in"}
                    </Button>
                  </Grid>
                  {error && (
                    <Grid item xs={12} display="flex" justifyContent="center">
                      <Alert severity="error">{error}</Alert>
                    </Grid>
                  )}
                  {success && (
                    <Grid item xs={12} display="flex" justifyContent="center">
                      <Alert severity="success">{success}</Alert>
                    </Grid>
                  )}
                </Grid>
                <Grid item container flexDirection='column' alignItems='center' xs={12} gap={2}>
                  <Grid item xs={12}>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  {!upNotIn && (
                    <Grid item xs={12}>
                      <Button onClick={() => setUpNotIn(true)}>
                        Don't have an account? Sign Up
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
      <Grid
        item               
        flexGrow='1'
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
  );
}
