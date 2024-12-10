from .auth import router as auth_router
from .profile import router as profile_router
from .posts import posts_router

__all__ = ['auth_router', 'profile_router', 'posts_router']