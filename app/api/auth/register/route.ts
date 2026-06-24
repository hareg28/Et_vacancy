import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Check if user already exists in DB
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role || 'JOB_SEEKER',
      }
    });

    // If employer, create employer record and company placeholder
    if (role === 'EMPLOYER') {
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

    console.log('New user registered:', email, 'role:', created.role);

    return NextResponse.json(
      { message: 'User created successfully', userId: created.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
