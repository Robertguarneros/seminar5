import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'users', required: true } // Reference to the User model
});

export default mongoose.model('posts', schema);