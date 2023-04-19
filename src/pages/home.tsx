import { ButtonBase } from "@mui/material";
import { Box, Card, keyframes, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { categories } from "../constants/products";

const Home = () => {
  const navigate = useNavigate();
  const keyframeFilter = keyframes`
      from {
        opacity: 1;
      }
      to {
        opacity: 0.2;
      }`;

  return (
    <Grid container flexDirection="column">
      <Grid item >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingX: { xs: "1rem", md: "0" },
          }}
        >
          <Typography variant="h1" sx={{ textAlign: "center" }}>
            Round the Field
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Fgarden4.webp?alt=media&token=48df481a-0b08-4be6-b866-ef0904f28deb)`,
            height: "60vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            margin: "2rem 0"
          }}
        />
        <Box
          gap={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingX: { xs: "1rem", md: "0" },
          }}
        >
          <Typography variant="h3">Market Garden</Typography>
          <Typography variant="h5">
            No Dig, Organic grown fruit & vegetables delivered to your doorstep
          </Typography>
        </Box>
        <Box
          sx={(theme) => ({
            marginY: "5rem",
            padding: "1rem",
            minHeight: "40vh",
            backgroundColor: theme.palette.secondary.light,
          })}
        >
          <Typography variant="body2" color="white">
            Order before Friday 9pm to get your order this weekend. We deliver
            on saturdays and sundays.
          </Typography>
          <br />
          <Typography variant="body2" color="white">
            We grow all our own produce in the heart of West-Berkshire, in the
            beautiful village of Bucklebury.
          </Typography>
          <br />
          <Typography variant="body2" color="white">
            Personal, fast and reliable, we deliver up to a 10 mile radius.
          </Typography>
          <br />
          <Typography variant="body2" color="white">
            We are an small, independent business who love food the
            old-fashioned way. No chemicals, mass produced, identical
            vegetables. But grown with love and passion.
          </Typography>
          <br />
          <Typography variant="body2" color="white">
            We also supply other small local businesses like.
          </Typography>
        </Box>
      </Grid>
      <Grid
        item
        container
        xs={12}
        gap={2}
        display="flex"
        flexDirection="column"
        sx={{
          rowGap: {xs: "2rem", md: "4rem"}
        }}
      >
        {categories.map((cat, idx) => (
          <Grid
            item
            container
            key={cat.label}
            display="flex"
            sx={{
              flexDirection: idx % 2 === 0 ? "row" : "row-reverse",
              minHeight: { xs: "30rem", md: "15rem" },
            }}
          >
            <Grid item xs={12} md={6}>
              <ButtonBase
                onClick={() => navigate(cat.path)}
                sx={{ height: "100%", width: "100%" }}
              >
                <Card
                  sx={(theme) => ({
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    margin: "auto",
                    height: "100%",
                    width: "100%",
                    maxWidth: "30rem",
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": {
                      opacity: "0.8",
                    },
                    backgroundImage: `url(${cat.image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    display: "flex",
                    justifyContent: "center",
                  })}
                />
              </ButtonBase>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={(theme) => ({
                margin: {
                  xs: "2rem 1rem 0rem 1rem",
                  md: "2rem 0rem 0rem 2rem",
                },
              })}
            >
              <Typography variant="h4">{cat.label}</Typography>
              <Typography variant="subtitle2">
                dfddksjdfhksjfhsdj sdkjfbdskjfbsd sdf sdkf sdkhfbdfbdjhfbd{" "}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Home;
