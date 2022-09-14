import { Event } from './Event';
import type { EventRunFn } from '../typings/EventRunFn';

export class RESTEvent extends Event {

   public rest: boolean;

   constructor(name: string, runFn: EventRunFn) {

      super(name, runFn);

      this.rest = true;

   };

};