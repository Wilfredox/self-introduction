import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_SEED_USERNAME;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!username || !password) {
    throw new Error("Missing ADMIN_SEED_USERNAME or ADMIN_SEED_PASSWORD in .env");
  }

  const passwordHash = await hashPassword(password);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash }
  });

  await prisma.siteProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Your Name",
      tagline: "Your one-line introduction"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
