// =============================================================================
// Domain Configuration — Per-Server Identity & Settings
// Mission Barisal v3 — Zero Dependency
// =============================================================================
// 🧟 IMPORTANT: No hardcoded domains! Everything comes from environment variables.
// Set these in .env file or export them in your shell.
//
// Required env vars:
//   DEPLOY_DOMAIN         — Server domain (e.g., "mydomain.com", "localhost")
//
// Optional env vars (shown with defaults):
//   SERVER_NAME           — "Mission Barisal"
//   SERVER_VERSION        — "3.2.1"
//   SERVER_TYPE           — "production" | "development" | "custom"
//   PORT                  — Server port (used for CORS)
//   SESSION_VERIFY_URL    — Session verification endpoint
//   CORS_ORIGINS          — Comma-separated allowed origins
//   HAS_FRONTEND          — "true" | "false"
//   HAS_PUSHER            — "true" | "false"
//   HAS_DEV_MODELS        — "true" | "false"
//   MAX_RATE_LIMIT        — Requests/min per server instance
//   BRANDING_OWNER        — Owner name
//   BRANDING_ORGANIZATION — Organization name
//   BRANDING_EMAIL        — Contact email
//   BRANDING_WEBSITE      — Website URL
//   BRANDING_ADDRESS      — Physical address
//   BRANDING_LOCATION     — Location
// =============================================================================

// ─── Default Fallback (all env-var driven) ────────────────────
function buildDefaultConfig() {
  const port = parseInt(process.env.PORT || "5000", 10);

  return {
    name: process.env.SERVER_NAME || "Mission Barisal",
    domain: process.env.DEPLOY_DOMAIN || "localhost",
    version: process.env.SERVER_VERSION || "3.2.1",
    type: process.env.SERVER_TYPE || "development",
    hasFrontend: process.env.HAS_FRONTEND === "true",
    hasPusher: process.env.HAS_PUSHER === "true",
    hasDevModels: process.env.HAS_DEV_MODELS !== "false",
    maxRateLimitPerServer: parseInt(
      process.env.MAX_RATE_LIMIT || "999999",
      10,
    ),
    corsOrigins: parseCorsOrigins(port),
    sessionVerifyUrl:
      process.env.SESSION_VERIFY_URL ||
      `http://localhost:${port}/api/verify-session`,
    identity: {
      name: process.env.BRANDING_OWNER || "ZombieCoder",
      version: process.env.SERVER_VERSION || "3.2.1",
      tagline: process.env.BRANDING_TAGLINE || "যে���ানে কোড ও কথা বলে",
      branding: {
        owner: process.env.BRANDING_OWNER || "Development User",
        organization:
          process.env.BRANDING_ORGANIZATION || "Developer Zone",
        address: process.env.BRANDING_ADDRESS || "Local Development",
        location:
          process.env.BRANDING_LOCATION || "Barisal, Bangladesh",
        contact: {
          phone: process.env.BRANDING_PHONE || "",
          email:
            process.env.BRANDING_EMAIL ||
            "dev@localhost",
          website:
            process.env.BRANDING_WEBSITE ||
            `http://localhost:${port}`,
        },
      },
      project: "Mission Barisal — Multi-Agent Code Platform",
      runtime:
        "Zero Dependency · Pure Node.js" +
        (process.env.SERVER_TYPE === "development" ? " · Development" : ""),
    },
  };
}

// ─── Helper: Parse CORS origins from env or use defaults ──────
function parseCorsOrigins(port) {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(",").map((o) => o.trim());
  }

  // Default: allow only localhost variants
  return [
    `http://localhost:${port}`,
    `http://127.0.0.1:${port}`,
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5000",
    "http://localhost:7799",
  ];
}

// ─── DOMAIN_CONFIGS — empty by default, all config driven by env ──
// Domain-specific overrides can still be added here for advanced setups,
// but the recommended approach is to use environment variables.
const DOMAIN_CONFIGS = {};

// ─── Detect Domain ────────────────────────────────────────────
/**
 * Detect which domain this server instance is running on.
 * Priority:
 *   1. DEPLOY_DOMAIN env var (explicit override)
 *   2. Request Host header (runtime detection)
 *   3. Fallback to "localhost"
 *
 * 🧟 NO PORT-BASED DETECTION: Port 5000 no longer auto-routes to
 *    skilltoearn, port 7799 no longer auto-routes to kingwin360.
 *    Everything is explicit via env vars.
 */
function detectDomain(hostHeader) {
  // 1. Explicit env var — highest priority
  const envDomain = process.env.DEPLOY_DOMAIN;
  if (envDomain) {
    return envDomain;
  }

  // 2. Host header from incoming request
  if (hostHeader) {
    const cleanHost = hostHeader.split(":")[0].toLowerCase();

    // Check explicit configs
    if (DOMAIN_CONFIGS[cleanHost]) return cleanHost;

    // Check env-based domain
    if (envDomain && cleanHost === envDomain) return envDomain;

    return cleanHost;
  }

  // 3. Fallback
  return "localhost";
}

/**
 * Get the full configuration for a detected domain.
 * Returns a merged config: env var driven with optional domain-specific overrides.
 */
function getDomainConfig(detectedDomain) {
  // Start with domain-specific config if exists
  const domainSpecific = DOMAIN_CONFIGS[detectedDomain];
  const base = domainSpecific || buildDefaultConfig();

  // If we have a domain-specific config, merge env overrides on top
  if (domainSpecific) {
    return applyEnvOverrides(base, detectedDomain);
  }

  // Otherwise just build from env
  return buildDefaultConfig();
}

/**
 * Apply environment variable overrides to a config object.
 */
function applyEnvOverrides(config, domain) {
  const overridden = { ...config };

  if (process.env.CORS_ORIGINS) {
    overridden.corsOrigins = process.env.CORS_ORIGINS.split(",").map(
      (o) => o.trim(),
    );
  }
  if (process.env.PUSHER_APP_ID) {
    overridden.hasPusher = true;
  }
  if (process.env.SESSION_VERIFY_URL) {
    overridden.sessionVerifyUrl = process.env.SESSION_VERIFY_URL;
  }
  if (process.env.MAX_RATE_LIMIT) {
    overridden.maxRateLimitPerServer = parseInt(
      process.env.MAX_RATE_LIMIT,
      10,
    );
  }
  if (process.env.SERVER_TYPE) {
    overridden.type = process.env.SERVER_TYPE;
  }
  if (process.env.HAS_FRONTEND) {
    overridden.hasFrontend = process.env.HAS_FRONTEND === "true";
  }
  if (process.env.HAS_DEV_MODELS) {
    overridden.hasDevModels = process.env.HAS_DEV_MODELS === "true";
  }

  return overridden;
}

module.exports = {
  DOMAIN_CONFIGS,
  detectDomain,
  getDomainConfig,
  buildDefaultConfig,
};
