import { MultipartValue } from '@fastify/multipart';
import { Readable } from 'stream';

export interface MultipartFile {
    fieldname: string
    filename: string
    encoding: string
    mimetype: string
    file: Readable
    fields: Record<string, MultipartValue>
    toBuffer: () => Promise<Buffer>;
}
  