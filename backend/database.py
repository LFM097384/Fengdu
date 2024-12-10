from sqlalchemy.orm import Session
import models, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from datetime import datetime

def get_db():
    db = models.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# JWT配置
JWT_SECRET = "your-secret-key"  # 生产环境应该使用环境变量
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def decode_token(token: str) -> Optional[dict]:
    try:
        print(f"解析token: {token[:20]}...")  # 调试日志
        
        # 不再检查Bearer前缀，因为FastAPI的OAuth2PasswordBearer已经处理了
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        print(f"解析后的payload: {payload}")  # 调试日志
        
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无效的token格式: 缺少sub字段"
            )
            
        return {"email": email}
    except Exception as e:
        print(f"token解析错误: {str(e)}")  # 调试日志
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"token验证失败: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    try:
        payload = decode_token(token)
        email = payload["email"]
        
        print(f"查找用户: {email}")  # 调试日志
        user = db.query(models.User).filter(models.User.email == email).first()
        
        if not user:
            print(f"用户不存在: {email}")  # 调试日志
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"用户不存在: {email}"
            )
            
        print(f"找到用户: {user.username}")  # 调试日志
        return user
    except Exception as e:
        print(f"认证错误: {str(e)}")  # 调试日志
        raise

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()