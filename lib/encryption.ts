import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

/**
 * Encrypts data using a password.
 * Derived key using PBKDF2.
 */
export function encrypt(text: string, password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Return salt:iv:tag:encrypted in base64
  return `${salt.toString('base64')}:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

/**
 * Decrypts data using a password.
 */
export function decrypt(encryptedData: string, password: string): string {
  const [saltBase64, ivBase64, tagBase64, encryptedBase64] = encryptedData.split(':');

  if (!saltBase64 || !ivBase64 || !tagBase64 || !encryptedBase64) {
    throw new Error('Invalid encrypted data format.');
  }

  const salt = Buffer.from(saltBase64, 'base64');
  const iv = Buffer.from(ivBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');
  const encrypted = Buffer.from(encryptedBase64, 'base64');

  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
