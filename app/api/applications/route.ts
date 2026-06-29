import prisma from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/auth';
import { jsonOk, jsonError, unauthorized, forbidden } from '@/lib/api-utils';

export async function GET(request: Request) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const forEmployer = searchParams.get('employer') === 'true';

  if (forEmployer) {
    if (session.user.role !== 'EMPLOYER' && session.user.role !== 'ADMIN') return forbidden();

    const employer = await prisma.employer.findUnique({
      where: { userId: session.user.id },
      include: { company: true },
    });

    const where =
      session.user.role === 'ADMIN'
        ? {}
        : employer?.company
          ? { job: { companyId: employer.company.id } }
          : { id: 'none' };

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true, company: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return jsonOk(applications);
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        include: {
          company: { select: { name: true, logoUrl: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return jsonOk(applications);
}

export async function POST(request: Request) {
  const session = await requireRole(['JOB_SEEKER']);
  if (!session) return forbidden();

  const { jobId, coverLetter, cvUrl } = await request.json();
  if (!jobId) return jsonError('Job ID is required');

  const job = await prisma.job.findFirst({
    where: { id: jobId, isPublished: true, isClosed: false },
  });
  if (!job) return jsonError('Job not available', 404);

  const existing = await prisma.application.findUnique({
    where: { jobId_userId: { jobId, userId: session.user.id } },
  });
  if (existing) return jsonError('You already applied to this job', 409);

  const application = await prisma.application.create({
    data: {
      jobId,
      userId: session.user.id,
      coverLetter: coverLetter || null,
      cvUrl: cvUrl || null,
    },
    include: {
      job: { include: { company: { select: { name: true } } } },
    },
  });

  return jsonOk(application, 201);
}
