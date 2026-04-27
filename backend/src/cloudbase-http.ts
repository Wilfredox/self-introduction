import { env } from "./config/env.js";
import { startHttpServer } from "./server.js";
import { ensureStartupBootstrap } from "./services/startup-bootstrap.service.js";

async function main() {
  console.log("CloudBase HTTP bootstrap module loaded.");

  const { shutdown } = startHttpServer({
    port: env.cloudbaseHttpPort,
    bindAddress: "0.0.0.0",
    logLabel: `CloudBase HTTP function on 0.0.0.0:${env.cloudbaseHttpPort}`
  });

  void ensureStartupBootstrap().catch((error) => {
    console.error("Startup bootstrap failed after CloudBase HTTP server was already listening", error);
  });

  async function handleShutdown() {
    await shutdown();
    process.exit(0);
  }

  process.on("SIGINT", handleShutdown);
  process.on("SIGTERM", handleShutdown);
}

main().catch((error) => {
  console.error("Failed to bootstrap CloudBase HTTP startup", error);
  process.exit(1);
});
