import { Box, Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import User from "../components/User";
import { useFirebase } from "../hooks/useFirebase";

export default function Users() {
  const { getAllUsers } = useFirebase();

  const { data, isLoading, isError, refetch } = useQuery([], getAllUsers);

  const users = data?.reduce((a, c) => {
    if (c.firstName) {
      if (!("couponId" in c) || !c.couponId) c.couponId = "none";
      a.push(c);
    }
    return a;
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        Error loading your data, please try again
        <Button onClick={() => refetch}>Refetch</Button>
      </Box>
    );
  }

  if (users.length === 0) {
    return <Box>No data was found</Box>;
  }

  return (
    <Box component="main" mt={4}>
      {users.map((user) => (
        <User key={user.uid} user={user} refetch={refetch} />
      ))}
    </Box>
  );
}
