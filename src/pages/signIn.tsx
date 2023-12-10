import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import SignInForm from "../components/SignInForm";

function SignInSide() {
  return (
    <Grid container mt={2} sx={{ minHeight: "calc(100% - 12.5rem)" }}>
      <Grid item xs={8}>
        <Typography component="h1" variant="h3">
          Sign In
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        container
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="caption">Don't have an account?</Typography>
          <Link to="/signup">Sign Up</Link>
        </Box>
      </Grid>
      <SignInForm initial={true} />
      <Grid
        item
        flexGrow="1"
        sx={{
          backgroundImage:
            "url(https://firebasestorage.googleapis.com/v0/b/marketgarden-dev.appspot.com/o/files%2Fgarden1.jfif?alt=media&token=e44d8a9c-192e-45fc-a427-956974c79724)",
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

export default SignInSide;
