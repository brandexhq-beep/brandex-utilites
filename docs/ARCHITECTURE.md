# BrandEX Utilities Architecture

This document defines the core architecture for BrandEX Utilities, focusing on the file processing engine, worker management, and storage strategies.

## 1. Core Architecture Pattern

The system is built around a centralized `File Engine` that acts as the source of truth for all file operations.

```text
                  FILE
                   │
                   ▼
             FILE ENGINE
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
     INSPECT     PROCESS     EXPORT
        │          │          │
        ▼          ▼          ▼
     Metadata    Workers    Download
     MIME        WASM       OPFS
     Hash        Web APIs
     Size        Engines
```

## 2. Processing Libraries

To answer exactly which processing libraries are used for v0.1 - v0.2 utilities:
- **Hash Generator**: Web Crypto API (SHA-1, SHA-256, SHA-384, SHA-512). For MD5, we use `spark-md5` (MIT), a heavily vetted, fast implementation.
- **Images (Resize/Convert)**: Browser native Canvas API and `OffscreenCanvas` in workers.
- **Images (Compress)**: `browser-image-compression` (MIT) or WASM-based `squoosh/lib` (Apache 2.0).
- **PDF Manipulation**: `pdf-lib` (MIT) for merging, splitting, extracting, and metadata manipulation.
- **PDF Rendering/Extraction**: `pdf.js` (Apache 2.0) via Mozilla.
- **Archives**: `fflate` (MIT) for high-performance, worker-ready ZIP extraction and compression.
- **Data (JSON/Base64/Text)**: Native browser APIs (`JSON.parse`, `atob`, `btoa`, `TextEncoder`, `TextDecoder`).

*All dependencies are strictly MIT, Apache 2.0, or BSD licensed to ensure enterprise self-hosting viability.*

## 3. Worker Architecture & Thread Management

The UI thread must never freeze. All heavy processing happens in Web Workers.

- **Worker Manager**: Spawns and tracks worker instances.
- **Communication**: Uses structured cloning. For large files, `ArrayBuffer` instances are transferred (not copied) to workers.
- **Cancellation**: Implemented via `AbortController`. When a user clicks "Cancel":
  1. The UI sends an abort signal.
  2. If the worker is running WASM or a tight loop and cannot yield, the Worker Manager uses `Worker.terminate()` to brutally kill the thread.
  3. The Cleanup Service is immediately invoked to wipe OPFS and memory.

## 4. Storage Strategy

- **`localStorage`**: Strictly for lightweight UI state (theme, sidebar, preferences, favorites, settings). **No file data.**
- **`IndexedDB`**: Job metadata, utility preferences, and workflow definitions.
- **OPFS (Origin Private File System)**: Used for staging large input files, intermediate processing steps, and final outputs before download.
- **Cache Storage**: Caching WASM binaries and worker bundles for instant offline loads.

## 5. Limitations & Fallbacks

- **File-size/Memory Limitations**: 
  - For purely memory-based operations, browsers typically cap tab memory at ~2GB-4GB.
  - By utilizing OPFS and chunked processing (e.g., `fflate` streams, streaming hashing), we can bypass RAM limits for most utilities.
  - A soft limit of 1GB will be applied to initial utilities until streaming pipelines are fully vetted.
- **Unsupported APIs**: 
  - The Capability System runs on boot. If a browser lacks OPFS, the system falls back to Blob/memory storage and enforces a strict 100MB file size limit, displaying a warning indicator to the user.
  - If a required feature (e.g., `OffscreenCanvas`) is missing, the specific utility will gracefully disable itself or fallback to main-thread processing with a performance warning.
