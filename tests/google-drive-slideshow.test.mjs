import test from "node:test";
import assert from "node:assert/strict";
import handler, {
  clampSlotMinutes,
  parseFolderInput,
  pickIndex,
  sortFiles,
  imageUrlsForFile,
} from "../applications/google-drive-slideshow/api/data.js";
import {
  normalizeBrightnessBoost,
  brightnessBoostEpdMeta,
  defaultEpdOptimizeMeta,
} from "../applications/google-drive-slideshow/assets/brightness-boost.js";

test("parseFolderInput accepts raw folder ID", () => {
  assert.deepEqual(parseFolderInput("1a2b3c-d4e5"), {
    folderId: "1a2b3c-d4e5",
    resourceKey: "",
  });
});

test("parseFolderInput parses /folders/ URL and resourcekey", () => {
  const url =
    "https://drive.google.com/drive/folders/abc123XYZ?resourcekey=0-abc%2Bdef";
  assert.deepEqual(parseFolderInput(url), {
    folderId: "abc123XYZ",
    resourceKey: "0-abc+def",
  });
});

test("parseFolderInput parses open?id= URL", () => {
  assert.deepEqual(
    parseFolderInput("https://drive.google.com/open?id=folderId99"),
    { folderId: "folderId99", resourceKey: "" },
  );
});

test("parseFolderInput rejects invalid URLs", () => {
  assert.throws(
    () => parseFolderInput("https://example.com/no-folder-here"),
    /folder ID/,
  );
  assert.throws(() => parseFolderInput("https://drive.google.com/"), /folder ID/);
});

test("clampSlotMinutes clamps and defaults", () => {
  assert.equal(clampSlotMinutes(0), 1);
  assert.equal(clampSlotMinutes(2000), 1440);
  assert.equal(clampSlotMinutes("90"), 90);
  assert.equal(clampSlotMinutes("nope"), 60);
});

test("sortFiles orders by name", () => {
  const files = [{ name: "b.jpg" }, { name: "a.jpg" }];
  assert.deepEqual(sortFiles(files, "name").map((f) => f.name), ["a.jpg", "b.jpg"]);
});

test("pickIndex walks sequential slots modulo length", () => {
  assert.equal(pickIndex(3, "name", 0, "paper"), 0);
  assert.equal(pickIndex(3, "name", 1, "paper"), 1);
  assert.equal(pickIndex(3, "name", 3, "paper"), 0);
});

test("pickIndex random is stable for paperId and slot", () => {
  const a = pickIndex(10, "random", 42, "kitchen");
  const b = pickIndex(10, "random", 42, "kitchen");
  const c = pickIndex(10, "random", 42, "other");
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test("imageUrlsForFile upgrades thumbnail size and adds fallbacks", () => {
  const urls = imageUrlsForFile({
    id: "fileId1",
    thumbnailLink: "https://lh3.googleusercontent.com/foo=s220",
  });
  assert.equal(urls[0], "https://lh3.googleusercontent.com/foo=s1600");
  assert.ok(urls.some((u) => u.includes("fileId1")));
  assert.equal(new Set(urls).size, urls.length);
});

test("handler returns sample when folder and key are empty", async () => {
  const result = await handler({ query: {} });
  assert.equal(result.source, "sample");
  assert.ok(result.total >= 1);
  assert.ok(result.imageUrl.startsWith("data:image/svg+xml"));
});

test("handler requires folder URL when API key is set", async () => {
  await assert.rejects(
    () => handler({ query: { apiKey: "key-only" } }),
    /folder URL or ID is required/,
  );
});

test("handler requires API key when folder URL is set", async () => {
  await assert.rejects(
    () => handler({ query: { folderUrl: "https://drive.google.com/drive/folders/abc" } }),
    /API key is required/,
  );
});

test("normalizeBrightnessBoost parses enum labels and clamps", () => {
  assert.equal(normalizeBrightnessBoost("0 - Off"), 0);
  assert.equal(normalizeBrightnessBoost(""), 0);
  assert.equal(normalizeBrightnessBoost("bogus"), 0);
  assert.equal(normalizeBrightnessBoost("1"), 1);
  assert.equal(normalizeBrightnessBoost("3 - Max"), 3);
  assert.equal(normalizeBrightnessBoost(99), 3);
  assert.equal(normalizeBrightnessBoost(-2), 0);
});

test("brightnessBoostEpdMeta is natural at level 0 and exposure increases", () => {
  assert.deepEqual(defaultEpdOptimizeMeta(), { intent: "natural" });
  assert.equal(brightnessBoostEpdMeta(0), null);

  const exposures = [1, 2, 3].map(
    (level) =>
      brightnessBoostEpdMeta(level).imageAdjustmentOptions.toneMapping.exposure,
  );
  assert.ok(exposures[0] < exposures[1]);
  assert.ok(exposures[1] < exposures[2]);
});
