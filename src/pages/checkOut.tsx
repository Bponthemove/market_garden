import { DevTool } from "@hookform/devtools";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { BaseSyntheticEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { useOrderContext } from "../context/OrderContext";
//import { useDate } from "../hooks/useDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { z } from "zod";
import { useDeliveryContext } from "../context/DeliveryContext";
import { nextDayDelivery } from "../utils/nextDayDelivery";

let stripePromise: Stripe | null;

const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = await loadStripe(
      `${import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY!}`
    );
  }
  return stripePromise;
};

export const fieldRequiredMessage = "This field is required";

export const checkOutSchema = z.object({
  email: z
    .string()
    .min(1, { message: fieldRequiredMessage })
    .email("Please enter a valid email"),
  phone: z
    .string()
    .min(11, { message: fieldRequiredMessage })
    .max(11, "No more than 11 numbers in this field")
    .regex(/^\d+$/, "numbers only, no spaces"),
  firstName: z.string().min(1, { message: fieldRequiredMessage }),
  lastName: z.string().min(1, { message: fieldRequiredMessage }),
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

export type TCheckOut = z.infer<typeof checkOutSchema>;

export const CheckOut = () => {
  const { cartItems, cartTotal } = useCartContext();
  const { currentUser } = useAuthContext();
  const { setOrderNr } = useOrderContext();
  const { updateDetails } = useDeliveryContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const defaultValues = {
    firstName: currentUser?.userDetails[0]?.firstName ?? "",
    lastName: currentUser?.userDetails[0]?.lastName ?? "",
    email: currentUser?.user?.email ?? "",
    phone: currentUser?.userDetails[0]?.phone ?? "",
    postcode: currentUser?.userDetails[0]?.postcode ?? "",
    addressLine1: currentUser?.userDetails[0]?.addressLine1 ?? "",
    addressLine2: currentUser?.userDetails[0]?.addressLine2 ?? "",
    town: currentUser?.userDetails[0]?.town ?? "",
  };

  const { control, handleSubmit, getValues } = useForm<TCheckOut>({
    defaultValues,
    resolver: zodResolver(checkOutSchema),
  });

  const handleOnSubmit = async (
    data: TCheckOut,
    event?: BaseSyntheticEvent<object, any, any>
  ) => {
    event?.preventDefault();
    const email = getValues("email");
    updateDetails({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      town: data.town,
      postcode: data.postcode,
      email
    });
    await fetch(".netlify/functions/stripePayCart", {
      method: "POST",
      body: JSON.stringify({
        shipping: cartTotal > 25,
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          email,
        })),
      }),
    })
      .then((res) => res.json())
      .then(async (session) => {
        const stripe = await getStripe();
        setOrderNr(session.id);
        return await stripe?.redirectToCheckout({ sessionId: session.id });
      })
      .then((result) => {
        if (result?.error) {
          setOrderNr("");
          console.error(result.error);
        }
      });

    //succesful then add order to db
  };

  return (
    <>
      <Grid
        container
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
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Email Address"
                error={!!error}
                helperText={error?.message ?? ""}
                autoFocus
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
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
                helperText={
                  error?.message ?? "numbers only, no spaces 07***********"
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Last Name"
                error={!!error}
                helperText={error?.message ?? ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="postcode"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                fullWidth
                name="postcode"
                error={!!error}
                helperText={error?.message ?? ""}
                label="Postcode"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="addressLine1"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Address Line 1"
                error={!!error}
                helperText={error?.message ?? ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="addressLine2"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Address Line 2"
                error={!!error}
                helperText={error?.message ?? ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="town"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Town"
                error={!!error}
                helperText={error?.message ?? ""}
              />
            )}
          />
        </Grid>
        <Box display="flex" flexDirection={isMobile ? "column" : "row"}>
          <Box sx={{ flex: 3 }}>
            Order before 4pm for next day delivery. Deliveries are made between
            7am and 12pm.
            <p>Your delivery will be {nextDayDelivery()}</p>
          </Box>
        </Box>
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
    </>
  );
};
