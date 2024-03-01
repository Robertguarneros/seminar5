import { Application, Request, Response } from 'express';
import { PostController } from '../controllers/postController';

export class PostRoutes {

    private post_controller: PostController = new PostController();

    public route(app: Application) {
        
        app.post('/post', (req: Request, res: Response) => {
            this.post_controller.createPost(req, res);
        });

        app.get('/post/:id', (req: Request, res: Response) => {
            this.post_controller.getPost(req, res);
        });

        app.delete('/post/:id', (req: Request, res: Response) => {
            this.post_controller.deletePost(req, res);
        });

    }
}