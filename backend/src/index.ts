import { env } from "./config/env.js";
import { startHttpServer } from "./server.js";
import { ensureStartupBootstrap } from "./services/startup-bootstrap.service.js";

async function main() {
  const { shutdown } = startHttpServer({
    port: env.port,
    logLabel: env.appBaseUrl
  });

  void ensureStartupBootstrap().catch((error) => {
    console.error("Startup bootstrap failed after standalone server was already listening", error);
  });

  async function handleShutdown() {
    await shutdown();
    process.exit(0);
  }

  process.on("SIGINT", handleShutdown);
  process.on("SIGTERM", handleShutdown);
}

main().catch((error) => {
  console.error("Failed to bootstrap backend startup", error);
  process.exit(1);
});
