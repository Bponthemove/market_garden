import { BaseSyntheticEvent, useState } from "react";
import { useCartContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import Grid from "@mui/material/Grid";
import {
  Typography,
  TextField,
  Box,
  Button,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import getStripe from "../stripe";
import { useOrderContext } from "../context/OrderContext";
import { useDate } from "../hooks/useDate";

interface ICheckOut {
  firstName: string;
  lastName: string;
  email: string;
  postcode: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
  deliveryDay: string;
}; 

export const CheckOut = () => {
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null);
  const { cartItems } = useCartContext();
  const { currentUser } = useAuthContext();
  const { setOrderNr, setDeliveryDay } = useOrderContext();
  const { saturday, sunday, monday} = useDate('checkOut');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const defaultValues = {
    firstName: currentUser.userDetails[0].firstName ?? "",
    lastName: currentUser.userDetails[0].lastName ?? "",
    email: currentUser.user?.email ?? "",
    postcode: currentUser.userDetails[0].postcode ?? "",
    addressLine1: currentUser.userDetails[0].addressLine1 ?? "",
    addressLine2: currentUser.userDetails[0].addressLine2 ?? "",
    town: currentUser.userDetails[0].town ?? "",
    deliveryDay: "",
  };

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<ICheckOut>({
    defaultValues,
    reValidateMode: "onChange",
  });

  const handleOnSubmit = async (
    data: ICheckOut,
    event?: BaseSyntheticEvent<object, any, any>
  ) => {
    event?.preventDefault();
    const email = getValues("email");
    const deliveryDay = getValues("deliveryDay");
    console.log({deliveryDay})
    console.log({email})
    await fetch(".netlify/functions/stripePayCart", {
      method: "POST",
      body: JSON.stringify({
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
        setDeliveryDay(deliveryDay);
        return await stripe?.redirectToCheckout({ sessionId: session.id });
      })
      .then((result) => {
        if (result?.error) {
          setOrderNr("");
          console.log(result?.error);
        }
      });

    //succesful then add order to db
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
    <Grid container>
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
            render={({ field }) => (
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
        <Box display="flex" flexDirection={isMobile ? "column" : "row"}>
          <Box sx={{ flex: 3 }}>
            You can order for tomorrow. Cut off time is 4pm. We wil deliver the next day between 7am and 12pm.
          </Box>
          {/* <Box sx={{ flex: 1 }}>
            <Controller
              name="deliveryDay"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  required
                  fullWidth
                  label="Delivery Day"
                  error={!!fieldState.error?.message}
                >
                  <MenuItem value={saturday as unknown as string}>{`Saturday ${saturday}`}</MenuItem>
                  <MenuItem value={sunday as unknown as string}>{`Sunday ${sunday}`}</MenuItem>
                  <MenuItem value={monday as unknown as string}>{`Monday ${monday}`}</MenuItem>
                </Select>
              )}
            />
          </Box> */}
        </Box>
        <Grid
          item
          xs={12}
          container
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!isValid}
            >
              Proceed to checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
      <DevTool control={control} />
    </Grid>
  );
};
