---
slug: google-drive-slideshow
name: Google Drive Slideshow
version: 0.1.0
description: Shows one image at a time from a public Google Drive folder, advancing on a fixed time slot.
renderPage: ./render.html
configUrl: /google-drive-slideshow/config.json
apiUrl: /google-drive-slideshow/api/data
offline: false
---

# Google Drive Slideshow

Cycles through images in a **public** Google Drive folder. Each refresh shows the photo for the current time slot, so the frame can advance without storing a cursor on the device.

## Links

- [Demo](https://integrations.paperlesspaper.de/google-drive-slideshow/run)
- [config.json](./config.json)

## Setup

1. Put JPEG, PNG, WebP, or GIF files in the **folder root** (subfolders are ignored).
2. Share the folder as **Anyone with the link → Viewer**.
3. In [Google Cloud Console](https://console.cloud.google.com/), enable the **Google Drive API** and create an API key restricted to the Drive API.
4. Enter the **full Share link** (or folder ID) and API key in settings. Include `resourcekey` from the link when Google provides it.

Leave **Folder URL** and **API key** empty in local preview for the built-in sample slideshow. The renderer POSTs folder URL, optional resource key, and API key to the same-origin adapter (not the render URL); use HTTPS and restrict or rotate the key in Google Cloud if it is exposed.

## Settings

- `folderUrl`, `folderResourceKey`, `apiKey`: public folder and Drive API key (see Setup)
- `order`: `random` (default) picks a stable photo per time slot; `name`, `modified`, and `created` rotate through the folder in that sort order
- `fit`: `cover` or `contain`
- `slotMinutes`: minutes per photo (default `60`); match the frame synchronisation interval when you can
- `showFilename`, `brightnessBoost` (`0 - Off` … `3 - Max`)

`color` is a host theme setting (`nativeSettings` / preview only).

## Notes

Up to **5000** images from the folder root; larger folders are truncated. Non-image files in the root count toward that scan. After a successful photo, a failed refresh keeps the last good image.

## Language Support

This integration declares `language: ["en", "de", "fr", "es", "it"]` in `config.json` and loads UI copy from `languages/<code>.json` using `payload.meta.language`.

## Branding

Google Drive is a trademark of Google LLC. This integration uses a custom icon, not the Google Drive product logo ([Google Cloud app identity guidance](https://support.google.com/cloud/answer/13804963), [Drive API branding](https://developers.google.com/workspace/drive/api/guides/branding)).
