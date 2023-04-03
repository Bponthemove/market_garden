import { BaseSyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { IUserDetails } from "../context/AuthContext";
import getStripe from "../stripe";
import Grid from "@mui/material/Grid";
import { Typography, TextField, Box, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { auth } from "../firebase";
import { useQuery } from "@tanstack/react-query";
import { useFirebase } from "../hooks/useFirebase";
import { DevTool } from "@hookform/devtools";
import { PaymentElement } from "@stripe/react-stripe-js";

const stripePromise = getStripe();

interface ICheckOut {
  firstName: string;
  lastName: string;
  email: string;
  postcode: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
}

// let defaultValues = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   postcode: "",
//   addressLine1: "",
//   addressLine2: "",
//   town: "",
// };

export const CheckOut = () => {
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null);
  const [defaultValues, setDefaultValues] = useState<ICheckOut>({
    firstName: "",
    lastName: "",
    email: "",
    postcode: "",
    addressLine1: "",
    addressLine2: "",
    town: "",
  });
  const { cartQuantity, cartTotal } = useCartContext();
  const { getUserDetails } = useFirebase();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const uid = user?.uid;

  const { isLoading, error } = useQuery<IUserDetails[] | undefined>(
    ["uid", uid],
    getUserDetails,
    {
      enabled: !!uid,
      onSuccess: (data) => {
        console.log({ data });
        const [
          { firstName, lastName, postcode, addressLine1, addressLine2, town },
        ] = data || [];
        setDefaultValues({
          firstName,
          lastName,
          email: user?.email ?? "",
          postcode,
          addressLine1,
          addressLine2,
          town,
        });
      },
    }
  );

  console.log({ user, stripePromise });

  const { control, handleSubmit, getValues } = useForm<ICheckOut>({
    defaultValues,
    reValidateMode: "onBlur",
  });

  const handleOnSubmit = async (
    data: ICheckOut,
    event?: BaseSyntheticEvent<object, any, any>
  ) => {
    event?.preventDefault();
    console.log({data})
    if (!stripePromise) {
      return;
    }
    console.log({stripePromise})
    const sessions = await stripePromise;
    console.log({sessions})
    // const response = sessions?.redirectToCheckout({
    //     line_items: [{ price: cartTotal.toFixed(2), quantity: 1 }],
    //     mode: "payment",
    //     customer_email: getValues("email"),
    // })
  };

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

  return (
    <Grid container xs={8}>
      <Grid
        item
        container
        xs={12}
        gap={1}
        component="form"
        display="flex"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            Deliver to
          </Typography>
        </Grid>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <Controller
            name="postcode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                name="postcode"
                onBlur={handleValidatePostcode}
                color={postcodeValid ? "success" : "primary"}
                error={postcodeValid === false}
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
          container
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
            <Button type="submit" color="primary" variant="contained">
              Proceed to checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
      <DevTool control={control} />
    </Grid>
  );
};
