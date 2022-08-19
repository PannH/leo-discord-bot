import { PrismaDatabase } from './PrismaDatabase';
import type { User } from '@prisma/client'

export class DatabaseCache {

   private models: string[];
   database: PrismaDatabase;
   user: User[];

   constructor(database: PrismaDatabase) {

      this.database = database;
      this.models = ['user'];

   };

   /**
    * @description Initialize the database's cache
    */
   async initialize(): Promise<this> {

      for (let model of this.models) {

         this[model] = await this.database[model].findMany();

      };

      return this;

   };

   async update(model: string): Promise<void> {

      if (!this.models.includes(model))
         throw new Error('The specified model doesn\'t exist.');

      this[model] = await this.database[model].findMany();

   };

};