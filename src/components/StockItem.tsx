import DoneIcon from "@mui/icons-material/Done";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useFirebase } from "../hooks/useFirebase";
import { useToast } from "../hooks/useToast";
import { IAddProduct, IUpdateProduct } from "../types/allTypes";

export default function StockItem({ product, refetch }) {
  const { updateProductStockLevel } = useFirebase();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<IAddProduct>({
    defaultValues: product,
    reValidateMode: "onBlur",
  });

  const { mutateAsync, isLoading, isError, isSuccess } = useMutation(
    (product: IUpdateProduct) => updateProductStockLevel(product)
  );

  const handleOnSubmit = async (product: IUpdateProduct) => {
    try {
      await mutateAsync(product);
      refetch();
    } catch (err) {
      toast.error(`Error updating stock: ${err.message}`);
    }
  };

  return (
    <Box
      key={product.id}
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
        <Typography variant="h6">{product.category}</Typography>
        <Typography variant="h5">{product.label}</Typography>
      </Box>
      <Box flex="1">
        <Controller
          name="stockLevel"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              // onBlur={handleOnBlur}
              required
              fullWidth
              type="number"
              label="Stock"
              error={!!fieldState.error?.message}
              helperText={fieldState.error?.message}
            />
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
