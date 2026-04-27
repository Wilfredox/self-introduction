import type { Server } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

type StartHttpServerOptions = {
  port?: number;
  bindAddress?: string;
  logLabel?: string;
};

export function startHttpServer(options: StartHttpServerOptions = {}) {
  const port = options.port ?? env.port;
  const bindAddress = options.bindAddress ?? "0.0.0.0";
  const logLabel = options.logLabel ?? env.appBaseUrl;

  const server = app.listen(port, bindAddress, () => {
    console.log(`Backend listening on ${logLabel}`);
  });

  return {
    server,
    async shutdown() {
      await closeServer(server);
      await prisma.$disconnect();
    }
  };
}

function closeServer(server: Server) {
  return new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}
