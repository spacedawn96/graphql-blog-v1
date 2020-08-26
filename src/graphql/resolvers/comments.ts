import { IResolvers, AuthenticationError, ApolloError } from 'apollo-server';
import { getRepository } from 'typeorm';
import Post from '../../entity/Post';
import Comment from '../../entity/Comment';
import PostScore from '../../entity/PostScore';

export const resolvers: IResolvers = {
  Comment: {
    user: (parent: Comment, _: any, { loaders }) => {
      if (parent.deleted) {
        return null;
      }
      if (parent.user) return parent.user;
      const user = loaders.user.load(parent.user_id);
      return user;
    },
    replies: async (parent: Comment, args: any) => {
      if (!parent.has_replies) return [];
      const comments = await getRepository(Comment).find({
        where: {
          reply: parent.id,
          deleted: false,
        },
        order: {
          created_at: 'ASC',
        },
      });
      return comments;
    },
  },
  Query: {
    comment: async (parent: any, { __ }) => {
      try {
        const comment = await getRepository(Comment);

        const Comments = await comment.find({
          order: {
            created_at: 'ASC',
          },
        });
        return Comments;
      } catch (err) {
        throw Error(err);
      }
    },
    subcomments: async (parent: any, { comment_id }) => {
      const comments = await getRepository(Comment).find({
        where: {
          reply: comment_id,
        },
        order: {
          created_at: 'ASC',
        },
      });
      return comments;
    },
  },

  Mutation: {
    createComment: async (_, args, { req }) => {
      const getPost = getRepository(Post);
      const getComment = getRepository(Comment) as any;
      const comment = new Comment() as any;
      if (!req.userId) {
        throw new AuthenticationError('plz login');
      }

      const post = await getPost.findOne({
        where: {
          id: args.post_id,
        },
      });

      if (!post) {
        throw new ApolloError('Post not found');
      }

      if (args.comment_id) {
        const commentReply = await getComment.findOne(args.comment_id);

        if (!commentReply) {
          throw new ApolloError("there's no comment");
        }

        comment.reply = args.comment_id;
        commentReply.has_replies = true;
        await getComment.save(commentReply);
      }

      comment.user_id = req.userId;
      comment.text = args.text;
      comment.post_id = args.post_id;

      await getComment.save(comment);

      return comment;
    },

    removeComment: async (_, args, { req }) => {
      if (!req.userId) {
        throw new AuthenticationError('plz login');
      }

      const getComment = getRepository(Comment) as any;
      const comment = await getComment.findOne(args.id);

      if (!comment) {
        throw new ApolloError('Comment not found');
      }
      if (req.userId !== comment.user_id) {
        throw new ApolloError('This is not your comment');
      }
      comment.deleted = true;

      await getComment.remove(comment);

      const getPostScore = getRepository(PostScore);
      const CommentScore = await getPostScore
        .createQueryBuilder()
        .where('post_id = :postId', { postId: comment.post_id })
        .andWhere('user_id = :userId', { userId: req.userId })
        .andWhere("type = 'COMMENT'")
        .orderBy('created_at', 'DESC')
        .getOne();

      await getPostScore.delete(CommentScore!.id);

      return true;
    },
    editComment: async (_, args, { req }) => {
      if (!req.userId) {
        throw new AuthenticationError('plz login');
      }
      const getComment = getRepository(Comment) as any;

      const comment = await getComment.findOne(args.id);

      if (!comment) {
        throw new ApolloError('Comment not found');
      }
      comment.text = args.text;

      await getComment.save(comment);

      return comment;
    },
  },
};
