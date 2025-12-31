"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HoroscopeData,
  PlanetPosition,
  HouseCusp,
} from "@/lib/astrology/types";

interface HoroscopeReportProps {
  data: HoroscopeData;
}

export function HoroscopeReport({ data }: HoroscopeReportProps) {
  // Helper to format degrees to DMS
  const formatDMS = (deg: number) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d}° ${m}'`;
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Vedic Horoscope Report</h2>
        <p className="text-muted-foreground">KP System</p>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="planets">Planetary Positions</TabsTrigger>
          <TabsTrigger value="houses">Cusps</TabsTrigger>
          <TabsTrigger value="dasa">Dasa</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Rasi Chart (South Indian)</CardTitle>
              <CardDescription>
                Lagna: {data.houses[0].sign}{" "}
                {formatDMS(data.houses[0].longitude)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <RasiChart planets={data.planets} lagna={data.houses[0]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planets">
          <Card>
            <CardHeader>
              <CardTitle>Planetary Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Planet</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead>Sign</TableHead>
                    <TableHead>Nakshatra</TableHead>
                    <TableHead>Sign Lord</TableHead>
                    <TableHead>Star Lord</TableHead>
                    <TableHead>Sub Lord</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.planets.map((p) => (
                    <TableRow key={p.name}>
                      <TableCell className="font-medium">
                        {p.name} {p.isRetrograde ? "(R)" : ""}
                      </TableCell>
                      <TableCell>{formatDMS(p.longitude)}</TableCell>
                      <TableCell>{p.sign}</TableCell>
                      <TableCell>{p.nakshatra}</TableCell>
                      <TableCell>{p.signLord}</TableCell>
                      <TableCell>{p.nakshatraLord}</TableCell>
                      <TableCell>{p.subLord}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="houses">
          <Card>
            <CardHeader>
              <CardTitle>House Cusps</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>House</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead>Sign</TableHead>
                    <TableHead>Nakshatra</TableHead>
                    <TableHead>Sign Lord</TableHead>
                    <TableHead>Star Lord</TableHead>
                    <TableHead>Sub Lord</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.houses.map((h) => (
                    <TableRow key={h.number}>
                      <TableCell className="font-medium">{h.number}</TableCell>
                      <TableCell>{formatDMS(h.longitude)}</TableCell>
                      <TableCell>{h.sign}</TableCell>
                      <TableCell>{h.nakshatra}</TableCell>
                      <TableCell>{h.signLord}</TableCell>
                      <TableCell>{h.nakshatraLord}</TableCell>
                      <TableCell>{h.subLord}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dasa">
          <Card>
            <CardHeader>
              <CardTitle>Vimshottari Dasa</CardTitle>
              <CardDescription>
                Balance at Birth: {data.currentDasa.lord} Dasa ending on{" "}
                {new Date(data.currentDasa.end).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Expandable Dasa list could go here */}
              <p>Current Period Details are calculated relative to birth.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Simple South Indian Chart SVG Visualization
function RasiChart({
  planets,
  lagna,
}: {
  planets: PlanetPosition[];
  lagna: HouseCusp;
}) {
  // 12 Boxes fixed positions
  // Pisces (Top Left) -> Aries -> Taurus -> Gemini (Top Row)
  // Aquarius (Left Col)                      Cancer (Right Col)
  // Capricorn (Left Col)                     Leo (Right Col)
  // Sagittarius (Bot Left) -> Scorpio -> Libra -> Virgo (Bot Row)

  const signs = [
    "Pisces",
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
  ];

  // Map sign to grid position (row, col) 0-3
  // 0: 0,0 | 1: 0,1 | 2: 0,2 | 3: 0,3
  // 11:1,0 |                    4: 1,3
  // 10:2,0 |                    5: 2,3
  // 9: 3,0 | 8: 3,1 | 7: 3,2 | 6: 3,3

  const positions: Record<string, { x: number; y: number }> = {
    Pisces: { x: 0, y: 0 },
    Aries: { x: 1, y: 0 },
    Taurus: { x: 2, y: 0 },
    Gemini: { x: 3, y: 0 },
    Cancer: { x: 3, y: 1 },
    Leo: { x: 3, y: 2 },
    Virgo: { x: 3, y: 3 },
    Libra: { x: 2, y: 3 },
    Scorpio: { x: 1, y: 3 },
    Sagittarius: { x: 0, y: 3 },
    Capricorn: { x: 0, y: 2 },
    Aquarius: { x: 0, y: 1 },
  };

  const cellSize = 80;

  const getCellContent = (sign: string) => {
    const pList = planets
      .filter((p) => p.sign === sign)
      .map((p) => p.name.substring(0, 2));
    const isLagna = lagna.sign === sign;
    const items = [...(isLagna ? ["Lagna"] : []), ...pList];
    return items.join(", ");
  };

  return (
    <div className="border-2 border-primary w-[320px] h-[320px] grid grid-cols-4 grid-rows-4 relative bg-card text-card-foreground">
      {/* Draw grid lines if needed, or rely on div borders */}
      {signs.map((sign) => {
        const pos = positions[sign];
        return (
          <div
            key={sign}
            style={{
              gridColumnStart: pos.x + 1,
              gridRowStart: pos.y + 1,
              border: "1px solid currentColor",
            }}
            className="flex items-center justify-center text-xs p-1 text-center"
          >
            {getCellContent(sign)}
          </div>
        );
      })}

      {/* Central Area Label */}
      <div
        style={{
          gridColumnStart: 2,
          gridColumnEnd: 4,
          gridRowStart: 2,
          gridRowEnd: 4,
        }}
        className="flex items-center justify-center font-bold opacity-20 pointer-events-none"
      >
        RASI
      </div>
    </div>
  );
}
