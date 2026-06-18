import { NextResponse } from 'next/server';

export async function GET() {
    const BASE_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!BASE_URL) {
        return NextResponse.json(
            { error: 'Server configuration missing: GOOGLE_APPS_SCRIPT_URL is not set.' },
            { status: 500 }
        );
    }

    const separator = BASE_URL.includes('?') ? '&' : '?';
    const apiUrl = `${BASE_URL}${separator}type=rates`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 10 } // Fast 10-second cache reload window
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Google API error: ${response.status}` }, { status: 500 });
        }

        const rawData = await response.json();

        // MAP THE DATA TO MATCH THE EXACT JSON PAYLOAD FORMAT
        const formattedPayload = rawData.map(item => {
            return {
                code: item["code"] || "",
                identifier: "NA",
                description: item["description"] || "",
                time: "NA",
                rate: item["sellPrice"] ? Number(item["sellPrice"]) : 0.00,
                sectionType: item["section"] || "",
                active: String(item["isActive"]).toUpperCase() === 'TRUE' // Converts string to proper true/false boolean
            };
        });

        return NextResponse.json(formattedPayload);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}