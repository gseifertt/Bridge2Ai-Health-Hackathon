const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ScreeningPayload {
  age: number;
  sex_at_birth: string;
  allergies: boolean;
  respiratory_disease: boolean;
  zip_code: string;
}

export interface ScreeningResponse {
  screeningId: number;
}

export interface AudioResponse {
  message: string;
  processed_audio: string;
  disease_risk: 'YES' | 'NO';
}

export interface AirQualityResponse {
  aqi: number;
  pm2_5: number;
  pm10: number;
  co: number;
}

export async function createScreening(data: ScreeningPayload): Promise<ScreeningResponse> {
  const res = await fetch(`${BASE_URL}/screening`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Screening failed: ${res.statusText}`);
  return res.json();
}

export async function uploadAudio(audioBlob: Blob): Promise<AudioResponse> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  const res = await fetch(`${BASE_URL}/audio/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Audio upload failed: ${res.statusText}`);
  return res.json();
}

export async function fetchAirQuality(zip: string): Promise<AirQualityResponse> {
  const res = await fetch(`${BASE_URL}/air-quality?zip=${encodeURIComponent(zip)}`);
  if (!res.ok) throw new Error(`Air quality fetch failed: ${res.statusText}`);
  return res.json();
}
