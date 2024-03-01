import { IUser } from './model';
import users from './schema';
import { Types } from 'mongoose';

export default class UserService {
    
    public async createUser(user_params: IUser): Promise<IUser> {
        try {
            const session = new users(user_params);
            const result = await session.save();
            // Convert _id to string
            const newUser: IUser = { ...result.toObject(), _id: result._id.toString() };
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    public async filterUser(query: any): Promise<IUser | null> {
        try {
            return await users.findOne(query);
        } catch (error) {
            throw error;
        }
    }

    public async updateUser(user_params: IUser): Promise<void> {
        try {
            const query = { _id: user_params._id };
            await users.findOneAndUpdate(query, user_params);
        } catch (error) {
            throw error;
        }
    }

    public async deleteUser(_id: string): Promise<{ deletedCount: number }> {
        try {
            const query = { _id: _id };
            return await users.deleteOne(query);
        } catch (error) {
            throw error;
        }
    }

    public async addPostToUser(userId: Types.ObjectId, postId: Types.ObjectId): Promise<void> {
        try {
            // Retrieve the user document by ID
            const user = await users.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Add the post ID to the user's array of posts
            user.posts.push(postId);

            // Save the updated user document
            await user.save();
        } catch (error) {
            throw error;
        }
    }

    public async populateUserPosts(query: any): Promise<IUser | null> {
        try {
            // Find the user document and populate the 'posts' field
            const user = await users.findOne(query).populate('posts').exec();
            if (!user) {
                return null;
            }
            // Convert _id to string
            const populatedUser: IUser = {
                ...user.toObject(),
                _id: user._id.toString()
            };
            return populatedUser;
        } catch (error) {
            throw error;
        }
    }

}