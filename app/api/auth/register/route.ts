import { NextResponse } from 'next/server';
import { mockUsers, mockCompanies } from '@/lib/mock-data';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password, // In production, use bcrypt.hash(password, 10)
      role: role || 'JOB_SEEKER',
    };
    mockUsers.push(newUser);

    // If employer, create company
    if (role === 'EMPLOYER') {
      const newCompany = {
        id: newUser.id,
        name,
        industry: 'Other',
        location: 'Addis Ababa',
        size: '1-10 employees',
        website: '',
        isVerified: true,
        description: 'A new company hiring on Et_vacancy!',
        rating: 4.0,
        reviews: 0,
        ownerId: newUser.id
      };
      mockCompanies.push(newCompany);
    }

    console.log('New user registered:', email, 'role:', newUser.role);

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser.id },
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
