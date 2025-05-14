// src/utils/encryptionUtils.ts
// Uses Web Crypto API to encrypt/decrypt strings in the browser

const TOKEN_KEY = 'authToken';

async function getKey(): Promise<CryptoKey> {
  const token = localStorage.getItem(TOKEN_KEY) || '';
  // Hash the token to get a 256-bit key
  const encoder = new TextEncoder();
  const tokenData = encoder.encode(token);
  const hash = await crypto.subtle.digest('SHA-256', tokenData);
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptString(text: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    data
  );
  // Prepend IV to ciphertext and convert to hex
  const result = new Uint8Array(iv.byteLength + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.byteLength);
  return Array.from(result)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function decryptString(cipherHex: string): Promise<string> {
  const key = await getKey();
  const bytes = new Uint8Array(cipherHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  const iv = bytes.slice(0, 16);
  const data = bytes.slice(16);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    data
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
