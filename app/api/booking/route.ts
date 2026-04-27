import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'submissions');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

interface BookingEntry {
  id: string;
  serviceId: string;
  specialistId: string | null;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

async function readBookings(): Promise<BookingEntry[]> {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeBookings(bookings: BookingEntry[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, specialistId, date, time, clientName, clientPhone, clientEmail, notes } = body;

    if (!serviceId || !date || !time || !clientName?.trim() || !clientPhone?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, date, time, clientName, clientPhone' },
        { status: 400 }
      );
    }

    if (!/^\+?[0-9\s\-()]{7,18}$/.test(clientPhone.trim())) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const entry: BookingEntry = {
      id: `BK-${Date.now()}`,
      serviceId,
      specialistId: specialistId || null,
      date,
      time,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail?.trim() || '',
      notes: notes?.trim() || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const bookings = await readBookings();
    bookings.push(entry);
    await writeBookings(bookings);

    return NextResponse.json({ success: true, bookingId: entry.id });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const bookings = await readBookings();
  return NextResponse.json({ bookings, total: bookings.length });
}
