import React from "react";
import { Container, Typography } from "@mui/material";
import UrlForm from "../components/UrlForm";
import UrlList from "../components/UrlList";

export default function ShortenerPage() {
  const [latest, setLatest] = React.useState([]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        URL Shortener
      </Typography>
      <UrlForm onCreated={setLatest} />
      <UrlList items={latest} />
    </Container>
  );
}
