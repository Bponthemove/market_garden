import { DevTool } from "@hookform/devtools";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ProductTile from "../components/ProductTile";
import { categories } from "../constants/categories";
import { storage } from "../firebase";
import { useFirebase } from "../hooks/useFirebase";
import { useToast } from "../hooks/useToast";
import {
  IAddProduct,
  IGetProduct,
  IProduct,
  IUpdateProduct,
} from "../types/allTypes";

const defaultValues: IAddProduct = {
  category: "vegetables",
  label: "",
  description: "",
  stockLevel: 0,
  price: 0,
  eachOrWeigth: "",
  banner: "",
  image: "",
};

//Still need to add a patch request when updating;

export default function Products() {
  const [showProduct, setShowProduct] = useState<IProduct | IGetProduct>({
    id: "",
    ...defaultValues,
  });
  // State to store uploaded file
  const [file, setFile] = useState<any>("");
  // progress
  const [percent, setPercent] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [updateAddDelete, setUpdateAddDelete] = useState<
    "add" | "update" | "delete"
  >("add");
  const [category, setCategory] = useState<string>("vegetables");
  const [itemToUpdateOrDelete, setItemToUpdateOrDelete] = useState<
    IGetProduct | undefined
  >();
  const [query, setQuery] = useState("");

  const { control, handleSubmit, reset, formState, getValues } =
    useForm<IAddProduct>({
      defaultValues,
      reValidateMode: "onBlur",
    });

  const { addProduct, getProductsByCategory, deleteProduct, updateProduct } =
    useFirebase();
  const toast = useToast();

  const {
    data: getData,
    isLoading: isLoadingGet,
    isError: isErrorGet,
    refetch: refetchGet,
  } = useQuery([category], getProductsByCategory, {
    enabled: updateAddDelete !== "add",
  });

  const {
    mutateAsync: mutateAsyncAdd,
    isLoading: isLoadingMutateAdd,
    isError: isErrorMutateAdd,
  } = useMutation((product: IAddProduct) => addProduct(product));

  const {
    mutateAsync: mutateAsyncUpdate,
    isLoading: isLoadingMutateUpdate,
    isError: isErrorMutateUpdate,
  } = useMutation((product: IUpdateProduct) => updateProduct(product));

  const {
    mutateAsync: mutateAsyncDelete,
    isLoading: isLoadingMutateDelete,
    isError: isErrorMutateDelete,
  } = useMutation(({ id }: { id: string }) => deleteProduct(id));

  const isLoading =
    isLoadingMutateAdd || isLoadingMutateDelete || isLoadingMutateUpdate;
  const isError =
    isErrorMutateAdd || isErrorMutateDelete || isErrorMutateUpdate;

  const products = getData ?? [];

  function handleChangeImage(event: any) {
    setFile(event.currentTarget.files[0]);
  }

  const handleUpload = () => {
    if (!file) {
      alert("Please upload an image first!");
    }
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = ref(storage, "files/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); // update progress
        setPercent(percent);
        console.log("Upload is " + percent + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (err) => console.error(err),
      async () => {
        // download url
        console.log("completed");
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(url);
          setImageURL(url);
          setShowProduct((prevState) => ({
            ...prevState,
            image: url,
          }));
          //set field to dirty if it is not
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
    if (updateAddDelete === "update" && itemToUpdateOrDelete) {
      try {
        const dirtyFieldsWithValues = Object.keys(formState.dirtyFields).map(
          (fieldKey: any) => ({
            [fieldKey]: getValues(fieldKey),
          })
        );

        let toUpdate = { id: itemToUpdateOrDelete.id } as IUpdateProduct;

        dirtyFieldsWithValues.forEach(
          (value) =>
            (toUpdate = {
              ...toUpdate,
              ...value,
            })
        );

        if (imageURL)
          toUpdate = {
            ...toUpdate,
            image: imageURL,
          };

        await mutateAsyncUpdate(toUpdate);
        toast.info("Product succesfully updated.");
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await mutateAsyncAdd(product);
        toast.info("Product succesfully added.");
      } catch (err) {
        console.log(`Error adding product: ${err}`);
      }
    }
    reset(defaultValues);
    setImageURL("");
    setFile("");
    setQuery("");
    setShowProduct({
      id: "",
      ...defaultValues,
    });
    setItemToUpdateOrDelete(undefined);
    window.scrollTo(0, 0);
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
    value: "add" | "update" | "delete"
  ) => {
    if (!value) return;
    setUpdateAddDelete(value);
    setShowProduct({
      id: "",
      ...defaultValues,
    });
    setItemToUpdateOrDelete(undefined);
    reset({
      ...defaultValues,
      image: "",
    });
  };

  const handleDeleteItem = async () => {
    if (!itemToUpdateOrDelete) {
      return;
    } else {
      try {
        const response = await mutateAsyncDelete(itemToUpdateOrDelete);
        console.log(response);
        setItemToUpdateOrDelete(undefined);
        reset(defaultValues);
        setImageURL("");
        setFile("");
        setQuery("");
        setShowProduct({
          id: "",
          ...defaultValues,
        });
        window.scrollTo(0, 0);
        toast.info("Product successfully deleted.");
        refetchGet();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return isError ? (
    <Typography variant="subtitle1">{`Error query ${updateAddDelete}`}</Typography>
  ) : isErrorGet ? (
    <Typography variant="subtitle1">Error loading products</Typography>
  ) : isLoadingGet && updateAddDelete !== "add" ? (
    <CircularProgress />
  ) : (
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
            value={updateAddDelete}
            exclusive
            onChange={handleChangeToggle}
            aria-label="Platform"
          >
            <ToggleButton value="update">Update</ToggleButton>
            <ToggleButton value="add">Add</ToggleButton>
            <ToggleButton value="delete">Delete</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        {updateAddDelete !== "add" && (
          <>
            <Grid item alignSelf="stretch">
              <Select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(({ cat, label }) => (
                  <MenuItem value={cat}>{label}</MenuItem>
                ))}
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
                onClick={() => {
                  console.log({ products });
                  const productFound = products.find(
                    (p) => p.label.toLowerCase() === query
                  );
                  if (productFound) {
                    setItemToUpdateOrDelete(productFound);
                    setShowProduct(productFound);
                    const productNoImage = {
                      ...productFound,
                      image: "",
                    };
                    reset(productNoImage);
                  }
                }}
              >
                {updateAddDelete}
              </Button>
              <Button
                disabled={!query}
                onClick={() => {
                  setItemToUpdateOrDelete(undefined);
                  setQuery("");
                  reset(defaultValues);
                }}
              >
                Clear
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      <Divider flexItem sx={{ margin: "2rem 0" }} />

      {updateAddDelete === "delete" ? (
        <Grid
          item
          container
          mt={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
            <Button
              color="primary"
              variant="contained"
              disabled={!itemToUpdateOrDelete}
              onClick={handleDeleteItem}
            >
              Delete Product
            </Button>
          </Box>
        </Grid>
      ) : (updateAddDelete === "update" && itemToUpdateOrDelete) ||
        updateAddDelete === "add" ? (
        <>
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
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error?.message}>
                      <InputLabel id="area-label">Category</InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        label="Category"
                        required
                        onBlur={handleOnBlur}
                      >
                        {categories.map(({ cat, label }) => (
                          <MenuItem value={cat}>{label}</MenuItem>
                        ))}
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
                  name="stockLevel"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      onBlur={handleOnBlur}
                      required
                      fullWidth
                      type="number"
                      label="Stock Level"
                      error={!!fieldState.error?.message}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item mt={2}>
                <Controller
                  control={control}
                  name="banner"
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error?.message}>
                      <FormLabel id="demo-radio-buttons-group-label">
                        Banner
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="radio-buttons-group-banner"
                        name="banner"
                      >
                        <FormControlLabel
                          value="isOffer"
                          control={<Radio />}
                          label="Is On Offer"
                        />
                        <FormControlLabel
                          value="stillGrowing"
                          control={<Radio />}
                          label="Still Growing"
                        />
                        <FormControlLabel
                          value="soldOut"
                          control={<Radio />}
                          label="Sold Out"
                        />
                        <FormControlLabel
                          value="comingSoon"
                          control={<Radio />}
                          label="Coming Soon"
                        />
                        <FormControlLabel
                          value="sellingFast"
                          control={<Radio />}
                          label="Selling Fast"
                        />
                        <FormControlLabel
                          value="popular"
                          control={<Radio />}
                          label="Popular"
                        />
                        <FormControlLabel
                          value="inSeason"
                          control={<Radio />}
                          label="In Season"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Divider
              flexItem
              sx={{ margin: "0 2rem" }}
              orientation="vertical"
            />
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
                  render={({ field }) => (
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
                <ProductTile product={showProduct} idx={0} />
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
                  disabled={
                    (updateAddDelete === "add" && !imageURL) || isLoading
                  }
                >
                  {updateAddDelete === "add"
                    ? "Add Product"
                    : updateAddDelete === "update"
                    ? "Update Product"
                    : ""}
                </Button>
              </Box>
            </Grid>
          </Grid>
          <DevTool control={control} />
        </>
      ) : null}
    </Grid>
  );
}
