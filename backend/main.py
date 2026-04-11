from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import auth
from firebase_config import db, COLLECTIONS
from google.cloud.firestore_v1 import Increment
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import os

app = FastAPI(title="UniFind API - Firebase Edition")

# CORS middleware
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Models ───────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    college: str
    branch: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    avatar: Optional[str] = None
    phone: Optional[str] = None

class ProductCreate(BaseModel):
    title: str
    price: float
    condition: str
    category: str
    description: str
    location: str
    images: List[str] = []
    specifications: Dict[str, Any] = {}
    negotiable: bool = True

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
    condition: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    images: Optional[List[str]] = None
    specifications: Optional[Dict[str, Any]] = None
    status: Optional[str] = None
    negotiable: Optional[bool] = None

class NeedCreate(BaseModel):
    title: str
    description: str
    category: str
    budget: Optional[float] = None
    urgency: str = "medium"  # low, medium, high

class NeedResponseCreate(BaseModel):
    product_id: str
    message: str

class MessageCreate(BaseModel):
    text: str
    image_url: Optional[str] = None

class ChatCreate(BaseModel):
    seller_id: str
    product_id: str

class ReviewCreate(BaseModel):
    transaction_id: str
    rating: int
    comment: str
    condition_accurate: bool

# ─── Auth Helpers ─────────────────────────────────────────────────────────────

async def get_current_user(authorization: str = Header(None)):
    """Verify Firebase ID token and return user"""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split('Bearer ')[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        # Get user from Firestore
        user_ref = db.collection(COLLECTIONS['users']).document(uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        user_data['id'] = uid
        return user_data
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

# ─── Auth Routes ──────────────────────────────────────────────────────────────

@app.post("/api/auth/signup")
async def signup(data: UserCreate):
    """Create new user with Firebase Authentication"""
    try:
        # Create Firebase Auth user
        user = auth.create_user(
            email=data.email,
            password=data.password,
            display_name=data.name
        )
        
        # Create user document in Firestore
        user_data = {
            'email': data.email,
            'name': data.name,
            'college': data.college,
            'branch': data.branch,
            'avatar': '',
            'phone': '',
            'trust_score': 0,
            'rating': 0.0,
            'review_count': 0,
            'total_sales': 0,
            'total_purchases': 0,
            'member_since': datetime.now().isoformat(),
            'is_verified': False,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        db.collection(COLLECTIONS['users']).document(user.uid).set(user_data)
        
        # Generate custom token for immediate login
        custom_token = auth.create_custom_token(user.uid)
        
        return {
            "message": "User created successfully",
            "uid": user.uid,
            "custom_token": custom_token.decode('utf-8'),
            "user": {**user_data, 'id': user.uid}
        }
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
async def login(email: str, password: str):
    """Login is handled by Firebase client SDK on frontend"""
    return {
        "message": "Use Firebase client SDK for login",
        "instructions": "Call firebase.auth().signInWithEmailAndPassword(email, password)"
    }

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@app.post("/api/auth/verify-email")
async def send_verification_email(current_user: dict = Depends(get_current_user)):
    """Send email verification"""
    try:
        link = auth.generate_email_verification_link(current_user['email'])
        return {"message": "Verification email sent", "link": link}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ─── User Routes ──────────────────────────────────────────────────────────────

@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    """Get user profile by ID"""
    user_ref = db.collection(COLLECTIONS['users']).document(user_id)
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = user_doc.to_dict()
    user_data['id'] = user_id
    return user_data

@app.put("/api/users/me")
async def update_user(data: UserUpdate, current_user: dict = Depends(get_current_user)):
    """Update current user profile"""
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    update_data['updated_at'] = datetime.now().isoformat()
    
    user_ref = db.collection(COLLECTIONS['users']).document(current_user['id'])
    user_ref.update(update_data)
    
    # Get updated user
    updated_doc = user_ref.get()
    updated_data = updated_doc.to_dict()
    updated_data['id'] = current_user['id']
    return updated_data

# ─── Product Routes ───────────────────────────────────────────────────────────

@app.get("/api/products")
async def get_products(
    category: Optional[str] = None,
    condition: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    """Get all products with optional filters"""
    query = db.collection(COLLECTIONS['products'])
    
    # Apply filters
    if category and category != "All":
        query = query.where('category', '==', category)
    if condition and condition != "all":
        query = query.where('condition', '==', condition)
    
    # Get documents
    docs = query.limit(limit).stream()
    products = []
    
    for doc in docs:
        product = doc.to_dict()
        product['id'] = doc.id
        
        # Apply price filter
        if min_price is not None and product.get('price', 0) < min_price:
            continue
        if max_price is not None and product.get('price', 0) > max_price:
            continue
        
        # Apply search filter
        if search:
            search_lower = search.lower()
            if not any(search_lower in str(product.get(field, '')).lower() 
                      for field in ['title', 'description', 'category']):
                continue
        
        products.append(product)
    
    return products

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    """Get product by ID"""
    product_ref = db.collection(COLLECTIONS['products']).document(product_id)
    product_doc = product_ref.get()
    
    if not product_doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_data = product_doc.to_dict()
    product_data['id'] = product_id
    
    # Increment views
    product_ref.update({'views': product_data.get('views', 0) + 1})
    product_data['views'] = product_data.get('views', 0) + 1
    
    return product_data

@app.post("/api/products")
async def create_product(data: ProductCreate, current_user: dict = Depends(get_current_user)):
    """Create new product listing"""
    product_data = data.dict()
    product_data.update({
        'seller_id': current_user['id'],
        'seller_name': current_user['name'],
        'seller_college': current_user.get('college', ''),
        'status': 'active',
        'views': 0,
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    })
    
    # Add to Firestore
    doc_ref = db.collection(COLLECTIONS['products']).document()
    doc_ref.set(product_data)
    
    product_data['id'] = doc_ref.id
    return product_data

@app.put("/api/products/{product_id}")
async def update_product(
    product_id: str,
    data: ProductUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update product listing"""
    product_ref = db.collection(COLLECTIONS['products']).document(product_id)
    product_doc = product_ref.get()
    
    if not product_doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_data = product_doc.to_dict()
    if product_data['seller_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    update_data['updated_at'] = datetime.now().isoformat()
    
    product_ref.update(update_data)
    
    updated_doc = product_ref.get()
    updated_data = updated_doc.to_dict()
    updated_data['id'] = product_id
    return updated_data

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    """Delete product listing"""
    product_ref = db.collection(COLLECTIONS['products']).document(product_id)
    product_doc = product_ref.get()
    
    if not product_doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_data = product_doc.to_dict()
    if product_data['seller_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    product_ref.delete()
    return {"message": "Product deleted successfully"}

@app.get("/api/products/user/{user_id}")
async def get_user_products(user_id: str):
    """Get all products by user"""
    products = []
    docs = db.collection(COLLECTIONS['products']).where('seller_id', '==', user_id).stream()
    
    for doc in docs:
        product = doc.to_dict()
        product['id'] = doc.id
        products.append(product)
    
    return products

# ─── Need Board Routes ────────────────────────────────────────────────────────

@app.get("/api/needboard")
async def get_needs(category: Optional[str] = None, limit: int = 50):
    """Get all needs"""
    query = db.collection(COLLECTIONS['needs'])
    
    if category and category != "All":
        query = query.where('category', '==', category)
    
    needs = []
    docs = query.where('status', '==', 'active').limit(limit).stream()
    
    for doc in docs:
        need = doc.to_dict()
        need['id'] = doc.id
        needs.append(need)
    
    return needs

@app.post("/api/needboard")
async def create_need(data: NeedCreate, current_user: dict = Depends(get_current_user)):
    """Create new need"""
    need_data = data.dict()
    need_data.update({
        'user_id': current_user['id'],
        'user_name': current_user['name'],
        'status': 'active',
        'response_count': 0,
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    })
    
    doc_ref = db.collection(COLLECTIONS['needs']).document()
    doc_ref.set(need_data)
    
    need_data['id'] = doc_ref.id
    return need_data

@app.post("/api/needboard/{need_id}/responses")
async def add_need_response(
    need_id: str,
    data: NeedResponseCreate,
    current_user: dict = Depends(get_current_user)
):
    """Add response to a need"""
    response_data = data.dict()
    response_data.update({
        'need_id': need_id,
        'user_id': current_user['id'],
        'user_name': current_user['name'],
        'created_at': datetime.now().isoformat()
    })
    
    doc_ref = db.collection(COLLECTIONS['need_responses']).document()
    doc_ref.set(response_data)
    
    # Increment response count
    need_ref = db.collection(COLLECTIONS['needs']).document(need_id)
    need_ref.update({'response_count': Increment(1)})
    
    response_data['id'] = doc_ref.id
    return response_data

# ─── Chat Routes ──────────────────────────────────────────────────────────────

@app.get("/api/chats")
async def get_chats(current_user: dict = Depends(get_current_user)):
    """Get all chats for current user"""
    chats = []
    
    # Get chats where user is buyer or seller
    buyer_chats = db.collection(COLLECTIONS['chats']).where('buyer_id', '==', current_user['id']).stream()
    seller_chats = db.collection(COLLECTIONS['chats']).where('seller_id', '==', current_user['id']).stream()
    
    for doc in list(buyer_chats) + list(seller_chats):
        chat = doc.to_dict()
        chat['id'] = doc.id
        chats.append(chat)
    
    return chats

@app.post("/api/chats")
async def create_chat(data: ChatCreate, current_user: dict = Depends(get_current_user)):
    """Create or get existing chat"""
    # Check if chat already exists
    existing = db.collection(COLLECTIONS['chats'])\
        .where('buyer_id', '==', current_user['id'])\
        .where('seller_id', '==', data.seller_id)\
        .where('product_id', '==', data.product_id)\
        .limit(1).stream()
    
    for doc in existing:
        chat = doc.to_dict()
        chat['id'] = doc.id
        return chat
    
    # Create new chat
    chat_data = {
        'buyer_id': current_user['id'],
        'buyer_name': current_user['name'],
        'seller_id': data.seller_id,
        'product_id': data.product_id,
        'last_message': '',
        'last_message_at': datetime.now().isoformat(),
        'created_at': datetime.now().isoformat()
    }
    
    doc_ref = db.collection(COLLECTIONS['chats']).document()
    doc_ref.set(chat_data)
    
    chat_data['id'] = doc_ref.id
    return chat_data

@app.get("/api/chats/{chat_id}/messages")
async def get_messages(chat_id: str, current_user: dict = Depends(get_current_user)):
    """Get messages for a chat"""
    messages = []
    docs = db.collection(COLLECTIONS['messages'])\
        .where('chat_id', '==', chat_id)\
        .order_by('created_at')\
        .stream()
    
    for doc in docs:
        message = doc.to_dict()
        message['id'] = doc.id
        messages.append(message)
    
    return messages

@app.post("/api/chats/{chat_id}/messages")
async def send_message(
    chat_id: str,
    data: MessageCreate,
    current_user: dict = Depends(get_current_user)
):
    """Send message in chat"""
    message_data = data.dict()
    message_data.update({
        'chat_id': chat_id,
        'sender_id': current_user['id'],
        'sender_name': current_user['name'],
        'created_at': datetime.now().isoformat()
    })
    
    doc_ref = db.collection(COLLECTIONS['messages']).document()
    doc_ref.set(message_data)
    
    # Update chat last message
    chat_ref = db.collection(COLLECTIONS['chats']).document(chat_id)
    chat_ref.update({
        'last_message': data.text,
        'last_message_at': datetime.now().isoformat()
    })
    
    message_data['id'] = doc_ref.id
    return message_data

# ─── Analytics Routes ─────────────────────────────────────────────────────────

@app.get("/api/analytics/dashboard")
async def get_dashboard_analytics(current_user: dict = Depends(get_current_user)):
    """Get dashboard analytics for current user"""
    user_id = current_user['id']
    
    # Count active listings
    active_products = len(list(db.collection(COLLECTIONS['products'])
        .where('seller_id', '==', user_id)
        .where('status', '==', 'active')
        .stream()))
    
    # Count sold products
    sold_products = len(list(db.collection(COLLECTIONS['products'])
        .where('seller_id', '==', user_id)
        .where('status', '==', 'sold')
        .stream()))
    
    return {
        'active_listings': active_products,
        'sold_items': sold_products,
        'total_views': 0,  # Would need to aggregate from products
        'trust_score': current_user.get('trust_score', 0),
        'rating': current_user.get('rating', 0.0),
        'total_sales': current_user.get('total_sales', 0),
        'total_purchases': current_user.get('total_purchases', 0)
    }

# ─── Root Route ───────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "message": "UniFind API - Firebase Edition",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "database": "firebase"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
