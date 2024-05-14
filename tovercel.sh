#!/bin/bash

echo "Proceeding with deployment..."
# Run npm build
echo "Building project..."
npm run build

# Check if npm build was successful
if [ $? -eq 0 ]; then
    echo "Build successful."

    # Deploy to Vercel production
    echo "Deploying to Vercel production..."
    vercel --prod

    # Check if Vercel deployment was successful
    if [ $? -eq 0 ]; then
        echo "Deployment to Vercel production successful."
        # Send message using curl
        echo "Sending message to boss..."
        curl --location 'https://daraboth-personalai.vercel.app/telegram/daraboth/send-message' \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data-urlencode 'chatId=485397124' \
        --data-urlencode 'message=From personal-ai. Deploy hz hz boss!'
    else
        echo "Deployment to Vercel production failed. Please check the logs manually."
    fi
else
    echo "Build failed. Please check the logs manually."
fi