import { hash } from "bcryptjs"
import { prisma } from "../src/lib/prisma"

async function main() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    throw new Error("ADMIN_PASSWORD environment variable is required")
  }

  const hashedPassword = await hash(password, 12)

  const admin = await prisma.warehouseWorker.upsert({
    where: {
      email: "admin@fafresh.com",
    },
    update: {},
    create: {
      email: "admin@fafresh.com",
      firstName: "Admin",
      lastName: "User",
      phone: "1234567890",
      role: "ADMIN",
      password: hashedPassword,
    },
  })

  console.log(`Created admin user with ID: ${admin.id}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 