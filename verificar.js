const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const articles = await prisma.article.count();
  
  console.log('--- REPORTE DE LA BASE DE DATOS ---');
  console.log(`👥 Total Usuarios: ${users}`);
  console.log(`📝 Total Artículos: ${articles}`);
  console.log('-----------------------------------');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });