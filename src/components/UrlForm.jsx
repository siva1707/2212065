import React from "react";
import {
  Paper, Box, Typography, IconButton, Grid, TextField, Button, Tooltip, Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { isValidUrl, normalizeMinutes, isValidShortcode, makeExpiryISO, randomCode } from "../utils/url";
import { getAllLinks, saveAllLinks } from "../utils/storage";
import { useLogger } from "../context/LogContext";

const emptyRow = () => ({ url: "", minutes: "", code: "" });

export default function UrlForm({ onCreated }) {
  const [rows, setRows] = React.useState([emptyRow()]);
  const [errors, setErrors] = React.useState({});
  const logger = useLogger();

  const addRow = () => {
    if (rows.length >= 5) return;
    setRows((r) => [...r, emptyRow()]);
  };

  const removeRow = (idx) => setRows((r) => r.filter((_, i) => i !== idx));

  const setField = (idx, key, value) =>
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));

  const validate = () => {
    const e = {};
    const existing = getAllLinks();
    const taken = new Set(existing.map((x) => x.code));
    rows.forEach((row, i) => {
      if (!isValidUrl(row.url)) e[`url_${i}`] = "Enter a valid URL (including http/https).";
      const mins = normalizeMinutes(row.minutes);
      if (mins === null) e[`minutes_${i}`] = "Minutes must be a positive integer or empty (defaults to 30).";
      if (row.code) {
        if (!isValidShortcode(row.code)) e[`code_${i}`] = "Shortcode must be 4–12 alphanumeric characters.";
        else if (taken.has(row.code)) e[`code_${i}`] = "Shortcode already in use. Choose another.";
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      logger.log({ level: "warn", action: "validation_failed", message: "Form validation failed", meta: { rows } });
      return;
    }

    const existing = getAllLinks();
    const taken = new Set(existing.map((x) => x.code));
    const created = rows.map((row) => {
      let code = row.code?.trim() || randomCode();
      // ensure uniqueness
      while (taken.has(code)) code = randomCode();
      taken.add(code);

      const mins = normalizeMinutes(row.minutes);
      const expiry = makeExpiryISO(mins);

      const item = {
        code,
        longUrl: row.url.trim(),
        expiry,
        createdAt: new Date().toISOString(),
        redirectCount: 0,
      };
      return item;
    });

    const all = [...existing, ...created];
    saveAllLinks(all);
    logger.log({
      action: "create_links",
      message: "Short links created",
      meta: created.map((c) => ({ code: c.code, longUrl: c.longUrl, expiry: c.expiry })),
    });
    logger.flush();

    onCreated?.(created);
    setRows([emptyRow()]);
    setErrors({});
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Create Short Links (up to 5 at once)</Typography>
      <Box component="form" onSubmit={onSubmit}>
        {rows.map((row, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  label="Original URL"
                  value={row.url}
                  onChange={(e) => setField(idx, "url", e.target.value)}
                  fullWidth
                  error={!!errors[`url_${idx}`]}
                  helperText={errors[`url_${idx}`] || "Example: https://example.com/page"}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Validity (minutes)"
                  value={row.minutes}
                  onChange={(e) => setField(idx, "minutes", e.target.value.replace(/\D+/g, ""))}
                  fullWidth
                  error={!!errors[`minutes_${idx}`]}
                  helperText={errors[`minutes_${idx}`] || "Empty = 30"}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Custom Shortcode (optional)"
                  value={row.code}
                  onChange={(e) => setField(idx, "code", e.target.value)}
                  fullWidth
                  error={!!errors[`code_${idx}`]}
                  helperText={errors[`code_${idx}`] || "4–12 letters/numbers"}
                />
              </Grid>
              <Grid item xs={12} md={1} sx={{ display: "flex", justifyContent: "center" }}>
                <Tooltip title={rows.length > 1 ? "Remove row" : ""} arrow>
                  <span>
                    <IconButton color="error" onClick={() => removeRow(idx)} disabled={rows.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
            {idx < rows.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addRow}
            disabled={rows.length >= 5}
          >
            Add another
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button type="submit" variant="contained">Shorten</Button>
        </Box>
      </Box>
    </Paper>
  );
}
