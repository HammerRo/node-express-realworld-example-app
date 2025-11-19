// simple-seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando el llenado de datos (Seed)...');

  // 1. Crear 50 Usuarios
  for (let i = 1; i <= 50; i++) {
    const email = `user${i}@test.com`;
    const username = `user${i}`;
    
    // Intentamos crear el usuario (si ya existe, lo omite)
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        username: username,
        password: 'password123', // En la app real esto debería estar hasheado, pero para test de carga sirve
        bio: `Soy el usuario número ${i} creado para pruebas de carga`,
        image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
      },
    });

    console.log(`✅ Usuario creado: ${user.username}`);

    // 2. Crear 20 Artículos para este usuario
    const articlesData = [];
    for (let j = 1; j <= 20; j++) {
      articlesData.push({
        slug: `articulo-${i}-${j}-${Date.now()}`, // Slug único
        title: `Artículo de prueba ${j} del usuario ${i}`,
        description: `Esta es la descripción del artículo ${j}`,
        body: `Contenido largo del artículo para generar peso en la base de datos. `.repeat(10),
        authorId: user.id,
      });
    }

    // Insertamos los artículos en lote para que sea rápido
    await prisma.article.createMany({
      data: articlesData,
      skipDuplicates: true,
    });
  }

  console.log('🏁 ¡Seed completado! Base de datos lista para el dolor.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });