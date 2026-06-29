import { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/auth';
import { jsonOk, jsonError, unauthorized, forbidden } from '@/lib/api-utils';

const jobInclude = {
  company: { select: { id: true, name: true, logoUrl: true, isApproved: true, industry: true, location: true } },
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { applications: true } },
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mine = searchParams.get('mine') === 'true';
  const all = searchParams.get('all') === 'true';

  if (all) {
    const session = await requireRole(['ADMIN']);
    if (!session) return forbidden();

    const jobs = await prisma.job.findMany({
      include: jobInclude,
      orderBy: { createdAt: 'desc' },
    });
    return jsonOk(jobs);
  }

  if (mine) {
    const session = await requireRole(['EMPLOYER', 'ADMIN']);
    if (!session) return unauthorized();

    if (session.user.role === 'ADMIN') {
      const jobs = await prisma.job.findMany({
        include: jobInclude,
        orderBy: { createdAt: 'desc' },
      });
      return jsonOk(jobs);
    }

    const employer = await prisma.employer.findUnique({
      where: { userId: session.user.id },
      include: { company: true },
    });
    if (!employer?.company) return jsonOk([]);

    const jobs = await prisma.job.findMany({
      where: { companyId: employer.company.id },
      include: jobInclude,
      orderBy: { createdAt: 'desc' },
    });
    return jsonOk(jobs);
  }

  const jobs = await prisma.job.findMany({
    where: {
      isPublished: true,
      isClosed: false,
    },
    include: jobInclude,
    orderBy: { createdAt: 'desc' },
  });

  return jsonOk(jobs);
}

export async function POST(request: Request) {
  const session = await requireRole(['EMPLOYER', 'ADMIN']);
  if (!session) return unauthorized();

  const body = await request.json();
  const {
    title, description, requirements, benefits, location, salary,
    jobType, experienceLevel, isRemote, deadline, categoryName, companyId,
    isFeatured,
  } = body;

  if (!title || !description) {
    return jsonError('Title and description are required');
  }

  let resolvedCompanyId = typeof companyId === 'string' ? companyId : undefined;

  if (session.user.role === 'EMPLOYER') {
    const employer = await prisma.employer.findUnique({
      where: { userId: session.user.id },
      include: { company: true },
    });
    if (!employer?.company) return jsonError('Company profile not found', 404);
    resolvedCompanyId = employer.company.id;
  } else if (!resolvedCompanyId) {
    let platformEmployer = await prisma.employer.findFirst({
      where: { user: { role: 'ADMIN' } },
      include: { company: true },
    });
    if (!platformEmployer?.company) {
      const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!adminUser) return jsonError('No admin account found', 404);
      platformEmployer = await prisma.employer.create({
        data: {
          userId: adminUser.id,
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
    resolvedCompanyId = platformEmployer!.company!.id;
  }

  let categoryId: string | undefined;
  if (categoryName) {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await prisma.jobCategory.upsert({
      where: { slug },
      create: { name: categoryName, slug },
      update: {},
    });
    categoryId = category.id;
  }

  if (!resolvedCompanyId) return jsonError('Company profile not found', 404);

  const company = await prisma.company.findUnique({ where: { id: resolvedCompanyId } });
  const autoPublish = true;
  const data: Prisma.JobUncheckedCreateInput = {
    companyId: resolvedCompanyId,
    title,
    description,
    requirements: requirements || null,
    benefits: benefits || null,
    location: location || null,
    salary: salary || null,
    jobType: jobType || 'FULL_TIME',
    experienceLevel: experienceLevel || 'MID',
    isRemote: !!isRemote,
    isFeatured: !!isFeatured,
    isPublished: !!autoPublish,
    deadline: deadline ? new Date(deadline) : null,
    ...(categoryId ? { categoryId } : {}),
  };

  const job = await prisma.job.create({
    data,
    include: jobInclude,
  });

  return jsonOk(job, 201);
}
