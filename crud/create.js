const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "Alice",
            username: "alice",
            bio: "Hello",
            posts: {
                create: [
                    { content: 'First Post from Alice' },
                    { content: 'Second Post from Alice' },
                ]
            }
        }
    });

    console.log(user);
}
main();