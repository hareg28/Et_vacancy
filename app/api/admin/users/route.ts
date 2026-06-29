import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonOk, forbidden } from '@/lib/api-utils';

export async function GET() {
  const session = await requireRole(['ADMIN']);
  if (!session) return forbidden();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      employer: { select: { company: { select: { name: true, isApproved: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return jsonOk(users);
}
