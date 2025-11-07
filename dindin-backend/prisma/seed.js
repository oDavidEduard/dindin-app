import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){
    console.log("Start seeding...");

    await prisma.category.deleteMany();

    const categories = await prisma.category.createMany({
        data: [
            { name: "Alimentação", iconName: "food-icon" },
            { name: "Transporte", iconName: "transport-icon" },
            { name: "Lazer", iconName: "leisure-icon" },
            { name: "Moradia", iconName: "home-icon" },
            { name: "Outros", iconName: "others-icon"},
        ],
    });

    console.log(`Seeding finished. Created ${categories.count} categories`);
}

main()
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})