import {
  Box,
  Button,
  Card,
  CardMedia,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ClosedNextDayModal } from "../components/closedModal";
import { outsideAreaPostcodes, postcodes } from "../constants/postcodes";

const rootMarginImg = "200px";

const Home = () => {
  const [postcode, setPostcode] = useState<string | undefined>();
  const [deliver, setDeliver] = useState<string>("");
  const image1Ref = useRef();
  const image2Ref = useRef();

  //const image1Load = useIsVisible(image1Ref, rootMarginImg);
  //const image2Load = useIsVisible(image2Ref, rootMarginImg);

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
    if (!postcode) {
      setDeliver("Please enter a postcode");
    } else {
      const firstHalf = postcode.slice(0, postcode.length === 7 ? 4 : 3);
      const weDeliver =
        outsideAreaPostcodes.includes(postcode) ||
        postcodes.indexOf(firstHalf) >= 0;
      if (weDeliver) {
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
    <>
      <ClosedNextDayModal />
      <Box width="100%" display="flex" justifyContent="center">
        <Box maxWidth="600px">
          <Box flex="1" py={4}>
            <Typography
              variant="body1"
              pt={1}
              sx={{
                textAlign: "justify",
                textJustify: "inter-word",
              }}
            >
              Established in 2022 by Tom and Tessa Green.
            </Typography>
          </Box>
          <Box>
            <Card sx={{ maxWidth: 600, m: 2 }}>
              <CardMedia
                component="video"
                controls
                src="https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FRound%20the%20Field%20June%202024%20PORTRAIT.MOV?alt=media&token=f09482e0-88a5-4622-ad00-3f8346bb379e"
                autoPlay
                muted
                playsInline
              />
            </Card>
          </Box>
          <Box flex="1" py={4}>
            <Typography
              variant="body1"
              pt={1}
              sx={{
                textAlign: "justify",
                textJustify: "inter-word",
              }}
            >
              Our market garden is hand worked, intensively planted, and
              ecologically focused. Our dedication is to growing life-giving
              food, building soil health, and offering food access for local
              people who want to eat the best they can get. Low food miles,
              grown in local soil by local people.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6063.jpg?alt=media&token=1ca1981a-3bf5-4a6a-8e9e-c1c04819fb33")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FIMG_6061.jpg?alt=media&token=850d13f4-c267-4a21-9bc8-710d3f701373")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6066.jpg?alt=media&token=d6fcbbe6-7a46-4f01-a284-597b2cc99b66")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6062.jpg?alt=media&token=8e25a4d6-e2e7-4ee0-b6aa-9ea6b4dc5392")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6067.jpg?alt=media&token=787d3f4c-a89c-4b98-8d3e-a840212abb04")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FIMG_6068.jpg?alt=media&token=96bd4271-edac-4033-837a-c7b00f4f0a7b")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6071.jpg?alt=media&token=f7a8e7f1-8e01-4a71-9dbc-deba3970cb05")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6065.jpg?alt=media&token=116401d2-b124-434d-9e73-f7fb24113cd3")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6064.jpg?alt=media&token=570637e6-150d-4d06-ab04-7f2ed870e4c5")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
          </Box>
          <Box flex="1" py={4}>
            <Typography
              variant="body1"
              pt={1}
              sx={{
                textAlign: "justify",
                textJustify: "inter-word",
              }}
            >
              We are a soil association accredited organic market garden. We
              never use chemical pesticides or synthetic fertilizers, and are
              committed to growing ethical, sustainable and healthy food. Our
              farm is based in Bucklebury, West Berkshire.
            </Typography>
          </Box>
          <Box flex="1" pb={4}>
            <Typography
              variant="body1"
              pt={1}
              sx={{
                textAlign: "justify",
                textJustify: "inter-word",
              }}
            >
              Our garden is truly human scale. We farm half an acre of garden
              without the use of a tractor, which means that everything we do
              takes a lot of thought and careful planning. 
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6060.jpg?alt=media&token=8cfa0a23-5890-4c23-b525-82b8dd6688dc")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6070.jpg?alt=media&token=242ea133-7b61-4590-ab77-13e1093f92b5")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Box
              ref={image1Ref}
              sx={{
                flex: "0 32%",
                height: "100px",
                marginBottom: "2%",
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fthumbnail_IMG_6069.jpg?alt=media&token=ad4386d0-09a9-4fc8-88a3-fa8cda3c4570")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
          </Box>
          <Box flex="1" py={4}>
            <Typography variant="h5" align="center">
              <b>
                <u>How it works</u>
              </b>
            </Typography>
            <Typography
              variant="body1"
              pt={1}
              sx={{
                textAlign: "justify",
                textJustify: "inter-word",
              }}
            >
              Just select the products from the shop to add to your crate,
              proceed to checkout and order before 4pm to receive next day
              delivery between 7am to 12pm - Monday to Saturday (excluding bank
              holidays).
            </Typography>
            <br />
            <Typography
              variant="body1"
              sx={{
                textAlign: "justify",
                textJustify: "inter-word",
              }}
            >
              {" "}
              Next day delivery! Check below to see if we deliver to your
              postcode. If you're a business and not in our postcode area,
              please
              <span>
                {" "}
                <Link href="/contact">contact us here</Link>
              </span>{" "}
              to arrange delivery.
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
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
