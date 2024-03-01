import * as mongoose from 'mongoose';

export interface IPost {
    _id?: mongoose.Types.ObjectId; // Optional _id field
    title: string;
    content: string;
    author: mongoose.Types.ObjectId; // Reference to the User collection
}