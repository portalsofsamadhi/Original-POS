export interface BlogPost {
    id: string;
    title: string;
    content: string;
    author: string;
    tags: string[];
    date: string;
    summary?: string;
    imageUrl: string;
    excerpt: string;
    category: string;
    likes: number;
    readTime: string;
    filename?: string;
}
