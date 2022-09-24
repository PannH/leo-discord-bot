import { PrismaClient } from '@prisma/client';
import { DatabaseCache } from './DatabaseCache';

export class PrismaDatabase extends PrismaClient {

   public cache: DatabaseCache;

   constructor() {

      super();

      this.cache = new DatabaseCache(this);

   };

};