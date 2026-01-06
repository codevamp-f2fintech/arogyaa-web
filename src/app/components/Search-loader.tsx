// components/DoctorCardSkeleton.js
import { Card, CardContent, Skeleton, Box, Grid, Stack } from "@mui/material";

export default function DoctorCardSkeleton() {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 500,
        height: 350,
        borderRadius: 4,
        backgroundColor: "#5A4080",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="circular" width={60} height={60} />
          <Box>
            <Skeleton variant="text" width={100} height={25} />
            <Skeleton variant="text" width={150} height={20} />
          </Box>
        </Stack>

        <Box mt={2}>
          <Grid container spacing={1}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid item key={i}>
                <Skeleton variant="rounded" width={70} height={25} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={2}>
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>

        <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width={40} height={20} />
        </Box>
      </CardContent>

      <Box display="flex" justifyContent="space-between" px={2} pb={1}>
        <Skeleton variant="rounded" width={140} height={35} />
        <Skeleton variant="rounded" width={160} height={35} />
      </Box>
    </Card>
  );
}
