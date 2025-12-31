import { NextRequest, NextResponse } from "next/server";
import { generateHoroscope } from "@/lib/astrology/engine";
import { BirthDetails } from "@/lib/astrology/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, time, location, timezone } = body;

    // Basic validation
    if (
      !date ||
      !time ||
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid input. Required: date, time, location { latitude, longitude }",
        },
        { status: 400 }
      );
    }

    const birthDetails: BirthDetails = {
      date,
      time,
      location,
      timezone: Number(timezone) || 0, // Default to UTC if missing
    };

    const horoscopeData = await generateHoroscope(birthDetails);

    return NextResponse.json(horoscopeData);
  } catch (error: any) {
    console.error("Horoscope Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate horoscope", details: error.message },
      { status: 500 }
    );
  }
}
