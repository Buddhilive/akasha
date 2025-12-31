"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BirthDetails } from "@/lib/astrology/types";

interface HoroscopeFormProps {
  onSubmit: (details: any) => void;
  isLoading: boolean;
}

export function HoroscopeForm({ onSubmit, isLoading }: HoroscopeFormProps) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    latitude: "",
    longitude: "",
    timezone: "5.5", // Default IST
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: formData.date,
      time: formData.time,
      location: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      },
      timezone: parseFloat(formData.timezone),
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Enter Birth Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date of Birth</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time of Birth</Label>
            <Input
              id="time"
              name="time"
              type="time"
              required
              step="1"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="0.0001"
                placeholder="e.g. 28.6139"
                required
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="0.0001"
                placeholder="e.g. 77.2090"
                required
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone (Offset from UTC)</Label>
            <Input
              id="timezone"
              name="timezone"
              type="number"
              step="0.5"
              placeholder="e.g. 5.5 for IST"
              required
              value={formData.timezone}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Horoscope"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
