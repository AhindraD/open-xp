/**
 * Client-Side In-Memory Cryptographic Utilities
 *
 * Implements Web Crypto API (SubtleCrypto) for zero-leak exam paper decryption.
 * The raw plaintext paper NEVER touches localStorage, IndexedDB, or server disks.
 * Decryption happens purely in-memory within the student's browser session.
 */

export interface EncryptedPayload {
  examId: string
  iv: string // base64
  authTag: string // base64
  ciphertext: string // base64
}

/**
 * Decrypts an AES-256-GCM encrypted exam paper in-memory using Web Crypto API.
 *
 * @param plaintextKeyBase64 The base64-encoded 256-bit AES key released by KMS
 * @param encrypted The encrypted payload containing IV, authTag, and ciphertext
 * @returns Decrypted plaintext string
 */
export async function decryptExamPaper(
  plaintextKeyBase64: string,
  encrypted: { iv: string; authTag: string; ciphertext: string },
): Promise<string> {
  // Convert base64 key to ArrayBuffer
  const keyBytes = Uint8Array.from(atob(plaintextKeyBase64), (c) => c.charCodeAt(0))
  const ivBytes = Uint8Array.from(atob(encrypted.iv), (c) => c.charCodeAt(0))
  const authTagBytes = Uint8Array.from(atob(encrypted.authTag), (c) => c.charCodeAt(0))
  const ciphertextBytes = Uint8Array.from(atob(encrypted.ciphertext), (c) => c.charCodeAt(0))

  // Web Crypto AES-GCM expects ciphertext + authTag concatenated
  const combinedCiphertext = new Uint8Array(ciphertextBytes.length + authTagBytes.length)
  combinedCiphertext.set(ciphertextBytes, 0)
  combinedCiphertext.set(authTagBytes, ciphertextBytes.length)

  // Import raw key into Web Crypto
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false, // not extractable
    ['decrypt'],
  )

  // Decrypt in-memory
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
      tagLength: 128, // 16 bytes auth tag
    },
    cryptoKey,
    combinedCiphertext,
  )

  return new TextDecoder().decode(decryptedBuffer)
}

/**
 * Computes a client-side SHA-256 hash for local verification of answer payloads.
 */
export async function sha256Hex(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
