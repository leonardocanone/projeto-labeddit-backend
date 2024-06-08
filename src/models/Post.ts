export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes_count: number,
    dislikes_count: number,
    comments_count: number,
    created_at: string,
    updated_at: string
}

export interface PostsDBWithCreatorName {
    id: string,
    creator_id: string,
    content: string,
    likes_count: number,
    dislikes_count: number,
    comments_count: number,
    created_at: string,
    updated_at: string,
    creator_nickname: string
}

export interface PostModel {
    id: string,
    content: string,
    likesCount: number,
    dislikesCount: number,
    commentsCount: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        nickname: string
    }
}

export interface LikeDislikeDB {
    user_id: string,
    post_id: string,
    like: number
  }
  
export enum POST_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
  }

export class Post {
    constructor(
        private id: string,
        private content: string,
        private likesCount: number,
        private dislikesCount: number,
        private commentsCount: number,
        private createdAt: string,
        private updatedAt: string,
        private creatorId: string,
        private creatorNickname: string
    ) { }

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getLikesCount(): number {
        return this.likesCount
    }

    public setLikesCount(value: number): void {
        this.likesCount = value
    }

    public addLike = (): void => {
        this.likesCount++
    }

    public removeLike = (): void => {
        this.likesCount--
    }

    public getDislikesCount(): number {
        return this.dislikesCount
    }

    public setDislikesCount(value: number): void {
        this.dislikesCount = value
    }

    public addDislike = (): void => {
        this.dislikesCount++
    }

    public removeDislike = (): void => {
        this.dislikesCount--
    }

    public getCommentsCount(): number {
        return this.commentsCount
    }

    public setCommentsCount(value: number): void {
        this.commentsCount = value
    }

    public increaseCommentsCount = (): void => {
        this.commentsCount += 1
      }
  
    public decreaseCommentsCount = (): void => {
        this.commentsCount -= 1
      }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public getUpdatedAt(): string {
        return this.updatedAt
    }

    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }

    public getCreatorId(): string {
        return this.creatorId
    }

    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public getCreatorNickname(): string {
        return this.creatorNickname
    }

    public setCreatorNickname(value: string): void {
        this.creatorNickname = value
    }

    public toDBModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            likes_count: this.likesCount,
            dislikes_count: this.dislikesCount,
            comments_count: this.commentsCount,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }

    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            likesCount: this.likesCount,
            dislikesCount: this.dislikesCount,
            commentsCount: this.commentsCount,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creatorId,
                nickname: this.creatorNickname
            }   
        }
    }
}
