#!/bin/bash

BASE_URL="http://localhost:8081"

echo "=== API 테스트 시작 ==="
echo ""

# 1. 회원가입 테스트
echo "1. 회원가입 테스트"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  --data-binary "@register.json")
echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# 2. 로그인 테스트
echo "2. 로그인 테스트"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  --data-binary "@login.json")
echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Access Token 추출
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "Access Token: ${ACCESS_TOKEN:0:50}..."
echo ""

# 3. 게시글 작성 테스트
echo "3. 게시글 작성 테스트"
CREATE_POST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/post" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  --data-binary "@create_post.json")
echo "$CREATE_POST_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CREATE_POST_RESPONSE"
echo ""

# 4. 전체 게시글 목록 조회
echo "4. 전체 게시글 목록 조회"
GET_LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/api/post?sortType=RESENT&page=0&size=10")
echo "$GET_LIST_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$GET_LIST_RESPONSE"
echo ""

# 5. 내 게시글 목록 조회
echo "5. 내 게시글 목록 조회"
GET_MY_LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/api/post/my-post?sortType=RESENT&page=0&size=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "$GET_MY_LIST_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$GET_MY_LIST_RESPONSE"
echo ""

# 게시글 ID 추출 (첫 번째 게시글)
POST_ID=$(echo "$GET_MY_LIST_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
if [ -z "$POST_ID" ]; then
    POST_ID=1
fi
echo "사용할 게시글 ID: $POST_ID"
echo ""

# 6. 게시글 단건 조회
echo "6. 게시글 단건 조회 (ID: $POST_ID)"
GET_DETAIL_RESPONSE=$(curl -s -X GET "$BASE_URL/api/post/$POST_ID")
echo "$GET_DETAIL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$GET_DETAIL_RESPONSE"
echo ""

# 7. 게시글 수정
echo "7. 게시글 수정 (ID: $POST_ID)"
PATCH_BODY='{"title":"수정된 제목입니다","body":"수정된 본문입니다"}'
PATCH_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/post/$POST_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "$PATCH_BODY")
echo "$PATCH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PATCH_RESPONSE"
echo ""

# 8. 게시글 삭제
echo "8. 게시글 삭제 (ID: $POST_ID)"
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/post/$POST_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "$DELETE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$DELETE_RESPONSE"
echo ""

echo "=== API 테스트 완료 ==="

