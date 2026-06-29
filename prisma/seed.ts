import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const adminEmail = 'admin@vacancy.et';
  const adminPassword = 'admin123';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Platform Admin',
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      role: 'ADMIN',
      isActive: true,
    },
  });

  let employer = await prisma.employer.findUnique({
    where: { userId: admin.id },
    include: { company: true },
  });

  if (!employer) {
    employer = await prisma.employer.create({
      data: {
        userId: admin.id,
        company: {
          create: {
            name: 'Et_vacancy Platform',
            industry: 'Platform',
            location: 'Addis Ababa',
            isApproved: true,
          },
        },
      },
      include: { company: true },
    });
  }

  console.log('Seed complete');
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
