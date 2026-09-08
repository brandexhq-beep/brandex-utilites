# 🛠️ BrandEX Utilities

> **Privacy-first, ultra-fast, client-side utility suite.**  
> Convert, compress, analyze, format, and generate files with 100% browser-local processing — your data never leaves your machine.

---

## 🌟 Overview

**BrandEX Utilities** is an open-source, modular collection of web-based tools designed for developers, designers, and everyday users. Built with security and privacy at its core, all operations are processed locally within your browser using modern Web APIs, WebAssembly (WASM), and Web Workers.

- 🔒 **Zero Data Leakage**: Files never upload to any external servers. Processing happens entirely on-device.
- ⚡ **Blazing Fast**: Powered by Web Workers and OffscreenCanvas so the UI never freezes or stutters.
- 💾 **OPFS Storage & Memory Efficiency**: Employs the Origin Private File System (OPFS) and streaming to handle large files without browser memory bottlenecks.
- 🧩 **Extensible Plugin System**: Plug-and-play architecture for adding new utilities through certified contracts.

---

## 🚀 Key Engines & Capabilities

| Engine | Tools & Operations | Tech / Standards |
|---|---|---|
| **🖼️ Image Engine** | Resize, convert (PNG, JPEG, WebP, AVIF), compress, inspect | Canvas API, OffscreenCanvas, WASM |
| **📄 PDF Engine** | Merge, split, page extraction, metadata inspection | `pdf-lib`, `pdf.js` |
| **📱 QR Studio** | Generate custom styled QR codes & decode/scan QR images | `jsQR`, Canvas API |
| **🔐 Security & Crypto** | Hash generator (SHA-1/256/384/512, MD5), HMAC, cipher tools | Web Crypto API, `spark-md5` |
| **🗜️ Archive Engine** | ZIP creation, inspection, and extraction | `fflate` streaming |
| **📊 Data & Dev** | JSON formatting/validation, Base64 encode/decode, text diffs, UUID generation | Native Web APIs, TextEncoder/Decoder |

---

## 🏛️ Monorepo Architecture

The repository is organized as a Turborepo monorepo powered by `pnpm`:

```text
brandex-utilities/
├── apps/
│   └── web/                   # Next.js frontend application
├── packages/
│   ├── core/                  # Core abstractions, interfaces (IBrandexUtility), Job types
│   ├── database/              # Prisma schema and database clients
│   ├── file-engine/           # File inspection, MIME detection, and streaming
│   ├── queue/                 # Job queue orchestrator
│   ├── storage/               # OPFS & browser storage abstraction
│   ├── ui/                    # Reusable UI component library
│   ├── utility-registry/      # Dynamic utility registration & certification
│   └── worker-engine/         # Web Worker thread pooling and lifecycle management
└── docs/                      # Architecture, specifications, and security policies
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [pnpm](https://pnpm.io/) (`>= 9.0.0`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jefferyopenclaw-max/brandex-utilities.git
   cd brandex-utilities
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development servers for all apps and packages |
| `pnpm build` | Build all apps and packages for production |
| `pnpm lint` | Run ESLint across all projects |
| `pnpm test` | Run test suites |
| `pnpm clean` | Clean build artifacts and dependencies |

---

## 🤝 Contributing

We welcome contributions! To add a new utility:
1. Review [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/UTILITY-SPEC.md`](docs/UTILITY-SPEC.md).
2. Create your utility package under `packages/` adhering to the `IBrandexUtility` interface.
3. Ensure operations are client-local and pass the validation test suite.
4. Submit a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). All third-party libraries used in the browser engines are strictly MIT, Apache 2.0, or BSD compliant.
