import { Request, Response } from 'express';
import { IPost } from '../modules/posts/model';
import PostService from '../modules/posts/service';
import UserService from '../modules/users/service';
import e = require('express');

export class PostController {

    private post_service: PostService = new PostService();
    private user_service: UserService = new UserService();

    public async createPost(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body.title && req.body.content && req.body.author){
                const post_params:IPost = {
                    title: req.body.title,
                    content: req.body.content,
                    author: req.body.author
                };
                const post_data = await this.post_service.createPost(post_params);
                 // Now, you may want to add the created post's ID to the user's array of posts
                await this.user_service.addPostToUser(req.body.author, post_data._id); //
                return res.status(201).json({ message: 'Post created successfully', post: post_data });
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getPost(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const post_filter = { _id: req.params.id };
                // Fetch user
                const post_data = await this.post_service.filterPost(post_filter);
                // Send success response
                return res.status(200).json({ data: post_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async deletePost(req: Request, res: Response) {
        try {
            if (req.params.id) {
                // Delete post
                const delete_details = await this.post_service.deletePost(req.params.id);
                if (delete_details.deletedCount !== 0) {
                    // Send success response if user deleted
                    return res.status(200).json({ message: 'Successful'});
                } else {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'Post not found' });
                }
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing Id' });
            }
        } catch (error) {
            // Catch and handle any errors
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}