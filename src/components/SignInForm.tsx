import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Grid, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { IUserDetails, useAuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useFirebase } from "../hooks/useFirebase";
import { useToast } from "../hooks/useToast";

const signInSchema = z.object({
  email: z.string().email().min(1, { message: "Field is required" }),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
      "At least 8 characters including a uppercase and a lowercase letter, a number and a special character."
    ),
});

export type TAuthSignIn = z.infer<typeof signInSchema>;

export default function SignInForm({ initial }: { initial: boolean }) {
  const navigate = useNavigate();
  const { getUserDetails, deleteThisUser } = useFirebase();
  const { signIn, loading, resetPassword } = useAuthContext();
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
    getValues,
    formState: {
      isValid,
      errors: { email: emailErrors },
      dirtyFields: { email: dirtyEmail },
    },
  } = useForm<TAuthSignIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
    reValidateMode: "onChange",
  });

  const handleOnSubmitInitialSignIn = async (values: TAuthSignIn) => {
    const email = values?.email;
    const password = values?.password;
    if (password && email) {
      try {
        await signIn(email as string, password as string);
        const user = auth.currentUser;
        const uid = user?.uid || "";
        setUid(uid);
      } catch (err) {
        console.error(`Error signing in : ${err}`);
        console.log(err);
        toast.error(`Error logging in : ${err.message}`);
      }
    }
  };

  const handleOnSubmitRequiresRecentLogin = async (values: TAuthSignIn) => {
    const response = await deleteThisUser(values);
    console.log(response);
  };

  const handlePasswordReset = () => {
    if (dirtyEmail && !emailErrors) {
      const myEmail = getValues("email");
      resetPassword(myEmail);
      toast.info(`Please check ${myEmail} for a reset link`);
    } else {
      toast.error("Please enter your valid email address");
    }
  };

  return (
    <Grid
      item
      container
      xs={12}
      md={6.5}
      gap={1}
      component="form"
      display="flex"
      justifyContent="center"
      onSubmit={handleSubmit(
        initial
          ? handleOnSubmitInitialSignIn
          : handleOnSubmitRequiresRecentLogin
      )}
    >
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
      <Grid item xs={8}>
        <Button
          color="primary"
          variant="outlined"
          onClick={handlePasswordReset}
        >
          Reset Password
        </Button>
      </Grid>
    </Grid>
  );
}
