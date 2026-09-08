# BrandEX Utility Specification

This document defines what constitutes a valid BrandEX Utility, how they are registered, and how output is validated.

## 1. Local Processing Guarantee
**Which operations are genuinely browser-local?**
ALL Phase 2, Phase 3, and Phase 4 utilities are strictly browser-local. 
Files never leave the user's machine. They are processed entirely within the browser via Web APIs, Web Workers, or WASM.

## 2. Capability Indicators
Every utility must register its capability:
- 🟢 **Local**: Processed entirely in your browser.
- 🟡 **Hybrid**: Small files process locally. Larger files may use secure processing (Future).
- 🔵 **Server**: This operation requires server processing (Future).

## 3. Output Validation
**How is every output validated?**
If BrandEX says it generated an `output.pdf`, it must prove it before presenting the download.
Every utility implements an `OutputValidator`.
- **Images**: Parsed back into an `ImageBitmap` to ensure the header and data are not corrupt.
- **PDFs**: Magic byte check (`%PDF-`), and a lightweight parsing pass using `pdf-lib` to ensure the file is not malformed.
- **JSON**: Parsed via `JSON.parse`.
- **Archives**: Headers checked to verify archive integrity.

Tests must replicate this validation against real files, including edge cases (0-byte, corrupt files, massive files).

## 4. Real-time Progress
Utilities must report honest progress.
Instead of fake `setTimeout` loaders, utilities hook into streaming APIs or discrete worker steps.
Example (Image Compression):
`Reading -> Decoding -> Resizing -> Encoding -> Writing -> Complete`

## 5. Third-Party Contributions
**How will a third-party contributor add a new utility?**
BrandEX uses a plugin architecture. To add a utility, a contributor:
1. Creates a new directory in `packages/` (e.g., `packages/utility-new-tool`).
2. Implements the `IBrandexUtility` interface, exporting:
   - `metadata` (Name, Category, Icon, Capabilities).
   - `worker` (The processing logic).
   - `ui` (React components for options).
   - `validator` (Output validation logic).
3. Registers it in the central `UtilityRegistry` in `packages/core`.

The utility will remain unlisted until it passes the **Utility Certification**:
- ✓ Functional
- ✓ Local processing
- ✓ Tested (Browser/Mobile)
- ✓ Accessibility checked
- ✓ Security reviewed
