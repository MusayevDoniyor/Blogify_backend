export interface ICreatePostDTO {
  blog_id: number;
  owner_id: number;
  title: string;
  content: string;
}

export interface IUpdatePostDTO {
  post_id: number;
  owner_id: number;
  title: string;
  content: string;
}

export interface IDeletePostDTO {
  post_id: number;
  owner_id: number;
}
