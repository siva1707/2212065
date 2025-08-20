import React from "react";
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Stack, Link, Button
} from "@mui/material";
import dayjs from "dayjs";
import { getAllLinks, saveAllLinks } from "../utils/storage";
import { buildShortUrl, isExpired } from "../utils/url";
import { useLogger } from "../context/LogContext";

export default function StatsPage() {
  const [items, setItems] = React.useState([]);
  const logger = useLogger();

  const reload = () => setItems(getAllLinks());

  React.useEffect(() => {
    reload();
  }, []);

  const clearAll = () => {
    saveAllLinks([]);
    logger.log({ action: "clear_links", message: "All short links cleared" });
    logger.flush();
    reload();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Statistics</Typography>
        <Stack direction="row" spacing={1}>
          <Button onClick={reload} variant="outlined">Refresh</Button>
          <Button onClick={clearAll} color="error" variant="outlined">Clear All</Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Original URL</TableCell>
              <TableCell>Short URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell align="right">Redirects</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((it) => {
              const expired = isExpired(it.expiry);
              return (
                <TableRow key={it.code} hover>
                  <TableCell sx={{ maxWidth: 360 }}>
                    <Link underline="hover" href={it.longUrl} target="_blank" rel="noreferrer" sx={{ overflowWrap: "anywhere" }}>
                      {it.longUrl}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link underline="hover" href={buildShortUrl(it.code)}>{buildShortUrl(it.code)}</Link>
                  </TableCell>
                  <TableCell>{dayjs(it.createdAt).format("YYYY-MM-DD HH:mm")}</TableCell>
                  <TableCell>{dayjs(it.expiry).format("YYYY-MM-DD HH:mm")}</TableCell>
                  <TableCell align="right">{it.redirectCount}</TableCell>
                  <TableCell>
                    <Chip label={expired ? "Expired" : "Active"} color={expired ? "default" : "success"} />
                  </TableCell>
                </TableRow>
              );
            })}
            {!items.length && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  No data yet. Create a few links on the Shortener page.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
