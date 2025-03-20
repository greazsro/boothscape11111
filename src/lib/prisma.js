// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Export Prisma instance for use in other files
export default prisma;
