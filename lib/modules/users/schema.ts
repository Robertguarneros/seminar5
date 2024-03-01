import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        first_name: String,
        middle_name: String,
        last_name: String
    },
    email: String,
    phone_number: String,
    gender: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'posts' }] // Array of ObjectIds referencing the Post model
    }
);

export default mongoose.model('users', schema);
