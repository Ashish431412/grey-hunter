import { prisma } from '../../config/database';
import { encrypt, decrypt } from '../../utils/encryption';

export class SyncService {
  static async push(userId: string, data: any) {
    // Basic sync logic to save encrypted blobs
    const encrypted = encrypt(JSON.stringify(data.payload));
    
    return prisma.encryptedBlob.create({
      data: {
        userId,
        blobKey: data.blobKey,
        encryptedData: encrypted.encryptedData,
        iv: encrypted.iv,
        authTag: encrypted.authTag
      }
    });
  }

  static async pull(userId: string, blobKey: string) {
    const blob = await prisma.encryptedBlob.findUnique({
      where: { userId_blobKey: { userId, blobKey } }
    });
    
    if (!blob) return null;
    
    const decrypted = decrypt(blob.encryptedData, blob.iv, blob.authTag);
    return JSON.parse(decrypted);
  }
}
