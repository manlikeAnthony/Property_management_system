import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  forcePathStyle: true,
});

export class S3StorageService {
  async upload(file: Express.Multer.File, folder: string): Promise<{ url: string; key: string }> {
    const key = `${folder}/${randomUUID()}-${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return {
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key,
    };
  }
  async delete(fileUrl: string): Promise<void> {
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // removes leading "/"

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      }),
    );
  }
}
