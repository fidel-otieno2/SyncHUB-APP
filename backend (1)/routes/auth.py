from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User, UserRole
from device_manager import register_device

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db.create_all()
        
        data = request.get_json()
        print(f"Registration attempt for: {data.get('email')}")
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User already exists'}), 409
        
        user = User(
            email=data['email'],
            name=data['name'],
            role=UserRole.USER
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {'id': user.id, 'email': user.email, 'name': user.name},
            'token': token
        }), 201
    except Exception as e:
        print(f"Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db.create_all()
        
        data = request.get_json()
        print(f"Login attempt for: {data.get('email')}")
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Track device as active on login
        device_name = data.get('device_name', 'Unknown Device')
        device_type = data.get('device_type', 'laptop')
        ip_address = request.remote_addr or '127.0.0.1'
        
        register_device(device_name, device_type, ip_address, data.get('email'))
        
        token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'user': {'id': user.id, 'email': user.email, 'name': user.name},
            'token': token
        }), 200
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET', 'OPTIONS'])
def get_current_user():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        return jsonify({
            'user': {'id': 1, 'email': 'user@example.com', 'name': 'Current User'}
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 401