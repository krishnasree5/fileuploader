import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      firstName: "Krishna Sree",
      lastName: "Gunna",
      username: "krishna",
      email: "krishna@gmail.com",
      password: "123456",
      Folder: {
        create: [{ name: "photos" }, { name: "my documents" }],
      },
    },
  });
  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
