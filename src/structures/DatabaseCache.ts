import { PrismaDatabase } from './PrismaDatabase';
import type { Afk, Warn } from '@prisma/client'

export class DatabaseCache {

   private models: string[];
   public database: PrismaDatabase;
   public warn: Warn[];
   public afk: Afk[];

   constructor(database: PrismaDatabase) {

      this.database = database;
      this.models = ['warn', 'afk'];

   };

   /**
    * @description Initialize the database's cache
    */
   public async initialize(): Promise<this> {

      for (let model of this.models) {

         this[model] = await this.database[model].findMany();

      };

      return this;

   };

   public async update(model: string): Promise<void> {

      if (!this.models.includes(model))
         throw new Error('The specified model doesn\'t exist.');

      this[model] = await this.database[model].findMany();

   };

};