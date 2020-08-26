// tslint:disable
// graphql typescript definitions

declare namespace MyGraphQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    __typename: 'Query';
    comment: IComment | null;
    subcomments: Array<IComment | null> | null;
    post: IPost | null;
    posts: Array<IPost | null> | null;
    getImageUrl: IImageUrl | null;
    topFivePost: Array<IPost | null> | null;
    user: IUser;
    users: Array<IUser | null> | null;
    me: IUser | null;
  }

  interface ICommentOnQueryArguments {
    comment_id?: string | null;
  }

  interface ISubcommentsOnQueryArguments {
    comment_id?: string | null;
  }

  interface IPostOnQueryArguments {
    id?: string | null;
  }

  interface ITopFivePostOnQueryArguments {
    offset?: number | null;
    limit?: number | null;
  }

  interface IUserOnQueryArguments {
    id?: string | null;
    username?: string | null;
  }

  interface IComment {
    __typename: 'Comment';
    id: string;
    text: string | null;
    likes: number | null;
    has_replies: boolean | null;
    deleted: boolean | null;
    user: IUser | null;
    replies: Array<IComment | null> | null;
  }

  interface IUser {
    __typename: 'User';
    id: string;
    username: string | null;
    email: string | null;
    password: string | null;
    email_verified: boolean | null;
    tokenVersion: string | null;
    profile: IUserProfile | null;
    auth: Array<IUser | null> | null;
    follower: IFollowers | null;
    accessToken: string | null;
    refreshToken: string | null;
  }

  interface IUserProfile {
    __typename: 'UserProfile';
    id: string;
    bio: string | null;
    user_id: string | null;
  }

  interface IFollowers {
    __typename: 'Followers';
    id: string;
    user_id: string | null;
    follower_id: string | null;
    following_id: string | null;
  }

  interface IPost {
    __typename: 'Post';
    id: string | null;
    title: string | null;
    body: string | null;
    thumbnail: string | null;
    likes: number | null;
    views: number | null;
    url: string;
  }

  interface IImageUrl {
    __typename: 'ImageUrl';
    public_id: Array<string | null> | null;
  }

  interface IMutation {
    __typename: 'Mutation';
    createComment: IComment | null;
    removeComment: boolean | null;
    editComment: IComment | null;
    createPost: IPost | null;
    editPost: IPost | null;
    removePost: boolean | null;
    likePost: IPost | null;
    unLikePost: IPost | null;
    uploadImage: IUploadedImage | null;
    postView: boolean | null;
    register: IUser;
    login: IUser;
    createProfile: IUserProfile;
    updateProfile: IUserProfile;
    followUser: IFollowers | null;
    unFollowUser: IUser;
    revokeRefreshToken: boolean | null;
    logout: boolean | null;
  }

  interface ICreateCommentOnMutationArguments {
    post_id: string;
    text: string;
    comment_id?: string | null;
  }

  interface IRemoveCommentOnMutationArguments {
    id: string;
  }

  interface IEditCommentOnMutationArguments {
    id: string;
    text: string;
  }

  interface ICreatePostOnMutationArguments {
    title?: string | null;
    body?: string | null;
    tag?: string | null;
  }

  interface IEditPostOnMutationArguments {
    id?: string | null;
    title?: string | null;
    body?: string | null;
  }

  interface IRemovePostOnMutationArguments {
    post_id: string;
  }

  interface ILikePostOnMutationArguments {
    id: string;
  }

  interface IUnLikePostOnMutationArguments {
    id: string;
  }

  interface IUploadImageOnMutationArguments {
    body?: string | null;
  }

  interface IPostViewOnMutationArguments {
    id: string;
  }

  interface IRegisterOnMutationArguments {
    email: string;
    username: string;
    password: string;
  }

  interface ILoginOnMutationArguments {
    email: string;
    password: string;
  }

  interface ICreateProfileOnMutationArguments {
    bio?: string | null;
  }

  interface IUpdateProfileOnMutationArguments {
    bio?: string | null;
  }

  interface IFollowUserOnMutationArguments {
    username: string;
  }

  interface IUnFollowUserOnMutationArguments {
    username: string;
  }

  interface IRevokeRefreshTokenOnMutationArguments {
    userId: string;
  }

  interface IUploadedImage {
    __typename: 'UploadedImage';
    public_id: string;
    version: string;
    width: number;
    height: number;
    format: string;
    created_at: string;
    resource_type: string;
    tags: Array<ITag | null>;
    bytes: number;
    type: string;
    etag: string;
    url: string;
    secure_url: string;
    signature: string;
    original_filename: string;
  }

  interface ITag {
    __typename: 'Tag';
    tag_name: string;
  }

  interface ITransformImageOptionsInput {
    __typename: 'TransformImageOptionsInput';
    width: number | null;
    height: number | null;
    crop: string | null;
  }

  interface IUploadOptionsInput {
    __typename: 'UploadOptionsInput';
    public_id: string | null;
    folder: string | null;
    use_filename: boolean | null;
    unique_filename: boolean | null;
    resource_type: string | null;
    type: string | null;
    access_mode: string | null;
    discard_original_filename: boolean | null;
    overwrite: boolean | null;
    tags: Array<ITagInput | null> | null;
    colors: boolean | null;
    faces: boolean | null;
    quality_analysis: boolean | null;
    cinemegraph_analysis: boolean | null;
    image_metadata: boolean | null;
    phash: boolean | null;
    auto_tagging: boolean | null;
    categorization: Array<ICategoryInput | null> | null;
  }

  interface ITagInput {
    __typename: 'TagInput';
    tag_name: string;
  }

  interface ICategoryInput {
    __typename: 'CategoryInput';
    name: string | null;
  }

  interface IFollowing {
    __typename: 'Following';
    id: string;
    user_id: string | null;
    following_id: string | null;
  }
}

// tslint:enable
