import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthContext } from "../context/AuthContext";
import { useFirebase } from "../hooks/useFirebase";
import { useToast } from "../hooks/useToast";
import { fieldRequiredMessage } from "./checkOut";

export const myDetailsSchema = z.object({
  phone: z
    .string()
    .min(11, { message: fieldRequiredMessage })
    .max(11, "No more than 11 numbers in this field")
    .regex(/^\d+$/, "numbers only, no spaces"),
  postcode: z
    .string()
    .regex(
      /^([A-Za-z]{2}[\d]{1,2}[A-Za-z]?)[\s]+([\d][A-Za-z]{2})$/,
      "invalid postcode"
    )
    .min(1, { message: fieldRequiredMessage }),
  addressLine1: z.string().min(1, { message: fieldRequiredMessage }),
  addressLine2: z.string().min(1, { message: fieldRequiredMessage }),
  town: z.string().min(1, { message: fieldRequiredMessage }),
});

type TMyDetails = z.infer<typeof myDetailsSchema>;

type TID = {
  uid: string;
};

export type TMyDetailsWithID = TMyDetails & TID;

export function MyDetails() {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const { updateUserDetails } = useFirebase();
  const toast = useToast();

  const details = currentUser?.userDetails[0];
  const name = (details.firstName || "") + " " + (details.lastName || "");
  const email = details.email;
  const id = details.uid;

  const { mutateAsync, isLoading, isError } = useMutation(
    (toUpdate: TMyDetailsWithID) => updateUserDetails(toUpdate)
  );

  const defaultValues = {
    phone: currentUser?.userDetails[0]?.phone ?? "",
    postcode: currentUser?.userDetails[0]?.postcode ?? "",
    addressLine1: currentUser?.userDetails[0]?.addressLine1 ?? "",
    addressLine2: currentUser?.userDetails[0]?.addressLine2 ?? "",
    town: currentUser?.userDetails[0]?.town ?? "",
  };

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<TMyDetails>({
    defaultValues,
    resolver: zodResolver(myDetailsSchema),
  });

  const handleOnSubmit = async (values) => {
    if (!isDirty) {
      navigate("/");
    } else {
      const toUpdate = {
        ...values,
        id,
      };
      try {
        await mutateAsync(toUpdate);
        toast.success(`You have successfully updated your details!`);
        window.location.reload();
      } catch (err) {
        console.error(err);
        toast.error(`Error siging up, please try again.`);
      }
    }
  };

  return (
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
          <Grid item xs={8} mt={2}>
            <Typography component="h1" variant="h5">
              Your Details
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>Email : {email}</Typography>
            <Typography>Name: {name}</Typography>
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
          <Box>
            {isDirty && (
              <Button type="submit" color="primary" variant="contained">
                Update your details
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      <DevTool control={control} />
    </>
  );
}
