import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useAuthContext } from "../context/AuthContext";

export default function LogOut() {
  const { logOut, loading } = useAuthContext();

  return (
    <Grid container sx={{ minHeight: "calc(100vh - 13rem)" }}>
      <Grid item xs={0} md={1} />
      <Grid
        item
        container
        display="flex"
        flexDirection="column"
        justifyContent='center'
        alignContent='center'
        gap={2}
        xs={12}
        md={6.5}
      >
        <Grid item display='flex' alignContent='center'>
          <Typography component="h1" variant="h5">
            Are you sure you want to log out?
          </Typography>
        </Grid>
        <Grid item>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => logOut()} color="primary" variant="contained" disabled={loading}>
              Log Out
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={0} md={1} />
      <Grid
        item
        flexGrow="1"
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Grid>
  );
}
