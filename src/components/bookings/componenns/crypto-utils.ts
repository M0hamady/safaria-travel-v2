// crypto-utils.ts
export interface EncryptionResult {
  encrypted: string;
  iv: string;
}

/**
 * Encrypts a string using AES-GCM with a password-derived key
 * @param text The text to encrypt
 * @param password Password for key derivation
 * @returns Promise resolving to base64 encoded encrypted data with IV
 */
export async function encryptString(
  text: string,
  password: string = 'default-password'
): Promise<string> {
  try {
    // Convert password to key
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'), // Should be random in production
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoder.encode(text)
    );

    // Combine iv and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64 for easy storage/transmission
    // Fixed: Using Array.from instead of spread operator
    return btoa(String.fromCharCode.apply(null, Array.from(combined)));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypts a string encrypted with encryptString
 * @param encryptedText Base64 encoded encrypted data with IV
 * @param password Password used for encryption
 * @returns Promise resolving to decrypted string
 */
export async function decryptString(
  encryptedText: string,
  password: string = 'default-password'
): Promise<string | null> {
  try {
    // Convert from base64
    const binaryString = atob(encryptedText);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Extract iv and encrypted data
    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    // Convert password to key
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'), // Must match encryption salt
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}