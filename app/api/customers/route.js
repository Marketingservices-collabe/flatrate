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
    const apiUrl = `${BASE_URL}${separator}type=customers`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 10 } // Fast 10-second automatic cache reload window
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Google API error: ${response.status}` }, { status: 500 });
        }

        const rawData = await response.json();

        // MAP THE RAW GOOGLE SHEET COLUMNS TO MATCH THE EXACT JSON SCHEME
        const formattedPayload = rawData.map(item => {
            return {
                firstName: item["Firstname"] || item["firstname"] || "",
                lastName: item["Lastname"] || item["lastname"] || "",
                addressLine1: item["customer_address"] || item["customer_address_details → address_line_1"] || "",
                country: item["customer_address_details → country"] || "",
                state: item["customer_address_details → state"] || "",
                city: item["customer_address_details → city"] || "",
                zipCode: item["customer_address_details → zipcode"] || "",
                customerUniqueId: item["customer_unique_id"] || "",
                additionalName: item["additional_name"] || "",
                email: item["email"] || "",
                landline: item["landline"] || "",
                mobile: item["cellphone"] || item["mobile"] || "",
                addressLine2: item["customer_address_details → address_line_2"] || "",
                customerType: item["property_types - property_type_id → name"] || ""
            };
        });

        return NextResponse.json(formattedPayload);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}