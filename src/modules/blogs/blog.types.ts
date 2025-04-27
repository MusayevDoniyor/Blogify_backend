export interface IBlog {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  created_at: Date;
}

export interface ICreateBlogDTO {
  title: string;
  description: string;
  owner_id: number;
}

export interface IUpdateBlogDTO {
  title: string;
  description?: string;
  blog_id: number;
  owner_id: number;
}

export interface IDeleteBlogDTO {
  blog_id: number;
  owner_id: number;
}

export interface IJoinLeaveBlogDTO {
  blog_id: number;
  user_id: number;
}
