import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK with service account credentials"""
    try:
        # Check if already initialized
        firebase_admin.get_app()
    except ValueError:
        # Not initialized, so initialize it
        # Use environment variables for credentials
        cred = credentials.Certificate({
            "type": os.environ.get('FIREBASE_TYPE', 'service_account'),
            "project_id": os.environ.get('FIREBASE_PROJECT_ID'),
            "private_key_id": os.environ.get('FIREBASE_PRIVATE_KEY_ID'),
            "private_key": os.environ.get('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
            "client_email": os.environ.get('FIREBASE_CLIENT_EMAIL'),
            "client_id": os.environ.get('FIREBASE_CLIENT_ID'),
            "auth_uri": os.environ.get('FIREBASE_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth'),
            "token_uri": os.environ.get('FIREBASE_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
            "auth_provider_x509_cert_url": os.environ.get('FIREBASE_AUTH_PROVIDER_CERT_URL', 'https://www.googleapis.com/oauth2/v1/certs'),
            "client_x509_cert_url": os.environ.get('FIREBASE_CLIENT_CERT_URL')
        })
        
        firebase_admin.initialize_app(cred)

# Initialize on import
initialize_firebase()

# Get Firestore client
db = firestore.client()

# Collection names
COLLECTIONS = {
    'users': 'users',
    'products': 'products',
    'chats': 'chats',
    'messages': 'messages',
    'needs': 'needs',
    'need_responses': 'need_responses',
    'transactions': 'transactions',
    'reviews': 'reviews',
    'reports': 'reports'
}
