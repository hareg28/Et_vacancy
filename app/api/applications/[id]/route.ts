import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonOk, jsonError, forbidden } from '@/lib/api-utils';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole(['EMPLOYER', 'ADMIN']);
  if (!session) return forbidden();

  const { id } = await params;
  const { status } = await request.json();
  const validStatuses = ['PENDING', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'REJECTED'];
  if (!validStatuses.includes(status)) return jsonError('Invalid status');

  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: { include: { company: { include: { employer: true } } } } },
  });
  if (!application) return jsonError('Application not found', 404);

  if (session.user.role === 'EMPLOYER') {
    if (application.job.company.employer.userId !== session.user.id) return forbidden();
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status },
  });

  return jsonOk(updated);
}
