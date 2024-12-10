import uvicorn

if __name__ == "__main__":
    print("启动FastAPI服务器...")
    uvicorn.run(
        "main:app",
        host="127.0.0.1", # 改回本地地址以确保安全
        port=8000,
        reload=True,
        log_level="debug",
        access_log=True # 启用访问日志
    )