@echo off
chcp 65001
echo 正在初始化学生论坛系统...

:: 检查 Python 环境
python --version
if errorlevel 1 (
    echo 请先安装 Python 3.x
    pause
    exit
)

cd backend

:: 卸载可能有问题的包
pip uninstall jose -y
pip uninstall python-jose -y

:: 安装核心依赖
pip install python-jose[cryptography]
pip install fastapi sqlalchemy uvicorn

:: 安装其他依赖
pip install -r requirements.txt

:: 验证安装
python -c "from jose import jwt" 2>nul
if errorlevel 1 (
    echo JWT模块安装失败！
    echo 请尝试手动运行: pip install python-jose[cryptography]
    pause
    exit
)

cd ../frontend
echo 正在安装前端依赖...
call npm install

echo 初始化完成！
echo 现在可以运行 start.bat 来启动系统了。

pause