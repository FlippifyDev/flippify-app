import { linkTracker } from '@/services/firebase/link-tracker';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { ref } = await request.json();

        if (ref) {
            await linkTracker(ref);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Missing ref' }, { status: 400 });
    } catch (error) {
        console.error('Error updating link count:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}