import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { IUserDetails, useAuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useFirebase } from "../hooks/useFirebase";
import { useToast } from "../hooks/useToast";

const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(
      new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
      "Password should be a minumum of 8 characters and consist of at least one Uppercase, one Lowercase and one number"
    ),
});

type TAuthSignIn = z.infer<typeof signInSchema>;

function SignInSide() {
  const navigate = useNavigate();
  const { getUserDetails } = useFirebase();
  const { signIn, loading, error, setError } = useAuthContext();
  const toast = useToast();
  const [uid, setUid] = useState<string>("");

  useQuery<IUserDetails[] | undefined>(["uid", uid], getUserDetails, {
    enabled: !!uid,
    onSuccess: (data) => {
      const user = data || [];
      toast.success(
        `Hi ${user[0]?.firstName}, you have successfully logged in!`
      );
      navigate("/");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<TAuthSignIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
    reValidateMode: "onChange",
  });

  const handleOnSubmit = async (values: TAuthSignIn) => {
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

  console.log({ isValid });

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error, toast, setError]);

  return (
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
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                fullWidth
                type="email"
                label="Email Address"
                name="email"
                disabled={loading}
                error={!!error}
                helperText={error?.message ?? ""}
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
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                fullWidth
                name="password"
                error={!!error}
                disabled={loading}
                helperText={error?.message ?? ""}
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
            disabled={!isValid}
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
