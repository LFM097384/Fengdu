from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db, get_current_user
import models
from pydantic import BaseModel
from typing import Optional

# 移除prefix,由main.py统一管理前缀
router = APIRouter()

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

class LevelInfo(BaseModel):
    current_level: int
    total_exp: int
    current_level_exp: int
    exp_needed: int
    progress: float

@router.get("/")  # 改为显式的根路径
async def get_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print(f"正在处理个人资料请求...")  # 添加详细日志
    try:
        user = db.query(models.User).filter(
            models.User.id == current_user.id
        ).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
            
        print(f"成功获取用户资料: {user.username}")
        return {
            "username": user.username,
            "email": user.email,
            "experience": user.experience,
            "level": user.level
        }
    except Exception as e:
        print(f"获取资料错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取资料失败: {str(e)}"
        )

@router.post("/add-experience/{exp}")
async def add_experience(
    exp: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if exp < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="经验值不能为负"
        )
    
    current_user.experience += exp
    new_level = (current_user.experience // 100) + 1
    
    if new_level != current_user.level:
        current_user.level = new_level
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="数据库错误"
        )
    
    return {
        "message": "经验值添加成功",
        "experience": current_user.experience,
        "level": current_user.level
    }

@router.get("/level-info", response_model=LevelInfo)
async def get_level_info(
    current_user: models.User = Depends(get_current_user)
):
    exp_needed = current_user.level * 100
    current_level_exp = current_user.experience % exp_needed
    progress = (current_level_exp / exp_needed) * 100
    
    return {
        "current_level": current_user.level,
        "total_exp": current_user.experience,
        "current_level_exp": current_level_exp,
        "exp_needed": exp_needed,
        "progress": progress
    }

@router.put("/update")
async def update_profile(
    user_update: UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.username:
        if db.query(models.User).filter(
            models.User.username == user_update.username,
            models.User.id != current_user.id
        ).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="用户名已存在"
            )
        current_user.username = user_update.username
        
    if user_update.email:
        if db.query(models.User).filter(
            models.User.email == user_update.email,
            models.User.id != current_user.id
        ).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="邮箱已存在"
            )
        current_user.email = user_update.email

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="更新失败"
        )
    
    return {"message": "更新成功"}