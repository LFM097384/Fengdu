from sqlalchemy import create_engine
from models import Base, User, SQLALCHEMY_DATABASE_URL
from sqlalchemy.orm import sessionmaker
import os

def init_db():
    # 确保数据库文件存在
    db_path = "./forum.db"
    if not os.path.exists(db_path):
        open(db_path, 'w').close()
        
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        test_user = User(
            username="测试用户",
            email="test@example.com",
            hashed_password="test",
            experience=50,  # 添加一些初始经验值
            level=1
        )
        db.add(test_user)
        db.commit()
        print(f"测试用户创建成功: {test_user.username}")
    except Exception as e:
        db.rollback()
        print(f"初始化失败: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("开始初始化数据库...")
    init_db()
    print("数据库初始化完成!")