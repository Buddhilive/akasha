"use client";

import React, { useState } from "react";
import { HoroscopeForm } from "@/components/horoscope/HoroscopeForm";
import { HoroscopeReport } from "@/components/horoscope/HoroscopeReport";
import { HoroscopeData } from "@/lib/astrology/types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function HoroscopePage() {
  const [reportData, setReportData] = useState<HoroscopeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (details: any) => {
    setIsLoading(true);
    setError(null);
    setReportData(null);

    try {
      const res = await fetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate horoscope");
      }

      setReportData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">
        Akasha Astrology
      </h1>

      {!reportData && (
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center max-w-lg text-muted-foreground">
            <p>Generate your Vedic Horoscope using the KP System.</p>
            <p>Enter your precise birth details below.</p>
          </div>

          {error && (
            <Alert variant="destructive" className="max-w-md">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <HoroscopeForm onSubmit={handleGenerate} isLoading={isLoading} />
        </div>
      )}

      {reportData && (
        <div className="space-y-6">
          <button
            onClick={() => setReportData(null)}
            className="text-sm text-primary hover:underline mb-4"
          >
            ← Generate Another
          </button>
          <HoroscopeReport data={reportData} />
        </div>
      )}
    </div>
  );
}
