import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonOk, forbidden } from '@/lib/api-utils';

export async function GET() {
  const session = await requireRole(['ADMIN']);
  if (!session) return forbidden();

  const companies = await prisma.company.findMany({
    include: {
      employer: {
        include: { user: { select: { id: true, name: true, email: true, isActive: true } } },
      },
      _count: { select: { jobs: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return jsonOk(companies);
}
