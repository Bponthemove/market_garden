import {
  Box,
  Card,
  Container,
  keyframes,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { categories } from "../constants/products";
import { useAuthContext } from "../context/AuthContext";
import heroImg from "../images/garden4.webp";

const Home = () => {
  const { currentUser } = useAuthContext();
  console.log(currentUser, 'user in home')
  const keyframeFilter = keyframes`
      from {
        opacity: 1;
      }
      to {
        opacity: 0.2;
      }`;

  return (
    <Grid container flexDirection="column">
      <Grid item>
        <Grid
          sx={{
            margin: "2rem 0",
            backgroundImage: `url(${heroImg})`,
            height: "60vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: "1",
            animation: `${keyframeFilter} 4s linear ease`,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h1">Tom's Market Garden</Typography>
          <Typography variant="h5">
            No Dig, Organic grown fruit & vegetables delivered to your doorstep
          </Typography>
        </Box>
      </Grid>
      <Grid
        item
        container
        xs={8}
        alignSelf="center"
        my={4}
        gap={4}
        display="flex"
        justifyContent="center"
      >
        {categories.map(({ label, image }) => (
          <Grid item xs={10} md={5} key={label}>
            <Card
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.main,
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                // minWidth: "200px",
                width: "340px",
                height: "340px",
                margin: "auto",
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  opacity: "0.8",
                },
                position: "relative",
              })}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "auto",
                  height: "100%",
                  overflow: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundImage: `url(${image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <Typography variant="h5" position="absolute" bottom="1rem">
                  {label}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Home;
