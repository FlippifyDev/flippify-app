import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	console.log('Accessing /api/token');
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	return NextResponse.json({ accessToken: session.accessToken });
}
