import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Input from "@mui/material/Input";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProductTile from "../components/ProductTile";
import { IProduct, IAddProduct, IGetProduct } from "../types/allTypes";
import { storage } from "../firebase";
import { useFirebase } from "../hooks/useFirebase";
import Autocomplete from "@mui/material/Autocomplete";
import { useMutation, useQuery } from "@tanstack/react-query";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";

const defaultValues: IAddProduct = {
  category: "vegetables",
  label: "",
  description: "",
  price: 0,
  eachOrWeigth: "",
  isOffer: false,
  stillGrowing: false,
  soldOut: false,
  inSeason: false,
  sellingFast: false,
  popular: false,
  comingSoon: false,
  image: "",
};

//Still need to add a patch request when updating;

export default function Admin() {
  const [showProduct, setShowProduct] = useState<IProduct>({
    id: "",
    ...defaultValues,
  });
  // State to store uploaded file
  const [file, setFile] = useState<any>("");
  // progress
  const [percent, setPercent] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [updateAdd, setUpdateAdd] = useState<"add" | "update">("add");
  const [category, setCategory] = useState<string>("vegetables");
  const [itemToUpdate, setItemToUpdate] = useState<IGetProduct | undefined>();
  const [query, setQuery] = useState("");

  const { control, handleSubmit, reset } = useForm<IAddProduct>({
    defaultValues,
    reValidateMode: "onBlur",
  });

  const { addProduct, getProducts } = useFirebase();

  const {
    data: getData,
    isLoading: isLoadingGet,
    isError: isErrorGet,
  } = useQuery([category], getProducts, {
    enabled: updateAdd === "update",
  });

  const { 
    mutateAsync, 
    isLoading: isLoadingMutate, 
    isError: isErrorMutate
  } = useMutation((product: IAddProduct) => addProduct(product));
  // Handle file upload event and update state

  const products = getData ?? [];

  function handleChangeImage(event: any) {
    setFile(event.currentTarget.files[0]);
  }

  const handleUpload = () => {
    if (!file) {
      alert("Please upload an image first!");
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      async () => {
        // download url
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setImageURL(url);
          setShowProduct((prevState) => ({
            ...prevState,
            image: url,
          }));
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const handleOnSubmit = async (values: IAddProduct) => {
    console.log({ values });
    const product = {
      ...values,
      image: imageURL,
    };
    try {
      const data = await mutateAsync(product)
      console.log({ data });
      //add product to stripe
      reset();
      setImageURL("");
      setFile("");
      setShowProduct({
        id: "",
        ...defaultValues,
      });
    } catch (err) {
      console.log(`Error adding product: ${err}`)
    }
  };

  const handleOnBlur = (event: { preventDefault: () => void; target: any }) => {
    event.preventDefault();
    console.log(event);
    let value;
    if (
      ["price", "description", "label", "category", "eachOrWeigth"].includes(
        event.target.name
      )
    ) {
      value = event.target.value;
    } else {
      value = event.target.checked;
    }
    const key = event.target.name;
    const valueToUpdate = {
      [key]: value,
    };

    setShowProduct((prevState) => ({
      ...prevState,
      ...valueToUpdate,
    }));
  };

  const handleChangeToggle = (
    event: React.MouseEvent<HTMLElement>,
    value: "add" | "update"
  ) => {
    setUpdateAdd(value);
    reset();
    setImageURL("");
    setFile("");
    setShowProduct({
      id: "",
      ...defaultValues,
    });
  };

  useEffect(() => {
    if (itemToUpdate) {
      reset({
        ...itemToUpdate,
        image: "",
      });
    }
  }, [itemToUpdate]);

  return (
    <Grid
      container
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Grid
        item
        container
        display="flex"
        flexDirection="column"
        //alignContent="center"
        alignItems="stretch"
        gap={2}
        xs={6}
        md={4}
      >
        <Grid item>
          <ToggleButtonGroup
            color="primary"
            value={updateAdd}
            exclusive
            onChange={handleChangeToggle}
            aria-label="Platform"
          >
            <ToggleButton value="update">Update</ToggleButton>
            <ToggleButton value="add">Add</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        {updateAdd === "update" && (
          <>
            <Grid item alignSelf="stretch">
              <Select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="herbs">Herbs</MenuItem>
                <MenuItem value="vegetables">Vegetables</MenuItem>
              </Select>
            </Grid>
            <Grid item>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => option.label}
                filterOptions={(options) =>
                  options.filter((opt) =>
                    opt.label.toLowerCase().includes(query)
                  )
                }
                onInputChange={(event, value) => setQuery(value.toLowerCase())}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search products"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
              />
              <Button
                disabled={!query}
                onClick={() =>
                  setItemToUpdate(
                    products.find((p) => p.label.toLowerCase() === query)
                  )
                }
              >
                Update
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      <Divider flexItem sx={{ margin: "2rem 0" }} />

      <Grid
        item
        container
        gap={1}
        component="form"
        display="flex"
        justifyContent="center"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <Grid
          item
          container
          display="flex"
          flexDirection="column"
          xs={12}
          md={6}
        >
          <Grid item>
            <Controller
              control={control}
              name="category"
              render={({ field, formState, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error?.message}>
                  <InputLabel id="area-label">Category</InputLabel>
                  <Select
                    {...field}
                    fullWidth
                    label="Category"
                    required
                    onBlur={handleOnBlur}
                  >
                    <MenuItem value="herbs">Herbs</MenuItem>
                    <MenuItem value="vegetables">Vegetables</MenuItem>
                    {/* <MenuItem value="fruit">Fruit</MenuItem>
                  <MenuItem value="mushrooms">Mushrooms</MenuItem>
                  <MenuItem value="cheese">Cheese</MenuItem> */}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item mt={2}>
            <Controller
              name="label"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  onBlur={handleOnBlur}
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
          <Grid item mt={2}>
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  onBlur={handleOnBlur}
                  required
                  fullWidth
                  type="number"
                  label="Price"
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item mt={2}>
            <Controller
              name="eachOrWeigth"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  onBlur={handleOnBlur}
                  required
                  fullWidth
                  type="text"
                  label="Each or Weigth"
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item mt={2}>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  onBlur={handleOnBlur}
                  required
                  fullWidth
                  type="text"
                  label="Description"
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item mt={2}>
            <Controller
              control={control}
              name="isOffer"
              render={({
                field: { onChange, value },
                formState,
                fieldState,
              }) => (
                <FormControl fullWidth error={!!fieldState.error?.message}>
                  <InputLabel shrink={false} id="area-label">
                    Is offer?
                  </InputLabel>
                  <Checkbox
                    onBlur={handleOnBlur}
                    onChange={onChange}
                    checked={value}
                    name="isOffer"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="stillGrowing"
              render={({
                field: { onChange, value },
                formState,
                fieldState,
              }) => (
                <FormControl fullWidth error={!!fieldState.error?.message}>
                  <InputLabel shrink={false} id="area-label">
                    Still growing?
                  </InputLabel>
                  <Checkbox
                    onBlur={handleOnBlur}
                    onChange={onChange}
                    checked={value}
                    name="stillGrowing"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="soldOut"
              render={({
                field: { onChange, value },
                formState,
                fieldState,
              }) => (
                <FormControl fullWidth error={!!fieldState.error?.message}>
                  <InputLabel shrink={false} id="area-label">
                    Sold out?
                  </InputLabel>
                  <Checkbox
                    onBlur={handleOnBlur}
                    onChange={onChange}
                    checked={value}
                    name="soldOut"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="inSeason"
              render={({
                field: { onChange, value },
                formState,
                fieldState,
              }) => (
                <FormControl fullWidth error={!!fieldState.error?.message}>
                  <InputLabel shrink={false} id="area-label">
                    In season?
                  </InputLabel>
                  <Checkbox
                    onBlur={handleOnBlur}
                    onChange={onChange}
                    checked={value}
                    name="inSeason"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="sellingFast"
              render={({
                field: { onChange, value },
                formState,
                fieldState,
              }) => (
                <FormControl fullWidth error={!!fieldState.error?.message}>
                  <InputLabel shrink={false} id="area-label">
                    Selling fast?
                  </InputLabel>
                  <Checkbox
                    onBlur={handleOnBlur}
                    onChange={onChange}
                    checked={value}
                    name="sellingFast"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="popular"
              render={({
                field: { onChange, value },
                formState,
                fieldState,
              }) => (
                <FormControl fullWidth error={!!fieldState.error?.message}>
                  <InputLabel shrink={false} id="area-label">
                    Popular?
                  </InputLabel>
                  <Checkbox
                    onBlur={handleOnBlur}
                    onChange={onChange}
                    checked={value}
                    name="popular"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="comingSoon"
              render={({
                field: { onChange, value },
                formState,
                fieldState,
              }) => (
                <FormControl fullWidth error={!!fieldState.error?.message}>
                  <InputLabel shrink={false} id="area-label">
                    Coming soon?
                  </InputLabel>
                  <Checkbox
                    onBlur={handleOnBlur}
                    onChange={onChange}
                    checked={value}
                    name="comingSoon"
                    sx={{ "&:hover": { backgroundColor: "transparent" } }}
                  />
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
        <Divider flexItem sx={{ margin: "0 2rem" }} orientation="vertical" />
        <Grid
          item
          container
          display="flex"
          flexDirection="column"
          md={5}
          gap={6}
        >
          <Grid item mt={2}>
            <Controller
              name="image"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  onChange={handleChangeImage}
                  fullWidth
                  type="file"
                  //error={!imageURL}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={handleUpload}
              disabled={!file}
            >
              Upload image
            </Button>
          </Grid>
          <Grid item>
            <ProductTile product={showProduct} />
          </Grid>
        </Grid>
        <Grid
          item
          container
          mt={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!imageURL}
            >
              Add Product
            </Button>
          </Box>
        </Grid>
      </Grid>

      <DevTool control={control} />
    </Grid>
  );
}
