import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type IAddProduct = {
  category: string;
  label: string;
  description: string;
  isOffer: boolean;
  stillGrowing: boolean;
  soldOut: boolean;
  inSeason: boolean;
  sellingFast: boolean;
  popular: boolean;
  comingSoon: boolean;
};

// id: 1,
//     category: 'vegetable',
//     dataKey: 'pepperRed',
//     label: 'Pepper Red',
//     description: 'blablabla',
//     price: 0.80,
//     isOffer: false,
//     perItem: true,
//     image: pepperRed,

const defaultValues: IAddProduct = {
  category: "",
  label: "",
  description: "",
  isOffer: false,
  stillGrowing: false,
  soldOut: false,
  inSeason: false,
  sellingFast: false,
  popular: false,
  comingSoon: false,
};

export default function Admin() {
  const { control, handleSubmit } = useForm<IAddProduct>({
    defaultValues,
    reValidateMode: "onBlur",
  });

  const handleOnSubmit = (values: IAddProduct) => {
    console.log({ values });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid container display="flex" flexDirection="column" xs={12}>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="category"
            render={({ field, formState, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error?.message}>
                <InputLabel id="area-label">Category</InputLabel>
                <Select {...field} fullWidth label="Category" required>
                  <MenuItem value="herbs">Herbs</MenuItem>
                  <MenuItem value="vegetables">Vegetables</MenuItem>
                  <MenuItem value="fruit">Fruit</MenuItem>
                  <MenuItem value="mushrooms">Mushrooms</MenuItem>
                  <MenuItem value="cheese">Cheese</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="label"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                type="text"
                label="Label"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                type="text"
                label="description"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="isOffer"
            render={({ field: { onChange, value }, formState, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error?.message}>
                <InputLabel shrink={false} id="area-label">Is offer?</InputLabel>
                <Checkbox onChange={onChange} checked={value}  />
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="stillGrowing"
            render={({ field: { onChange, value }, formState, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error?.message}>
                <InputLabel shrink={false} id="area-label">Still growing?</InputLabel>
                <Checkbox onChange={onChange} checked={value}  />
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="soldOut"
            render={({ field: { onChange, value }, formState, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error?.message}>
                <InputLabel shrink={false} id="area-label">Sold out?</InputLabel>
                <Checkbox onChange={onChange} checked={value}  />
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="inSeason"
            render={({ field: { onChange, value }, formState, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error?.message}>
                <InputLabel shrink={false} id="area-label">In season?</InputLabel>
                <Checkbox
                  onChange={onChange}
                  checked={value}
                  
                  sx={{ "&:hover": { backgroundColor: "transparent" } }}
                />
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="sellingFast"
            render={({ field: { onChange, value }, formState, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error?.message}>
                <InputLabel shrink={false} id="area-label">Selling fast?</InputLabel>
                <Checkbox onChange={onChange} checked={value} />
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="popular"
            render={({ field: { onChange, value }, formState, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error?.message}>
                <InputLabel shrink={false} id="area-label">Popular?</InputLabel>
                <Checkbox onChange={onChange} checked={value} />
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="comingSoon"
            render={({ field: { onChange, value }, formState, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error?.message}>
                <InputLabel shrink={false} id="area-label">Coming soon?</InputLabel>
                <Checkbox onChange={onChange} checked={value} />
              </FormControl>
            )}
          />
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
          <Button type="submit" color="primary" variant="contained">
            Add Product
          </Button>
        </Box>
      </Grid>
    </Box>
  );
}
