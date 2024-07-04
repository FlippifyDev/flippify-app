import * as mongoose from 'mongoose';

declare module 'mongoose' {
  namespace Types {
    class Long extends mongoose.Types.Buffer {
      constructor(value: any);
      static fromString(s: string): Long;
    }
  }
}