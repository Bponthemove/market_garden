import DoneIcon from "@mui/icons-material/Done";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { discountsAsArray } from "../constants/discounts";
import { useFirebase } from "../hooks/useFirebase";
import { useToast } from "../hooks/useToast";
import { TMyDetailsWithIDAndCouponId } from "../pages/myDetails";

export default function User({ user, refetch: refetchAllUSers }) {
  const { updateUserDetails } = useFirebase();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<TMyDetailsWithIDAndCouponId>({
    defaultValues: user,
    reValidateMode: "onSubmit",
  });

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    (user: TMyDetailsWithIDAndCouponId) => updateUserDetails(user)
  );

  const handleOnSubmit = async (user: TMyDetailsWithIDAndCouponId) => {
    try {
      await mutateAsync(user);
      refetchAllUSers();
    } catch (err) {
      toast.error(`Error updating user: ${err.message}`);
    }
  };

  return (
    <Box
      key={user.id}
      component="form"
      onSubmit={handleSubmit(handleOnSubmit)}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      columnGap={2}
      mb={2}
      pb={2}
      sx={{ borderBottom: "2px solid black" }}
    >
      <Box flex="2">
        <Typography variant="body1">{user.firstName}</Typography>
        <Typography variant="body1">{user.lastName}</Typography>
      </Box>
      <Box flex="1">
        <Controller
          name="couponId"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              required
              fullWidth
              label="Discount"
              error={!!fieldState.error?.message}
            >
              {" "}
              {discountsAsArray.map(({ id, value }) => (
                <MenuItem key={id} value={id}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Box>
      <Box flex="1">
        <Button
          variant="contained"
          disabled={!isDirty}
          type="submit"
          color={isError ? "error" : "primary"}
        >
          {isLoading ? (
            <CircularProgress />
          ) : isError ? (
            <PriorityHighIcon />
          ) : isSuccess ? (
            <DoneIcon />
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </Box>
  );
}
