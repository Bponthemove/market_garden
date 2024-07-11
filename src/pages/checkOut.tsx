import { DevTool } from "@hookform/devtools";
import {
  Box,
  Button,
  List,
  ListItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { BaseSyntheticEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { useOrderContext } from "../context/OrderContext";
//import { useDate } from "../hooks/useDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { CheckOutErrorModal } from "../components/checkOutErrorModal";
import { useDeliveryContext } from "../context/DeliveryContext";
import { useFirebase } from "../hooks/useFirebase";
import { IUpdateProduct } from "../types/allTypes";
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
export const max30charsMessage = "No more than 30 characters";

export const personDetailsSchema = z.object({
  email: z
    .string()
    .min(1, { message: fieldRequiredMessage })
    .email("Please enter a valid email"),
  phone: z.string().min(1, { message: fieldRequiredMessage }),
  // .max(11, "No more than 11 numbers in this field")
  // .regex(/^\d+$/, "numbers only, no spaces"),
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

const checkOutSchema = personDetailsSchema.extend({
  deliverySpace: z.string().max(30, { message: max30charsMessage }),
});

export type TCheckOut = z.infer<typeof checkOutSchema>;

export const CheckOut = () => {
  const { cartItems, cartTotal, discountInMoney } = useCartContext();
  const { currentUser, couponId } = useAuthContext();
  const { setOrderNr } = useOrderContext();
  const { updateDetails } = useDeliveryContext();
  const { updateProductStockLevel } = useFirebase();
  const theme = useTheme();

  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [serverError, setServerError] = useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // const navigate = useNavigate();

  const defaultValues = {
    firstName: currentUser?.userDetails[0]?.firstName ?? "",
    lastName: currentUser?.userDetails[0]?.lastName ?? "",
    email: currentUser?.user?.email ?? "",
    phone: currentUser?.userDetails[0]?.phone ?? "",
    postcode: currentUser?.userDetails[0]?.postcode ?? "",
    addressLine1: currentUser?.userDetails[0]?.addressLine1 ?? "",
    addressLine2: currentUser?.userDetails[0]?.addressLine2 ?? "",
    town: currentUser?.userDetails[0]?.town ?? "",
    deliverySpace: "No preference",
  };

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<TCheckOut>({
    defaultValues,
    resolver: zodResolver(checkOutSchema),
  });

  const errorArr = Object.keys(errors);
  const hasError = errorArr.length;

  const { mutateAsync } = useMutation((product: IUpdateProduct) =>
    updateProductStockLevel(product)
  );

  const handleOnSubmit = async (
    data: TCheckOut,
    event?: BaseSyntheticEvent<object, any, any>
  ) => {
    event?.preventDefault();
    const email = getValues("email");
    const {
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      town,
      postcode,
      deliverySpace,
    } = data;
    updateDetails({
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      town,
      postcode,
      email,
      deliverySpace,
    });

    // update stock levels
    cartItems.forEach((item) => mutateAsync(item));

    await fetch(".netlify/functions/stripePayCart", {
      method: "POST",
      body: JSON.stringify({
        shipping: cartTotal < 0,
        discountInMoney,
        couponId,
        email,
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    })
      .then((res) => res.json())
      .then(async (session) => {
        const stripe = await getStripe();

        // set order nr for return page
        setOrderNr(session.id);

        return await stripe?.redirectToCheckout({ sessionId: session.id });
      })
      .then((result) => {
        if (result?.error) {
          setOrderNr("");
          console.error(result.error);
        }
      })
      .catch((err) => {
        setOpenErrorModal(true);
        setServerError(err);
        console.error(err);
      });
    // ---- TEST ---- //
    // setOrderNr('dfsfgdsg87fgfd')
    // navigate("/afterstripe/success");
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
            <p>Your delivery date will be {nextDayDelivery()}</p>
          </Box>
        </Box>
        <Grid item xs={12}>
          <Typography variant="body2">
            Please let us know if you want us to leave the delivery in a special
            place.
          </Typography>
          <Controller
            name="deliverySpace"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                required
                fullWidth
                multiline
                label=""
                error={!!error}
                helperText={error?.message ?? ""}
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
          {hasError ? (
            <List>
              {errorArr.map((err, idx) => (
                <ListItem>
                  <Typography color="red">
                    {idx === 0
                      ? `You have an error with the ${err} field`
                      : ` and the ${err} field`}
                  </Typography>
                </ListItem>
              ))}
              <ListItem>
                <Typography color="red">
                  Please address th{errorArr.length === 1 ? "is" : "ese"} before
                  proceeding
                </Typography>
              </ListItem>
            </List>
          ) : (
            <></>
          )}
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
              gap: 4,
            }}
          >
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!!hasError}
            >
              Proceed to checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
      <DevTool control={control} />
      <CheckOutErrorModal
        setOpenErrorModal={setOpenErrorModal}
        openErrorModal={openErrorModal}
        serverError={serverError}
      />
    </>
  );
};
