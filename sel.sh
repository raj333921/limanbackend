#!/bin/bash

# ==========================
# CONFIG
# ==========================
BASE_URL="http://localhost:3000"
ADMIN_EMAIL="min@example.com"
ADMIN_PASSWORD="password123"
ACTIVATION_CODE="TESTCODE123"

# ==========================
# 1️⃣ Admin Login
# ==========================
echo "1️⃣ Admin login..."
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RESPONSE | jq -r '.token')
if [ "$ADMIN_TOKEN" = "null" ]; then
  echo "❌ Admin login failed!"
  echo $ADMIN_LOGIN_RESPONSE
  exit 1
fi
echo "✅ Admin login successful. Token: $ADMIN_TOKEN"

# ==========================
# 2️⃣ Activation Code Login
# ==========================
echo "2️⃣ Activation code login..."
ACTIVATE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/activate" \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"$ACTIVATION_CODE\"}")

QUIZ_TOKEN=$(echo $ACTIVATE_RESPONSE | jq -r '.token')
if [ "$QUIZ_TOKEN" = "null" ]; then
  echo "❌ Activation code failed!"
  echo $ACTIVATE_RESPONSE
  exit 1
fi
echo "✅ Activation code login successful. Token: $QUIZ_TOKEN"

# ==========================
# 3️⃣ Add an Easy Question (Admin)
# ==========================
echo "3️⃣ Adding an easy question..."
ADD_QUESTION_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/question" \
  -H "Authorization: $ADMIN_TOKEN" \
  -F 'level=easy' \
  -F 'question={"en":"What is 2+2?","fr":"Combien font 2+2?","nl":"Wat is 2+2?"}' \
  -F 'options=[{"en":"3","fr":"3","nl":"3"},{"en":"4","fr":"4","nl":"4"}]' \
  -F 'correct_option=1')

echo "Response: $ADD_QUESTION_RESPONSE"

# ==========================
# 4️⃣ Fetch Easy Questions
# ==========================
echo "4️⃣ Fetching easy questions..."
FETCH_QUESTIONS=$(curl -s -X GET "$BASE_URL/quiz?level=easy&lang=en" \
  -H "Authorization: $QUIZ_TOKEN")

echo "Questions: $FETCH_QUESTIONS"

# ==========================
# 5️⃣ Check Answer
# ==========================
echo "5️⃣ Checking answer (choosing option 1)..."
QUESTION_ID=$(echo $FETCH_QUESTIONS | jq -r '.[0].id')

CHECK_ANSWER=$(curl -s -X POST "$BASE_URL/quiz/check" \
  -H "Authorization: $QUIZ_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"level\":\"easy\",\"questionId\":$QUESTION_ID,\"selectedOption\":1}")

echo "Check answer response: $CHECK_ANSWER"

echo "✅ All steps completed!"
