import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { hashPassword } from "../utils/password.js";

let bootstrapPromise: Promise<void> | null = null;

async function runBootstrap() {
  await prisma.siteProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Your Name",
      tagline: "Your one-line introduction"
    }
  });

  if (!env.adminSeedUsername || !env.adminSeedPassword) {
    console.log("Startup bootstrap skipped admin seed because ADMIN_SEED_USERNAME/PASSWORD are missing.");
    return;
  }

  const passwordHash = await hashPassword(env.adminSeedPassword);

  await prisma.adminUser.upsert({
    where: { username: env.adminSeedUsername },
    update: { passwordHash },
    create: {
      username: env.adminSeedUsername,
      passwordHash
    }
  });

  console.log(`Startup bootstrap ensured admin user "${env.adminSeedUsername}" and default site profile.`);
}

export async function ensureStartupBootstrap() {
  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrap().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  await bootstrapPromise;
}
