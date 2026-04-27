import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'submissions');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

interface ContactEntry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

async function readContacts(): Promise<ContactEntry[]> {
  try {
    const data = await fs.readFile(CONTACTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeContacts(contacts: ContactEntry[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    const entry: ContactEntry = {
      id: `CT-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    const contacts = await readContacts();
    contacts.push(entry);
    await writeContacts(contacts);

    return NextResponse.json({ success: true, contactId: entry.id });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
