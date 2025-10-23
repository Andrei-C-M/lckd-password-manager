@echo off
REM LCKD Password Manager Deployment Script - Win
REM automate the deployment

echo  Starting LCKD Password Manager Deployment...

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI is not installed. Please install it first.
    pause
    exit /b 1
)

REM Check if Serverless is installed
serverless --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Serverless Framework is not installed. Please install it first.
    pause
    exit /b 1
)

REM Check AWS credentials
echo 🔍 Checking AWS credentials...
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo AWS credentials not configured. Please run 'aws configure' first.
    pause
    exit /b 1
)

echo ✅ AWS credentials configured

REM Deploy backend
echo Deploying backend...
cd backend
call npm install
call serverless deploy

if %errorlevel% neq 0 (
    echo Backend deployment failed spectacularly
    pause
    exit /b 1
)

echo  Backend deployed successfully!
echo copy the API Gateway URL from above
echo Update src/services/api.js with the API Gateway URL

cd ..

REM Build frontend
echo Building frontend...
call npm run build

if %errorlevel% neq 0 (
    echo Frontend build failed spectacularly
    pause
    exit /b 1
)

echo Frontend built successfully!

REM Create S3 bucket
set /a timestamp=%random%
set BUCKET_NAME=lckd-password-manager-frontend-%timestamp%
echo  Creating S3 bucket: %BUCKET_NAME%

aws s3 mb s3://%BUCKET_NAME%

if %errorlevel% neq 0 (
    echo  Failed to create S3 bucket
    pause
    exit /b 1
)

echo  S3 bucket created: %BUCKET_NAME%

REM Enable static website hosting
echo Enabling static website hosting...
aws s3 website s3://%BUCKET_NAME% --index-document index.html

REM Create bucket policy
echo  Creating bucket policy...
(
echo {
echo   "Version": "2012-10-17",
echo   "Statement": [{
echo     "Sid": "PublicReadGetObject",
echo     "Effect": "Allow",
echo     "Principal": "*",
echo     "Action": "s3:GetObject",
echo     "Resource": "arn:aws:s3:::%BUCKET_NAME%/*"
echo   }]
echo }
) > bucket-policy.json

aws s3api put-bucket-policy --bucket %BUCKET_NAME% --policy file://bucket-policy.json

REM Upload files
echo  Uploading files to S3...
aws s3 sync dist/ s3://%BUCKET_NAME% --delete

if %errorlevel% neq 0 (
    echo Failed to upload files
    pause
    exit /b 1
)

echo  Files uploaded successfully!

REM Clean up
del bucket-policy.json

echo.
echo  Not sure how, but deployment completed successfully!
echo.
echo    Backend: Deployed to AWS Lambda + API Gateway
echo    Frontend: Deployed to S3 bucket: %BUCKET_NAME%
REM should i change the region? 
echo    Website URL: http://%BUCKET_NAME%.s3-website-us-east-1.amazonaws.com
echo.
echo    Update the frontend after API URL change:
echo    npm run build
echo    aws s3 sync dist/ s3://%BUCKET_NAME% --delete
echo.
pause
