import { gql } from 'apollo-server';

module.exports = gql`
  type Comment {
    id: ID!
    text: String
    likes: Int
    has_replies: Boolean
    deleted: Boolean
    user: User
    post_id: String
    reply: String
    replies: [Comment]
    comment: String
  }
  type Query {
    comment: [Comment]
    subcomments(comment_id: ID): [Comment]
  }
  type Mutation {
    createComment(post_id: String, text: String, comment_id: String): Comment
    removeComment(id: ID!): Boolean
    editComment(id: ID!, text: String!): Comment
  }
`;