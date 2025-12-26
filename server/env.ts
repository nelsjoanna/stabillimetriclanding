/**
 * Environment variable validation
 * Ensures all required environment variables are set
 */

export function validateEnv() {
  const errors: string[] = [];

  // DATABASE_URL is required for database operations
  // But we allow the app to run without it (for static sites)
  if (!process.env.DATABASE_URL) {
    console.warn(
      "⚠️  DATABASE_URL not set - database features will be disabled"
    );
  }

  // SESSION_SECRET is required if DATABASE_URL is set (for authentication)
  if (process.env.DATABASE_URL && !process.env.SESSION_SECRET) {
    errors.push(
      "SESSION_SECRET must be set when DATABASE_URL is configured (required for secure sessions)"
    );
  }

  // Validate SESSION_SECRET length if set
  if (process.env.SESSION_SECRET) {
    if (process.env.SESSION_SECRET.length < 32) {
      errors.push(
        "SESSION_SECRET must be at least 32 characters long for security"
      );
    }
  }

  // NODE_ENV validation
  const validEnvs = ["development", "production", "test"];
  if (
    process.env.NODE_ENV &&
    !validEnvs.includes(process.env.NODE_ENV)
  ) {
    errors.push(
      `NODE_ENV must be one of: ${validEnvs.join(", ")}`
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.join("\n")}`
    );
  }
}
