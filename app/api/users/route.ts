// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '../../lib/mongodb';
import { User } from 'app/api/auth-mongodb//userModel';
import { IUser } from 'app/api/auth-mongodb//userModel';



export async function GET() {
  await dbConnect();

  try {
    // Fetch users from the database
    const users: IUser[] = await User.find({}).exec(); // Add .exec() to execute the query
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// Optionally, you can handle other HTTP methods like POST if needed
export async function POST(req: Request) {
  // Handle POST requests here
  // For example, to create a new user
}

export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const { _id, email } = await req.json();

    if (!_id || !email) {
      return NextResponse.json({ error: 'Discord ID and email are required' }, { status: 400 });
    }

    const result = await User.updateOne({ _id }, { $set: { email } });

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No user found or email unchanged' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
  }
}