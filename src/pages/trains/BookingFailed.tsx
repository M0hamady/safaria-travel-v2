// components/BookingFailed.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

const BookingFailed = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 4,
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Booking Failed
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Something went wrong during the booking process. Please try again.
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default BookingFailed;
