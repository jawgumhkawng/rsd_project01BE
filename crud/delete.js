const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // try {
        await prisma.post.deleteMany({
            where: { userId: 2},
        })
        const user = await prisma.user.delete({
            where: { id: 2},
        })
    // } catch (e) {
    //     console.log(e);
    // }

    console.log(user);
}

main();