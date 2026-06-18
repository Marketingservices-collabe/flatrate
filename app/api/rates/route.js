import { NextResponse } from 'next/server';

export async function GET() {
    const GOOGLE_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!GOOGLE_URL) {
        return NextResponse.json(
            { error: 'Server configuration missing: GOOGLE_APPS_SCRIPT_URL is not set.' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(GOOGLE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            next: { revalidate: 60 } // Caches data for 60 seconds to keep performance super fast
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Google responded with status: ${response.status}` }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}