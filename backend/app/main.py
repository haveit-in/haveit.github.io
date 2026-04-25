from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app.firebase import verify_firebase_token
from app.models import User
from app.schemas import TokenRequest

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "HaveIt backend running 🚀"}

@app.get("/test-db")
def test_db():
    try:
        conn = engine.connect()
        conn.close()
        return {"message": "Database connected ✅"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/auth/login")
def login(data: TokenRequest, db: Session = Depends(get_db)):
    try:
        decoded = verify_firebase_token(data.token)

        firebase_uid = decoded.get("uid")
        email = decoded.get("email")
        phone = decoded.get("phone_number")
        name = decoded.get("name")

        # 🔍 Check user
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

        if not user:
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                phone=phone,
                name=name,
                role="user"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        return {
            "message": "Login successful",
            "user": {
                "id": str(user.id),
                "role": user.role,
                "email": user.email
            }
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")