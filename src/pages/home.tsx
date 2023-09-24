import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { postcodes } from "../constants/postcodes";
import { useIsVisible } from "../hooks/useIsVisible";

const rootMarginImg = "200px";

const Home = () => {
  const [postcode, setPostcode] = useState<string | undefined>();
  const [deliver, setDeliver] = useState<string>("");
  const image1Ref = useRef();
  const image2Ref = useRef();

  const image1Load = useIsVisible(image1Ref, rootMarginImg);
  const image2Load = useIsVisible(image2Ref, rootMarginImg);

  const handleValidatePostcode = (event: {
    preventDefault: () => void;
    target: { value: string };
  }) => {
    event.preventDefault();
    const value = event.target.value;
    if (/^([A-Za-z]{2}[\d]{1,2}[A-Za-z]?)[\s]+([\d][A-Za-z]{2})$/.test(value)) {
      setPostcode(value.replace(/ /g, "").toLowerCase());
    } else {
      if (!value) {
        setPostcode(undefined);
      } else {
        setPostcode("");
      }
    }
  };

  const handleCheckPostcode = () => {
    if (postcode) {
      if (postcodes.indexOf(postcode) >= 0) {
        setDeliver("Great! We can deliver to your area!");
      } else {
        setDeliver("Sorry! We are not in your area yet. Check back soon!");
      }
    }
  };

  useEffect(() => {
    if (!postcode && deliver) {
      setDeliver("");
    }
  }, [deliver, postcode]);

  return (
    <Box>
      <Box
        mb={6}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box flex="1" p={4}>
          <Typography variant="h5">About us</Typography>
          <Typography variant="body2" pt={1}>
            Tom and Tessa Green, founded Round the Field market garden in
            October 2022 where by following regenerative agriculture and
            holistic growing practices created a no dig garden to produce high
            quality, local tasty fruit and veg. But forming no-dig beds and
            avoiding the act of tilling or turning the soil this creates an
            amazing environment for good bacteria and mycorrhizal fungi; this in
            turn created healthier fruit and veg for your table. Packed full of
            nutrients and vitamins we aim to deliver our produce to you as
            quickly as possible so you can benefit the most from the freshness!
            We are working towards our organic accreditation with The Soil
            Association. Currently unofficially organic. No pesticides or
            herbicides are used on our market garden.
          </Typography>
        </Box>
        <Box
          ref={image1Ref}
          flex="1"
          sx={{
            minHeight: { xs: "75vh", sm: "60vh" },
            width: "100%",
            alignSelf: { xs: "center", sm: "stretch" },
            backgroundImage: `url(${
              image1Load
                ? "https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fcfc4bcc1-f300-4990-826e-705a845f2f5d.jpg?alt=media&token=2b2f0c03-d217-47be-ac40-c8fbe833a0d5"
                : ""
            })`,
            backgroundPosition: { xs: "center", sm: "right" },
            backgroundRepeat: "no-repeat",
          }}
        />
      </Box>
      <Box
        mb={6}
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", sm: "row" },
          width: { xs: "100%" },
        }}
      >
        <Box
          ref={image2Ref}
          flex="1"
          sx={{
            minHeight: { xs: "50vh", sm: "60vh" },
            width: "100%",
            alignSelf: { xs: "center", sm: "stretch" },
            backgroundImage: `url(${
              image2Load
                ? "https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FIMG_0086.jpg?alt=media&token=65e9b4e3-d609-43f3-919e-c2a41a311e17"
                : ""
            })`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
        <Box flex="1" p={4}>
          <Typography variant="h5">How it works</Typography>
          <Typography variant="body2" pt={1}>
            Our subscription seasonal veg boxes are coming soon but in the
            meantime just select the produce you like to add to your crate,
            proceed to checkout and order before 4pm to receive next day deliver
            between 7am to 12pm.
          </Typography>
          <br />
          <Typography variant="body2">
            {" "}
            We deliver mainly in West-Berkshire. Check here if we deliver to
            your postcode.
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <TextField
              variant="standard"
              onChange={handleValidatePostcode}
              error={postcode === ""}
              helperText={
                postcode || postcode === undefined
                  ? ""
                  : "Please enter a valid postcode, including spaces. "
              }
              label="Postcode"
              type="text"
              sx={({ palette: { primary } }) => ({
                "& .MuiInputLabel-root": { color: primary.main },
                "& .MuiInputLabel-root.Mui-focused": { color: primary.main },
                borderBottom: `1px solid ${primary.main}`,
              })}
              InputProps={{ disableUnderline: true }}
            />
            {postcode && (
              <Button
                variant="outlined"
                onClick={handleCheckPostcode}
                sx={{ border: "none" }}
              >
                Check
              </Button>
            )}
          </Box>
          <br />
          <Typography variant="body1">{deliver}</Typography>
          <br />
          <Typography variant="body2">
            We grow all our own produce in the heart of West-Berkshire, in the
            beautiful village of Bucklebury.
          </Typography>
          <br />
          <Typography variant="body2">
            Personal, fast and reliable, we deliver our own products to you.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
