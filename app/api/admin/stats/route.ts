import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonOk, forbidden } from '@/lib/api-utils';

export async function GET() {
  const session = await requireRole(['ADMIN']);
  if (!session) return forbidden();

  const [users, jobs, companies, applications, jobSeekers, employers] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.company.count(),
    prisma.application.count(),
    prisma.user.count({ where: { role: 'JOB_SEEKER' } }),
    prisma.user.count({ where: { role: 'EMPLOYER' } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });

  const recentJobs = await prisma.job.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      company: { select: { name: true } },
      _count: { select: { applications: true } },
    },
  });

  return jsonOk({
    stats: { users, jobs, companies, applications, jobSeekers, employers },
    recentUsers,
    recentJobs,
  });
}
