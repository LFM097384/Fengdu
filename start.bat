chcp 65001

@echo off
echo 启动学生论坛系统...

:: 检查依赖
cd backend
python -c "import sqlalchemy" 2>nul
if errorlevel 1 (
    echo 检测到缺少依赖，请先运行 init.bat 进行初始化
    pause
    exit
)

:: 启动后端服务
echo 正在启动后端服务...
start cmd /k "python -m uvicorn main:app --reload --port 8000"

:: 等待2秒确保后端启动
timeout /t 2 /nobreak

:: 启动前端服务
cd ../frontend
echo 正在启动前端服务...
start cmd /k "npm start"

echo 系统启动完成！
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:8000
echo API文档: http://localhost:8000/docs

pause