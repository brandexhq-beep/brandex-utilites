# BrandEX Security Architecture

Security starts before the first server exists. This document outlines the security posture for BrandEX Utilities v0.1 (Local-First).

## 1. Client-Side File Security
Even though files don't leave the browser, malicious files can crash the browser or attempt XSS.

- **No Execution**: File contents are NEVER injected into the DOM as HTML or evaluated as scripts.
- **Validation**: 
  - MIME type validation via OS reports.
  - Magic bytes validation for strict type checking.
- **Sandboxing**: Heavy processing happens in Web Workers without DOM access.
- **Limits**:
  - Strict file-size limits enforced before processing starts.
  - Decompression bombs (Zip bombs) are mitigated by tracking extraction ratios and capping output size.

## 2. Cleanup System
**How are temporary files cleaned?**
Files are highly sensitive. We ensure no traces remain:
1. **Immediate Revocation**: `URL.revokeObjectURL()` is called the moment an output is downloaded or discarded.
2. **OPFS Wiping**: The `CleanupService` runs after every job completes, fails, or is cancelled. It deletes all associated handles in the Origin Private File System.
3. **Startup Sweep**: On application boot, the `CleanupService` sweeps OPFS for any orphaned files left over from a browser crash.
4. **Memory Release**: References to `File` and `ArrayBuffer` objects are actively nullified to trigger the garbage collector.

## 3. Server Processing (Future Proofing)
**What functionality requires a server?**
In v0.1 - v0.2, nothing.
In later versions, advanced features (OCR, heavy AI upscaling, proprietary formats requiring heavy licenses) will use a server.

When server processing is introduced, the architecture will follow this strict pipeline:
1. Upload & stream validation.
2. Malware / file inspection via AV engine.
3. Processing in an ephemeral Sandbox (Docker/gVisor).
4. Short-lived download link generation.
5. Immediate hard deletion of inputs and outputs after 10 minutes or download completion.
