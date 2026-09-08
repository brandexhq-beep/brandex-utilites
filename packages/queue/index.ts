import { Queue, Worker, QueueEvents, ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';

// Shared Redis connection for BullMQ
export const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export const redis = new IORedis(connection);

export const QUEUE_NAMES = {
  PDF: 'pdf-queue',
  IMAGE: 'image-queue',
  VIDEO: 'video-queue',
  ARCHIVE: 'archive-queue',
  DOCUMENT: 'document-queue',
  OCR: 'ocr-queue',
  CLEANUP: 'cleanup-queue',
} as const;

export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];

// Factory to create queues
export function createQueue(name: QueueName) {
  return new Queue(name, { connection });
}

// Factory to create workers
export function createWorker(name: QueueName, processor: any, options = {}) {
  return new Worker(name, processor, { connection, ...options });
}

// Factory to listen to queue events
export function createQueueEvents(name: QueueName) {
  return new QueueEvents(name, { connection });
}

export { Queue, Worker, QueueEvents };
