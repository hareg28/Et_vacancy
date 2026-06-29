import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonOk, jsonError, forbidden } from '@/lib/api-utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const job = await prisma.job.findFirst({
    where: {
      id,
      isPublished: true,
      isClosed: false,
    },
    include: {
      company: { select: { id: true, name: true, logoUrl: true, industry: true, location: true } },
      category: { select: { name: true } },
      _count: { select: { applications: true } },
    },
  });

  if (!job) return jsonError('Job not found', 404);
  return jsonOk(job);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole(['EMPLOYER', 'ADMIN']);
  if (!session) return forbidden();

  const { id } = await params;
  const body = await request.json();

  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: { include: { employer: true } } },
  });
  if (!job) return jsonError('Job not found', 404);

  if (session.user.role === 'EMPLOYER') {
    if (job.company.employer.userId !== session.user.id) return forbidden();
  }

  const { isPublished, isClosed, isFeatured } = body;

  const updated = await prisma.job.update({
    where: { id },
    data: {
      ...(typeof isPublished === 'boolean' ? { isPublished } : {}),
      ...(typeof isClosed === 'boolean' ? { isClosed } : {}),
      ...(typeof isFeatured === 'boolean' ? { isFeatured } : {}),
    },
    include: {
      company: { select: { id: true, name: true, logoUrl: true, isApproved: true } },
      _count: { select: { applications: true } },
    },
  });

  return jsonOk(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole(['EMPLOYER', 'ADMIN']);
  if (!session) return forbidden();

  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: { include: { employer: true } } },
  });
  if (!job) return jsonError('Job not found', 404);

  if (session.user.role === 'EMPLOYER' && job.company.employer.userId !== session.user.id) {
    return forbidden();
  }

  await prisma.job.delete({ where: { id } });
  return jsonOk({ success: true });
}
