import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

const allowedRoles = new Set(['JOB_SEEKER', 'EMPLOYER']);

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || String(name).trim().length < 2) {
      return NextResponse.json({ error: 'Full name must be at least 2 characters' }, { status: 400 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (String(password).length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const requestedRole = role || 'JOB_SEEKER';
    if (!allowedRoles.has(requestedRole)) {
      return NextResponse.json({ error: 'Choose either Job Seeker or Employer registration' }, { status: 400 });
    }

    // Check if user already exists in DB
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const created = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashed,
        role: requestedRole,
      }
    });

    // If employer, create employer record and company placeholder
    if (requestedRole === 'EMPLOYER') {
      const employer = await prisma.employer.create({
        data: { userId: created.id }
      });

      await prisma.company.create({
        data: {
          employerId: employer.id,
          name: name || 'New Company',
          industry: 'Other',
          location: 'Addis Ababa',
          size: '1-10 employees',
          isApproved: false,
        }
      });
    }

    console.log('New user registered:', normalizedEmail, 'role:', created.role);

    return NextResponse.json(
      { message: 'User created successfully', userId: created.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}
