from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, profile_router, posts_router

app = FastAPI(debug=True)

# 添加更详细的日志
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"\n--- 收到请求 ---")
    print(f"方法: {request.method}")
    print(f"路径: {request.url.path}")
    print(f"Headers: {dict(request.headers)}")
    response = await call_next(request)
    print(f"响应状态: {response.status_code}")
    print("--- 请求结束 ---\n")
    return response

# CORS配置
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization"],
    expose_headers=["*"],
    max_age=3600,
)

# 添加路由前缀检查
@app.on_event("startup")
async def check_routes():
    print("\n=== 注册的路由 ===")
    for route in app.routes:
        print(f"{route.methods} {route.path}")
    print("=================\n")

# 路由注册移到CORS后
routers = [
    (auth_router, "/api/auth", "auth"),
    (profile_router, "/api/profile", "profile"),
    (posts_router, "/api/posts", "posts")
]

for router, prefix, tag in routers:
    print(f"注册路由: {tag} -> {prefix}")
    app.include_router(router, prefix=prefix, tags=[tag])
    
print("所有路由注册完成")

# 列出所有路由用于调试
@app.get("/debug/routes")
async def list_routes():
    return [
        {
            "path": route.path,
            "name": route.name,
            "methods": route.methods
        }
        for route in app.routes
    ]

@app.get("/routes")
def get_routes():
    """列出所有已注册的路由"""
    routes = []
    for route in app.routes:
        routes.append(f"{route.methods} {route.path}")
    return {"routes": routes}

# 测试路由
@app.get("/test")
async def test():
    return {"status": "ok"}

@app.get("/")
async def root():
    """测试API是否正常工作"""
    return {"message": "API 运行正常"}

# 添加调试端点
@app.get("/debug/test-profile")
async def test_profile():
    """测试profile路由是否正常注册"""
    return {"registered_routes": [
        str(route) for route in app.routes if "profile" in str(route)
    ]}