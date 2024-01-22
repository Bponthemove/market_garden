import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import SignInForm from "../components/SignInForm";

function SignInSide() {
  return (
    <Box
      mt={2}
      display="flex"
      alignItems="center"
      sx={{ flexDirection: { xs: "column", sm: "row" } }}
    >
      <Box display='flex' flexDirection='column' gap={5} alignItems='center' sx={{width: {xs: "80%", sm: "40%"},}}>
        <Typography component="h1" variant="h3">
          Sign In
        </Typography>
        <SignInForm initial={true} />
        <Typography variant="caption">Don't have an account?</Typography>
        <Link to="/signup">Sign Up</Link>
      </Box>
      <Box
        
        sx={{
          marginTop: {xs: '2rem', sm: '0px'},
          minHeight: "200px",
          width: {xs: "100%", sm: "60%"},
          backgroundImage:
            "url(https://firebasestorage.googleapis.com/v0/b/round-the-field.appspot.com/o/appImages%2FIMG_5117.JPG?alt=media&token=834117ed-1726-4703-84ed-28951d464b07)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
}

export default SignInSide;
