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
  const { isActive, role } = await request.json();

  if (id === session.user.id && isActive === false) {
    return jsonError('Cannot deactivate your own account');
  }

  const data: { isActive?: boolean; role?: string } = {};
  if (typeof isActive === 'boolean') data.isActive = isActive;
  if (role && ['ADMIN', 'EMPLOYER', 'JOB_SEEKER'].includes(role)) data.role = role;

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  return jsonOk(user);
}
