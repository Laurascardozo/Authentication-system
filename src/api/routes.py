from flask import Blueprint, jsonify, request
from api.models import User, db
from datetime import timedelta
from flask_jwt_extended import create_access_token, JWTManager

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def client_registration():
    print("Recibida solicitud POST a /api/register")  # Debug
    try:
        data = request.json
        print(f"Datos recibidos: {data}")  # Debug
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Faltan email o password en el cuerpo de la solicitud"}), 400

        email = data.get('email')
        password = data.get('password')

        not_unique_email = User.query.filter_by(email=email).first()
        if not_unique_email:
            return jsonify({"error": "El email ya está en uso"}), 400
        
        new_client = User(email=email)
        new_client.set_password(password)
        db.session.add(new_client)
        db.session.commit()

        expiration = timedelta(minutes=45)
        access_token = create_access_token(identity=str(new_client.id), expires_delta=expiration, additional_claims={"role": "client"})
        print(f"Token generado: {access_token}")  # Debug
        return jsonify({'token': access_token})
    
    except Exception as e:
        db.session.rollback()
        print(f"Error en client_registration: {str(e)}")  # Mostrará el error exacto
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500
    

@api.route('/login', methods=['POST'])
def client_login(): 
    data = request.json
    email = data.get('email', None)
    password = data.get('password')
    if email:
        user = User.query.filter_by(email=email).first()
    else:
        return jsonify({"error":"Complete login information"}),400
    try:
        if user and user.check_password(password):
            expiration = timedelta(minutes=45)
            access_token = create_access_token(identity=str(user.id))
            return jsonify({"token": access_token}), 200
    
        return jsonify({"message": "Check your email and password"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify('error: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('error: Failed to process request'), 500