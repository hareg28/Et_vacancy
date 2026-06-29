import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { jsonOk, jsonError, forbidden } from '@/lib/api-utils';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole(['ADMIN']);
  if (!session) return forbidden();

  const { id } = await params;
  const { isApproved } = await request.json();

  if (typeof isApproved !== 'boolean') return jsonError('isApproved must be a boolean');

  const company = await prisma.company.update({
    where: { id },
    data: { isApproved },
  });

  if (isApproved) {
    await prisma.job.updateMany({
      where: { companyId: id, isClosed: false },
      data: { isPublished: true },
    });
  }

  return jsonOk(company);
}
