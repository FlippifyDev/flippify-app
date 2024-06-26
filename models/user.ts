import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  discordId: string;
  email: string;
  accessToken: string;
}

const UserSchema: Schema = new Schema({
  name: String,
  discordId: String,
  email: String,
  accessToken: {
    type: String,
    set: function(this: IUser, value: string) {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(value, salt);
    },
  },
});

export default mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>('User', UserSchema);
