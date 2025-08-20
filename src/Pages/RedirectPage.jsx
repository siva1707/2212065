import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Container, Paper, Typography, Button } from "@mui/material";
import { getAllLinks, saveAllLinks } from "../utils/storage";
import { isExpired } from "../utils/url";
import { useLogger } from "../context/LogContext";

export default function RedirectPage() {
  const { code } = useParams();
  const logger = useLogger();
  const [state, setState] = React.useState({ status: "checking", longUrl: "", reason: "" });

  React.useEffect(() => {
    const all = getAllLinks();
    const idx = all.findIndex((x) => x.code === code);
    if (idx === -1) {
      setState({ status: "error", longUrl: "", reason: "Short URL not found." });
      logger.log({ level: "warn", action: "redirect_missing", message: "Shortcode not found", meta: { code } });
      return;
    }
    const item = all[idx];
    if (isExpired(item.expiry)) {
      setState({ status: "error", longUrl: item.longUrl, reason: "This short URL has expired." });
      logger.log({ level: "warn", action: "redirect_expired", message: "Attempted redirect to expired link", meta: { code } });
      return;
    }

    // increment count and persist, then perform redirect
    const updated = { ...item, redirectCount: (item.redirectCount || 0) + 1 };
    all[idx] = updated;
    saveAllLinks(all);
    logger.log({ action: "redirect_ok", message: "Redirecting", meta: { code, to: item.longUrl } });
    logger.flush();

    window.location.replace(item.longUrl);
  }, [code, logger]);

  if (state.status === "checking") return null; // short blank state

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Unable to redirect</Typography>
        <Typography sx={{ mb: 2 }}>{state.reason}</Typography>
        {state.longUrl && (
          <Typography sx={{ mb: 2, wordBreak: "break-all" }}>
            Original URL: {state.longUrl}
          </Typography>
        )}
        <Button variant="contained" component={RouterLink} to="/">Go to Shortener</Button>
      </Paper>
    </Container>
  );
}
