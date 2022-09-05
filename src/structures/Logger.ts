export class Logger {

   /**
    * @description Get a formated timestamp.
    */
   private static get timestamp(): string {

      function format(x: number): string {
         return x < 10 ? `0${x}` : x.toString();
      };

      let date = new Date();

      let d = format(date.getDate());
      let mo = format(date.getMonth() + 1);
      let h = format(date.getHours());
      let min = format(date.getMinutes());
      let s = format(date.getSeconds());
      let ms = format(date.getMilliseconds());

      return `${d}/${mo} ${h}:${min}:${s}.${ms}`;

   };

   /**
    * @description Log a message as a debug message.
    */
   public static debug(message: string): void {

      return void console.log(
         `[\u001b[38;5;6mDEBUG\u001b[0m](\u001b[38;5;8m${this.timestamp}\u001b[0m) ${message}`
      );

   };

   /**
    * @description Log a message as an error.
    */
   public static error(message: string): void {

      return void console.log(
         `[\u001b[38;5;1mERROR\u001b[0m](\u001b[38;5;8m${this.timestamp}\u001b[0m) ${message}`
      );

   };

   /**
    * @description Log a message as a success message.
    */
   public static success(message: string): void {

      return void console.log(
         `[\u001b[38;5;2mSUCCESS\u001b[0m](\u001b[38;5;8m${this.timestamp}\u001b[0m) ${message}`
      );

   };

};