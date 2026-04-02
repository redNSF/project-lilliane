import { createPool } from '@vercel/postgres';
const pool = createPool();
import { nanoid } from 'nanoid';
import { Brief } from '../types';

export interface ScriptMetadata {
  id: string;
  title: string;
  author_name: string | null;
  has_password: boolean;
  created_at: string;
}

export interface ScriptFull {
  id: string;
  title: string;
  content: string; // Brief as JSON or encrypted string
  author_name: string | null;
  has_password: boolean;
  password_hash: string | null;
  created_at: string;
}

/**
 * Creates the scripts table if it doesn't exist.
 */
export async function setupDatabase() {
  await pool.sql`
    CREATE TABLE IF NOT EXISTS scripts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_name TEXT,
      has_password BOOLEAN DEFAULT FALSE,
      password_hash TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

/**
 * Saves a script to the database.
 */
export async function saveScript(params: {
  title: string;
  content: string;
  author_name?: string;
  has_password?: boolean;
  password_hash?: string | null;
}) {
  const id = nanoid(10);
  const { title, content, author_name = 'Anonymous', has_password = false, password_hash = null } = params;

  await pool.sql`
    INSERT INTO scripts (id, title, content, author_name, has_password, password_hash)
    VALUES (${id}, ${title}, ${content}, ${author_name}, ${has_password}, ${password_hash})
  `;

  return id;
}

/**
 * Fetches script metadata (excluding protected content).
 */
export async function getScriptMetadata(id: string): Promise<ScriptMetadata | null> {
  const { rows } = await pool.sql<ScriptMetadata>`
    SELECT id, title, author_name, has_password, created_at 
    FROM scripts 
    WHERE id = ${id}
  `;

  return rows[0] || null;
}

/**
 * Fetches script full details (including everything).
 * Internal use for unlocking.
 */
export async function getScriptFull(id: string): Promise<ScriptFull | null> {
  const { rows } = await pool.sql<ScriptFull>`
    SELECT * FROM scripts WHERE id = ${id}
  `;

  return rows[0] || null;
}
