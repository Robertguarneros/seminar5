export interface IPost {
    title: string;
    content: string;
    author: string; // Reference to the User collection
}