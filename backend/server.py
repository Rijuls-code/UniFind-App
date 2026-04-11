from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'unifind')]

app = FastAPI(title="UniFind API")
api_router = APIRouter(prefix="/api")

# Auth setup
SECRET_KEY = os.environ.get('JWT_SECRET', 'unifind-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# ─── Models ───────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    college: str
    branch: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    avatar: Optional[str] = None

class ProductCreate(BaseModel):
    title: str
    price: float
    condition: str
    category: str
    description: str
    location: str
    images: List[str] = []
    specifications: dict = {}

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
    condition: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    images: Optional[List[str]] = None
    specifications: Optional[dict] = None
    status: Optional[str] = None  # active, sold

class MessageCreate(BaseModel):
    text: str

class ChatCreate(BaseModel):
    seller_id: str
    product_id: str

class NeedBoardQuery(BaseModel):
    query: str

# ─── Auth Helpers ─────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ─── Auth Routes ──────────────────────────────────────────────────────────────

@api_router.post("/auth/register")
async def register(data: UserRegister):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "college": data.college,
        "branch": data.branch,
        "avatar": "",
        "trustScore": 0,
        "rating": 0.0,
        "reviewCount": 0,
        "memberSince": str(datetime.now(timezone.utc).year),
        "isVerified": False,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user)
    token = create_token(user_id)
    user.pop("password", None)
    user.pop("_id", None)
    return {"token": token, "user": user}

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user["id"])
    user.pop("password", None)
    user.pop("_id", None)
    return {"token": token, "user": user}

@api_router.get("/auth/me")
async def get_me(current_user=Depends(get_current_user)):
    return current_user

# ─── User Routes ──────────────────────────────────────────────────────────────

@api_router.get("/users/{user_id}")
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.put("/users/me")
async def update_user(data: UserUpdate, current_user=Depends(get_current_user)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if update_data:
        await db.users.update_one({"id": current_user["id"]}, {"$set": update_data})
    user = await db.users.find_one({"id": current_user["id"]}, {"_id": 0, "password": 0})
    return user

# ─── Product Routes ───────────────────────────────────────────────────────────

@api_router.get("/products")
async def get_products(
    category: Optional[str] = None,
    condition: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None
):
    query = {"status": {"$ne": "sold"}}
    if category and category != "All":
        query["category"] = category
    if condition and condition != "all":
        query["condition"] = condition
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.post("/products")
async def create_product(data: ProductCreate, current_user=Depends(get_current_user)):
    product_id = str(uuid.uuid4())
    product = {
        "id": product_id,
        **data.model_dump(),
        "sellerId": current_user["id"],
        "sellerName": current_user["name"],
        "sellerCollege": current_user.get("college", ""),
        "conditionScore": {"Like New": 95, "Excellent": 88, "Good": 75, "Fair": 60}.get(data.condition, 70),
        "views": 0,
        "status": "active",
        "postedDate": datetime.now(timezone.utc).isoformat()
    }
    await db.products.insert_one(product)
    product.pop("_id", None)
    return product

@api_router.get("/products/user/{user_id}")
async def get_user_products(user_id: str):
    products = await db.products.find({"sellerId": user_id}, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    # Increment views
    await db.products.update_one({"id": product_id}, {"$inc": {"views": 1}})
    product["views"] = product.get("views", 0) + 1
    return product

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, data: ProductUpdate, current_user=Depends(get_current_user)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product["sellerId"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, current_user=Depends(get_current_user)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product["sellerId"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.products.delete_one({"id": product_id})
    return {"message": "Deleted successfully"}

# ─── Chat Routes ──────────────────────────────────────────────────────────────

@api_router.get("/chats")
async def get_chats(current_user=Depends(get_current_user)):
    chats = await db.chats.find(
        {"$or": [{"buyerId": current_user["id"]}, {"sellerId": current_user["id"]}]},
        {"_id": 0}
    ).to_list(100)
    return chats

@api_router.post("/chats")
async def create_or_get_chat(data: ChatCreate, current_user=Depends(get_current_user)):
    existing = await db.chats.find_one({
        "buyerId": current_user["id"],
        "sellerId": data.seller_id,
        "productId": data.product_id
    }, {"_id": 0})
    if existing:
        return existing
    
    chat_id = str(uuid.uuid4())
    chat = {
        "id": chat_id,
        "buyerId": current_user["id"],
        "buyerName": current_user["name"],
        "sellerId": data.seller_id,
        "productId": data.product_id,
        "lastMessage": "",
        "lastMessageAt": datetime.now(timezone.utc).isoformat(),
        "unread": 0,
        "messages": []
    }
    await db.chats.insert_one(chat)
    chat.pop("_id", None)
    return chat

@api_router.get("/chats/{chat_id}/messages")
async def get_messages(chat_id: str, current_user=Depends(get_current_user)):
    chat = await db.chats.find_one({"id": chat_id}, {"_id": 0})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat.get("messages", [])

@api_router.post("/chats/{chat_id}/messages")
async def send_message(chat_id: str, data: MessageCreate, current_user=Depends(get_current_user)):
    chat = await db.chats.find_one({"id": chat_id})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    message = {
        "id": str(uuid.uuid4()),
        "senderId": current_user["id"],
        "senderName": current_user["name"],
        "text": data.text,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.chats.update_one(
        {"id": chat_id},
        {
            "$push": {"messages": message},
            "$set": {"lastMessage": data.text, "lastMessageAt": message["timestamp"]}
        }
    )
    return message

# ─── NeedBoard AI Route ───────────────────────────────────────────────────────

@api_router.post("/needboard/match")
async def needboard_match(data: NeedBoardQuery):
    query_lower = data.query.lower()
    all_products = await db.products.find({"status": {"$ne": "sold"}}, {"_id": 0}).to_list(200)
    
    # Simple keyword matching
    scored = []
    for p in all_products:
        score = 0
        text = f"{p.get('title','')} {p.get('description','')} {p.get('category','')}".lower()
        for word in query_lower.split():
            if len(word) > 2 and word in text:
                score += 1
        if score > 0:
            scored.append((score, p))
    
    scored.sort(key=lambda x: x[0], reverse=True)
    matches = [p for _, p in scored[:6]]
    
    return {
        "query": data.query,
        "matches": matches,
        "total": len(matches)
    }

# ─── Analytics Route ──────────────────────────────────────────────────────────

@api_router.get("/analytics/me")
async def get_my_analytics(current_user=Depends(get_current_user)):
    user_id = current_user["id"]
    sold_count = await db.products.count_documents({"sellerId": user_id, "status": "sold"})
    active_count = await db.products.count_documents({"sellerId": user_id, "status": "active"})
    
    return {
        "bought": current_user.get("boughtCount", 0),
        "sold": sold_count,
        "active": active_count,
        "rating": current_user.get("rating", 0.0),
        "trustScore": current_user.get("trustScore", 0),
        "earnings": current_user.get("earnings", 0)
    }

@api_router.get("/")
async def root():
    return {"message": "UniFind API v1.0"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
