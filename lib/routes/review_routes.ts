import { Application, Request, Response } from 'express';
import { ReviewController } from '../controllers/reviewController';

export class ReviewRoutes {

    private review_controller: ReviewController = new ReviewController();

    public route(app: Application) {
        
        app.post('/review', (req: Request, res: Response) => {
            this.review_controller.createReview(req, res);
        });

        app.get('/review/:id', (req: Request, res: Response) => {
            this.review_controller.getReview(req, res);
        });

        app.delete('/review/:id', (req: Request, res: Response) => {
            this.review_controller.deleteReview(req, res);
        });

    }
}