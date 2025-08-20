import React from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack, Link,
} from "@mui/material";
import dayjs from "dayjs";
import { buildShortUrl, isExpired } from "../utils/url";

export default function UrlList({ items }) {
  if (!items?.length) return null;

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Original URL</TableCell>
            <TableCell>Short URL</TableCell>
            <TableCell>Expiry</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((it) => {
            const expired = isExpired(it.expiry);
            return (
              <TableRow key={it.code}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ maxWidth: 520 }}>
                    <Link href={it.longUrl} target="_blank" rel="noreferrer" underline="hover" sx={{ overflowWrap: "anywhere" }}>
                      {it.longUrl}
                    </Link>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Link href={buildShortUrl(it.code)} underline="hover">{buildShortUrl(it.code)}</Link>
                </TableCell>
                <TableCell>
                  <Chip
                    label={dayjs(it.expiry).format("YYYY-MM-DD HH:mm")}
                    color={expired ? "default" : "success"}
                    variant={expired ? "outlined" : "filled"}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
