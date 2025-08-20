import React from "react";
import { Link as RouterLink, Routes, Route } from "react-router-dom";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import ShortenerPage from "./pages/ShortenerPage";
import StatsPage from "./pages/StatsPage";
import RedirectPage from "./pages/RedirectPage";

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            AffordMed URL Shortener
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">Shortener</Button>
          <Button color="inherit" component={RouterLink} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:code" element={<RedirectPage />} />
          <Route path="*" element={<ShortenerPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
