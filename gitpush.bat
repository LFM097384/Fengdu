@echo off
chcp 65001 > nul
setlocal EnableDelayedExpansion

echo Git Repository Push Tool
echo ======================

:check_repo
REM Check if it's already a Git repository
if exist ".git" (
    echo Current directory is already a Git repository
    set /p continue=Continue with operations? [Y/N]: 
    if /i "!continue!" neq "Y" exit /b 0
) else (
    echo Initializing Git repository...
    git init
    REM 添加初始提交
    git add .
    git commit -m "Initial commit"
    if errorlevel 1 (
        echo Failed to create initial commit
        exit /b 1
    )
)

:set_remote
REM Get current remote repository
for /f "tokens=* usebackq" %%a in (`git remote get-url origin 2^>nul`) do set current_remote=%%a
if defined current_remote (
    echo Current remote repository: !current_remote!
    set /p change_remote=Change remote repository? [Y/N]: 
    if /i "!change_remote!"=="Y" goto input_remote
) else (
    goto input_remote
)
goto branch_select

:input_remote
echo.
echo Please select remote repository type:
echo [1] GitHub
echo [2] Gitee
echo [3] Custom
set repo_type=
set /p "repo_type=Please choose [1-3]: "

if ["%repo_type%"]==["1"] (
    set repo_name=
    set /p "repo_name=Enter GitHub repository name (format: username/repository): "
    if not "!repo_name!"=="" (
        echo !repo_name! | findstr /r "^[^/]*/[^/]*$" >nul
        if errorlevel 1 (
            echo Invalid format. Please use username/repository format
            goto input_remote
        )
    )
    set "remote_url=https://github.com/!repo_name!.git"
) else if ["%repo_type%"]==["2"] (
    set repo_name=
    set /p "repo_name=Enter Gitee repository name (format: username/repository): "
    if not "!repo_name!"=="" (
        echo !repo_name! | findstr /r "^[^/]*/[^/]*$" >nul
        if errorlevel 1 (
            echo Invalid format. Please use username/repository format
            goto input_remote
        )
    )
    set "remote_url=https://gitee.com/!repo_name!.git"
) else if ["%repo_type%"]==["3"] (
    set remote_url=
    set /p "remote_url=Enter complete remote repository URL: "
    echo !remote_url! | findstr /i /r "^https://.*\.git$" >nul
    if errorlevel 1 (
        echo Invalid URL format. URL should end with .git
        goto input_remote
    )
) else (
    echo Invalid selection
    goto input_remote
)

if not defined remote_url (
    echo Remote repository URL cannot be empty
    goto input_remote
)

echo Setting remote repository: !remote_url!
git remote remove origin 2>nul
git remote add origin "!remote_url!"
if errorlevel 1 (
    echo Failed to set remote repository
    goto input_remote
)

:branch_select
echo.
echo Select branch operation:
echo [1] Use existing branch
echo [2] Create new branch
set /p branch_op=Please choose [1-2]: 

if "!branch_op!"=="1" (
    git branch
    set /p branch_name=Enter branch name: 
) else if "!branch_op!"=="2" (
    set /p branch_name=Enter new branch name: 
    git checkout -b !branch_name!
) else (
    echo Invalid selection
    goto branch_select
)

git checkout !branch_name! || git checkout -b !branch_name!

:commit_changes
echo.
echo Current changes to be committed:
echo ===============================
git status --short
echo ===============================
set /p confirm=Confirm commit these changes? [Y/N]: 
if /i "!confirm!" neq "Y" (
    set /p retry=Retry? [Y/N]:
    if /i "!retry!"=="Y" goto commit_changes
    exit /b 0
)

set /p commit_msg=Enter commit message (press Enter for default "Update code"): 
if "!commit_msg!"=="" set commit_msg=Update code

echo Adding all files...
git add .

echo Committing changes...
git commit -m "!commit_msg!"

:push_changes
echo Pushing to remote repository...
git push -u origin !branch_name!
if errorlevel 1 (
    echo.
    echo Push failed, please select action:
    echo [1] Force push
    echo [2] Cancel operation
    echo [3] Pull then push
    set /p choice=Please choose [1-3]: 
    
    if "!choice!"=="1" (
        echo Force pushing...
        git push -u origin !branch_name! --force
        if !errorlevel! neq 0 (
            echo Force push failed
            set /p retry=Retry? [Y/N]: 
            if /i "!retry!"=="Y" goto push_changes
        ) else (
            echo Force push successful
        )
    ) else if "!choice!"=="2" (
        echo Push cancelled
    ) else if "!choice!"=="3" (
        echo Pulling remote changes...
        git pull origin !branch_name!
        if !errorlevel! neq 0 (
            echo Pull failed, please resolve conflicts manually and retry
        ) else (
            echo Retrying push...
            git push -u origin !branch_name!
            if !errorlevel! neq 0 (
                echo Push failed
                set /p retry=Retry? [Y/N]: 
                if /i "!retry!"=="Y" goto push_changes
            ) else (
                echo Push successful
            )
        )
    ) else (
        echo Invalid selection
        set /p retry=Retry? [Y/N]: 
        if /i "!retry!"=="Y" goto push_changes
    )
)

echo.
echo All operations completed!
pause
exit /b 0