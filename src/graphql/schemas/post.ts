import { gql } from 'apollo-server';

module.exports = gql`
  scalar Date
  type TransformImageOptionsInput {
    width: Int
    height: Int
    crop: String
  }
  type Post {
    id: ID
    title: String
    body: String
    thumbnail: String
    likes: Int
    views: Int
    url: String!
    user: User
    released_at: Date
    created_at: Date
    updated_at: Date
    comments: [Comment]
    name: String
    tags: Tag
    post_id: String
    liked: Boolean
  }
  type User {
    id: ID!
    username: String
    email: String
    password: String
    email_verified: Boolean
    tokenVersion: String
  }
  type UploadOptionsInput {
    public_id: String
    folder: String
    use_filename: Boolean
    unique_filename: Boolean
    resource_type: String
    type: String
    access_mode: String
    discard_original_filename: Boolean
    overwrite: Boolean
    tags: [TagInput]
    colors: Boolean
    faces: Boolean
    quality_analysis: Boolean
    cinemegraph_analysis: Boolean
    image_metadata: Boolean
    phash: Boolean
    auto_tagging: Boolean
    categorization: [CategoryInput]
  }
  type CategoryInput {
    name: String
  }
  type TagInput {
    tag_name: String!
  }
  type Tag {
    name: String!
  }
  type UploadedImage {
    public_id: String!
    version: String!
    width: Int!
    height: Int!
    format: String!
    created_at: String!
    resource_type: String!
    tags: [Tag]!
    bytes: Int!
    type: String!
    etag: String!
    url: String!
    secure_url: String!
    signature: String!
    original_filename: String!
  }
  type ImageUrl {
    public_id: [String]
    url: String
  }
  type Comment {
    id: ID!
    text: String
    likes: Int
    has_replies: Boolean
    deleted: Boolean
    user: User
    replies: [Comment]
  }
  type Query {
    post(id: ID): Post
    posts: [Post]
    getImageUrl: ImageUrl
    topFivePost(offset: Int, limit: Int): [Post]
  }
  type Mutation {
    createPost(
      title: String
      body: String
      tags: String
      thumbnail: String
    ): Post
    editPost(id: String, title: String, body: String): Post
    removePost(id: String!): Boolean
    likePost(id: String!): Post
    unLikePost(id: String!): Post
    uploadImage(body: String): UploadedImage
    postView(id: String!): Boolean
  }
`;
