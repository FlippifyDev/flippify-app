import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongo/client';
import { User } from '@/src/models/mongodb/users';

export async function GET() {
	await connectDB();  // Ensure MongoDB connection

	try {
		const users = await User.find({}).exec();
		return NextResponse.json({ users });
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest) {
	await connectDB();  // Ensure MongoDB connection

	try {
		const { _id, email, subscriptions, referral } = await req.json();
		if (!_id || !email || !subscriptions || !referral) {
			return NextResponse.json({ error: 'User ID, email, and subscriptions are required' }, { status: 400 });
		}

		const result = await User.updateOne(
			{ _id },
			{
				$set: {
					email,
					subscriptions,
					referral
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
