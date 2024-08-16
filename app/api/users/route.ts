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
    // Parse the request body to get _id, email, and subscriptions
    const { _id, email, subscriptions } = await req.json();

    // Validate the required fields
    if (!_id || !email || !subscriptions) {
      return NextResponse.json({ error: 'User ID, email, and subscriptions are required' }, { status: 400 });
    }

    // Update the user's email and subscriptions
    const result = await User.updateOne(
      { _id },
      {
        $set: {
          email,
          subscriptions, // Update subscriptions with the new roles array
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No user found or no changes detected' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}