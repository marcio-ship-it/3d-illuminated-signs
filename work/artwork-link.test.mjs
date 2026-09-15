import assert from "node:assert/strict";
import test from "node:test";
import { normalizeArtworkUrl } from "../lib/lead-intake-contract.ts";

test("artwork links accept and normalize HTTPS URLs", () => {
  assert.deepEqual(
    normalizeArtworkUrl("  https://drive.example.com/folder/quote%20art?view=1#sheet  "),
    { ok: true, value: "https://drive.example.com/folder/quote%20art?view=1#sheet" },
  );
});

test("artwork links may be omitted", () => {
  assert.deepEqual(normalizeArtworkUrl(undefined), { ok: true, value: null });
  assert.deepEqual(normalizeArtworkUrl(null), { ok: true, value: null });
  assert.deepEqual(normalizeArtworkUrl("   "), { ok: true, value: null });
});

test("artwork links reject unsafe or overlong values", () => {
  for (const value of [
    "http://files.example.com/art.pdf",
    "https://user:secret@files.example.com/art.pdf",
    "https://files.example.com/art.pdf\nblind-copy",
    "javascript:alert(1)",
    "not a URL",
    `https://files.example.com/${"a".repeat(2048)}`,
    { href: "https://files.example.com/art.pdf" },
  ]) {
    assert.deepEqual(normalizeArtworkUrl(value), { ok: false, value: null });
  }
});
