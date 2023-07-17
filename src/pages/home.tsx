import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { postcodes } from "../constants/postcodes";

const Home = () => {
  const [postcode, setPostcode] = useState<string | undefined>();
  const [deliver, setDeliver] = useState<string>("");

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
        setDeliver("Yes, we deliver to your address!");
      } else {
        setDeliver("No, really sorry but we do not deliver to your address");
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
          flexDirection: { xs: "column", sm: "row" }
        }}
      >
        <Box flex="1" p={4}>
          <Typography variant="h5">
            Market Garden
          </Typography>
          <Typography variant="subtitle2" pt={1}>
            A no dig organic market garden is a type of garden that is
            cultivated without disturbing the soil. This means that no digging,
            tilling, or other forms of soil disturbance are used. Instead, the
            soil is built up and improved over time by adding organic matter,
            such as compost, manure, and mulch. They help to conserve soil
            moisture and fertility, reduce the risk of soil erosion, they are
            less labor-intensive than traditional gardens and they can be more
            productive than traditional gardens. There are a number of different
            methods that can be used to create a no dig organic market garden.
            One popular method is the Lasagna Method, which involves layering
            different materials, such as compost, cardboard, and straw, to
            create a raised bed. No dig organic market gardens can be used to
            grow a variety of vegetables, fruits, herbs, and flowers.
          </Typography>
        </Box>
        <Box
          flex="1"
          alignSelf='center'
          sx={{            
            minHeight: { xs: "50vh", sm: "60vh" },
            maxHeight: { xs: "50vh", sm: "60vh" },
            width: { xs: "100%" },
            backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2Fcfc4bcc1-f300-4990-826e-705a845f2f5d.jpg?alt=media&token=2b2f0c03-d217-47be-ac40-c8fbe833a0d5)`,
            backgroundPosition: "right",
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
          flex="1"
          alignSelf='center'          
          sx={{
            minHeight: { xs: "50vh", sm: "60vh" },
            maxHeight: { xs: "50vh", sm: "60vh" },
            width: { xs: "100%" },
            backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FIMG_0086.jpg?alt=media&token=65e9b4e3-d609-43f3-919e-c2a41a311e17)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
        <Box flex='1' p={4}>
          <Typography variant="h5">How it works</Typography>
          <Typography variant="subtitle2" pt={1}>
            Order before Friday 9pm to get your order this weekend. We deliver
            on saturdays and sundays.
          </Typography>
          <br />
          <Typography variant="subtitle2">
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
          <Typography variant="subtitle2">
            We grow all our own produce in the heart of West-Berkshire, in the
            beautiful village of Bucklebury.
          </Typography>
          <br />
          <Typography variant="subtitle2">
            Personal, fast and reliable, we deliver our own products to you.
          </Typography>
          <br />
          <Typography variant="subtitle2">
            We are an small, independent business who love food the
            old-fashioned way. No chemicals, mass produced, identical
            vegetables. But grown with love and passion.
          </Typography>
          <br />
          <Typography variant="subtitle2">
            We also supply other small local businesses like.
          </Typography>
        </Box>
      </Box>
    </Box>

    
    // {/* <Grid
    //   item
    //   container
    //   xs={12}
    //   gap={2}
    //   display="flex"
    //   flexDirection="column"
    //   sx={{
    //     rowGap: { xs: "2rem", md: "4rem" },
    //   }}
    // >
    //   {categories.map((cat, idx) => (
    //     <Grid
    //       item
    //       container
    //       key={cat.label}
    //       display="flex"
    //       sx={{
    //         flexDirection: {
    //           xs: "row",
    //           md: idx % 2 === 0 ? "row" : "row-reverse",
    //         },
    //         minHeight: { xs: "30rem", md: "15rem" },
    //       }}
    //     >
    //       <Grid item xs={12} md={6}>
    //         <ButtonBase
    //           onClick={() => navigate(cat.path)}
    //           sx={{ height: "100%", width: "100%" }}
    //         >
    //           <Card
    //             sx={(theme) => ({
    //               backgroundColor: theme.palette.primary.main,
    //               boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    //               margin: "auto",
    //               height: "100%",
    //               width: "100%",
    //               maxWidth: "30rem",
    //               textAlign: "center",
    //               cursor: "pointer",
    //               "&:hover": {
    //                 opacity: "0.8",
    //               },
    //               backgroundImage: `url(${cat.image})`,
    //               backgroundRepeat: "no-repeat",
    //               backgroundSize: "cover",
    //               display: "flex",
    //               justifyContent: "center",
    //             })}
    //           />
    //         </ButtonBase>
    //       </Grid>
    //       <Grid
    //         item
    //         textAlign="center"
    //         xs={12}
    //         md={5}
    //         sx={{
    //           margin: {
    //             xs: "2rem 1rem 0rem 1rem",
    //             md: "2rem 0rem 0rem 2rem",
    //           },
    //         }}
    //       >
    //         <Typography variant="h4">{cat.label}</Typography>
    //         <Typography variant="subtitle2">
    //           dfddksjdfhksjfhsdj sdkjfbdskjfbsd sdf sdkf sdkhfbdfbdjhfbd{" "}
    //         </Typography>
    //       </Grid>
    //     </Grid>
    //   ))}
    // </Grid> */}
  );
};

export default Home;
