from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db, get_current_user
import models
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

posts_router = APIRouter()

class PostCreate(BaseModel):
    title: str
    content: str

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    author: str
    created_at: datetime
    likes_count: int
    is_liked: Optional[bool] = False

class ReplyResponse(BaseModel):
    id: int
    content: str
    author: str
    reply_to: Optional[str] = None  # 添加回复目标用户名
    created_at: datetime
    parent_id: int

class CommentResponse(BaseModel):
    id: int
    content: str
    author: str
    created_at: datetime
    parent_id: Optional[int] = None
    replies: List[ReplyResponse] = []

class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None
    reply_to: Optional[str] = None  # 添加回复目标用户名

@posts_router.post("/create", response_model=PostResponse)
async def create_post(
    post: PostCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_post = models.Post(
        title=post.title,
        content=post.content,
        author_id=current_user.id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    return {
        "id": new_post.id,
        "title": new_post.title,
        "content": new_post.content,
        "author": current_user.username,
        "created_at": new_post.created_at,
        "likes_count": 0,
        "is_liked": False
    }

@posts_router.get("/", response_model=List[PostResponse])
async def get_posts(
    skip: int = 0,
    limit: int = 10,
    current_user: Optional[models.User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        posts = db.query(models.Post).offset(skip).limit(limit).all()
        return [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "author": post.author.username,
                "created_at": post.created_at,
                "likes_count": db.query(models.Like).filter(models.Like.post_id == post.id).count(),
                "is_liked": current_user and db.query(models.Like).filter(
                    models.Like.post_id == post.id,
                    models.Like.user_id == current_user.id
                ).first() is not None
            }
            for post in posts
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@posts_router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int, 
    current_user: Optional[models.User] = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="帖子不存在")
    
    likes_count = db.query(models.Like).filter(models.Like.post_id == post_id).count()
    is_liked = False
    
    if current_user:
        is_liked = db.query(models.Like).filter(
            models.Like.post_id == post_id,
            models.Like.user_id == current_user.id
        ).first() is not None
    
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "author": post.author.username,
        "created_at": post.created_at,
        "likes_count": likes_count,
        "is_liked": is_liked
    }

@posts_router.post("/{post_id}/like")
async def like_post(
    post_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="帖子不存在")
    
    existing_like = db.query(models.Like).filter(
        models.Like.post_id == post_id,
        models.Like.user_id == current_user.id
    ).first()
    
    if existing_like:
        db.delete(existing_like)
        action = "unlike"
    else:
        new_like = models.Like(post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        action = "like"
    
    db.commit()
    return {"action": action}

@posts_router.get("/search")
async def search_posts(
    query: str,
    db: Session = Depends(get_db)
):
    posts = db.query(models.Post).filter(
        models.Post.title.ilike(f"%{query}%") |
        models.Post.content.ilike(f"%{query}%")
    ).all()
    return posts

@posts_router.post("/{post_id}/comments", response_model=CommentResponse)
async def create_comment(
    post_id: int,
    comment: CommentCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="帖子不存在")

    db_comment = models.Comment(
        content=comment.content,
        post_id=post_id,
        user_id=current_user.id,
        parent_id=comment.parent_id,
        reply_to=comment.reply_to  # 添加回复目标
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    return {
        "id": db_comment.id,
        "content": db_comment.content,
        "author": current_user.username,
        "created_at": db_comment.created_at,
        "parent_id": db_comment.parent_id
    }

@posts_router.get("/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(post_id: int, db: Session = Depends(get_db)):
    # 获取主评论
    comments = db.query(models.Comment).filter(
        models.Comment.post_id == post_id,
        models.Comment.parent_id == None
    ).order_by(models.Comment.created_at.desc()).all()

    result = []
    for comment in comments:
        # 获取每个主评论的回复
        replies = db.query(models.Comment).filter(
            models.Comment.parent_id == comment.id
        ).order_by(models.Comment.created_at.asc()).all()

        result.append({
            "id": comment.id,
            "content": comment.content,
            "author": comment.user.username,
            "created_at": comment.created_at,
            "parent_id": comment.parent_id,
            "replies": [{
                "id": reply.id,
                "content": reply.content,
                "author": reply.user.username,
                "reply_to": reply.reply_to,  # 添加回复目标
                "created_at": reply.created_at,
                "parent_id": reply.parent_id
            } for reply in replies]
        })
    
    return result