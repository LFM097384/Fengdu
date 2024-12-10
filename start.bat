@echo off
chcp 65001

echo 请选择启动环境:
echo [1] 本地开发环境 (localhost)
echo [2] 生产环境 (fengdu.social)
choice /c 12 /n /m "请选择 [1-2]: "

if errorlevel 2 (
    set REACT_APP_ENV=production
) else (
    set REACT_APP_ENV=local
)

echo 启动学生论坛系统...
cd backend
python -c "import sqlalchemy" 2>nul
if errorlevel 1 (
    echo 检测到缺少依赖，请先运行 init.bat 进行初始化
    pause
    exit
)

echo 正在启动后端服务...
if "%REACT_APP_ENV%"=="local" (
    start cmd /k "python -m uvicorn main:app --reload --port 8000"
    timeout /t 2 /nobreak
    cd ../frontend
    start cmd /k "npm start"
) else (
    start cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
    timeout /t 2 /nobreak
    cd ../frontend
    IF NOT EXIST build (
        echo 正在构建生产环境...
        set "REACT_APP_API_URL=http://fengdu.social/api"
        call npm run build
    )
    echo 请确保已正确配置 Nginx 并启动
    start cmd /k "npx serve -s build -l 3000"
)

echo 系统启动完成！
if "%REACT_APP_ENV%"=="local" (
    echo 前端地址: http://localhost:3000
    echo 后端地址: http://localhost:8000
) else (
    echo 前端地址: http://fengdu.social
    echo 后端地址: http://api.fengdu.social
)
echo API文档: %API_BASE_URL%/docs
pause