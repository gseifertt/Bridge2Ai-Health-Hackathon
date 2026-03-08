// Reads VITE_API_URL from .env.local — falls back to localhost for dev
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface AirQualityData {
  aqi: number;
  pm2_5: number;
  pm10: number;
  co: number;
}

export async function createScreening(data: {
  age: number;
  sex_at_birth: string;
  allergies: boolean;
  respiratory_disease: boolean;
  zip_code: string;
}): Promise<{ screeningId: number }> {
  const res = await fetch(`${BASE}/screening`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Screening POST failed: ${res.status}`);
  return res.json();
}

export async function uploadAudio(blob: Blob): Promise<{
  message: string;
  processed_audio: string;
  disease_risk: 'YES' | 'NO';
}> {
  const form = new FormData();
  form.append('audio', blob, 'recording.webm');
  const res = await fetch(`${BASE}/audio/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Audio upload failed: ${res.status}`);
  return res.json();
}

export async function fetchAirQuality(zip: string): Promise<AirQualityData> {
  const res = await fetch(`${BASE}/air-quality?zip=${encodeURIComponent(zip)}`);
  if (!res.ok) throw new Error(`Air quality failed: ${res.status}`);
  return res.json();
}
