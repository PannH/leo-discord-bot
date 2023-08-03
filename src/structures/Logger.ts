export class Logger {

   /**
    * @description Get a formated timestamp.
    */
   private static get timestamp(): string {

      function format(x: number): string {
         return x < 10 ? `0${x}` : x.toString();
      }

      const date = new Date();

      const d = format(date.getDate());
      const mo = format(date.getMonth() + 1);
      const h = format(date.getHours());
      const min = format(date.getMinutes());
      const s = format(date.getSeconds());
      const ms = format(date.getMilliseconds());

      return `${d}/${mo} ${h}:${min}:${s}.${ms}`;

   }

   /**
    * @description Log a message as a debug message.
    */
   public static debug(message: string): void {

      return void console.log(
         `[\u001b[38;5;6mDEBUG\u001b[0m](\u001b[38;5;8m${this.timestamp}\u001b[0m) ${message}`
      );
      

   }

   /**
    * @description Log a message as a piece of information.
    */
   public static info(message: string): void {

      return void console.log(
         `[\u001b[38;5;12mINFO\u001b[0m](\u001b[38;5;8m${this.timestamp}\u001b[0m) ${message}`
      );

   }

   /**
    * @description Log a message as an error.
    */
   public static error(message: string): void {

      return void console.log(
         `[\u001b[38;5;1mERROR\u001b[0m](\u001b[38;5;8m${this.timestamp}\u001b[0m) ${message}`
      );

   }

   /**
    * @description Log a message as a success message.
    */
   public static success(message: string): void {

      return void console.log(
         `[\u001b[38;5;2mSUCCESS\u001b[0m](\u001b[38;5;8m${this.timestamp}\u001b[0m) ${message}`
      );

   }

   /**
    * @description Log a message as a warning message.
    */
   public static warn(message: string): void {

      return void console.log(
         `[\u001b[38;5;3mWARN\u001b[0m](\u001b[38;5;8m${this.timestamp}\u001b[0m) ${message}`
      );

   }

}