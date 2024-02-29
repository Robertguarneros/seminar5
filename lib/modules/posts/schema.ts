import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, ref: 'users', required: true }
});

export default mongoose.model('posts', schema);