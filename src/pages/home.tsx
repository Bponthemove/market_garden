import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ClosedNextDayModal } from "../components/closedModal";
import { postcodes, outsideAreaPostcodes } from "../constants/postcodes";
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
    
    if (!postcode) {
      setDeliver("Please enter a postcode");
    } else {
      const firstHalf = postcode.slice(0, postcode.length === 7 ? 4 : 3);
      const weDeliver = outsideAreaPostcodes.includes(postcode) || postcodes.indexOf(firstHalf) >= 0;
      if (weDeliver) {
        setDeliver("Great! We can deliver to your area!");
      } else {
        setDeliver("Sorry! We are not in your area yet. Check back soon!")
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
      <Box>
        <Box
          mb={6}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row-reverse" },
          }}
        >
          <Box flex="1" p={4}>
            <Typography variant="h5">
              <b>
                <u>About us</u>
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
              Tom and Tessa Green, founded Round the Field market garden in
              October 2022 where by following regenerative agriculture and
              holistic growing practices created a no dig garden to produce high
              quality and local fruit, vegetables and more. By forming no-dig
              beds and avoiding the act of tilling or turning the soil this in
              turn creates the perfect environment for good bacteria and
              mycorrhizal fungi. This grows healthier and tastier fruit,
              vegetables for your table and creates more biodiverse pasture
              where our poultry graze providing better quality and happier eggs
              and meat. We are currently in organic conversion with The Soil
              Association. No pesticides or herbicides are used in our market
              garden, our produce is 100% naturally grown. We aim to pick and
              deliver our produce as quickly as possible so you can benefit the
              most from the freshness! Almost all of our produce is picked
              within 12 hours of delivery.
            </Typography>
          </Box>
          <Box
            ref={image1Ref}
            flex="1"
            sx={{
              minHeight: { xs: "75vh", sm: "85vh" },
              width: "100%",
              backgroundImage: `url(${
                image1Load
                  ? "https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fcfc4bcc1-f300-4990-826e-705a845f2f5d.jpg?alt=media&token=2b2f0c03-d217-47be-ac40-c8fbe833a0d5"
                  : ""
              })`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />
        </Box>
        <Box
          mb={6}
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", sm: "row-reverse" },
            width: { xs: "100%" },
            height: "100%",
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
                  ? "https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FHolding%20radishes%20photo%20V.jpg?alt=media&token=63b02ffa-6d3a-447f-a88d-340111f30fc4"
                  : ""
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <Box flex="1" p={4}>
            <Typography variant="h5">
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
              proceed to checkout and order before 2pm to receive next day
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
            <br />
            <Typography variant="body1">Fresh, fast and for you!</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
