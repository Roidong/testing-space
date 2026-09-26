@echo off
chcp 65001 >nul
echo ========================================
echo   校园 RoboExpress - 启动脚本
echo ========================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [错误] 未找到 Node.js，请先安装 Node.js (https://nodejs.org)
    pause
    exit /b 1
)

if not exist node_modules (
    echo [信息] 首次运行，正在安装依赖…
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

echo [信息] 启动开发服务器…
echo.
call npm run dev
