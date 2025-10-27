from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restful import Api
from flasgger import Swagger
from models import db
from config import Config

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)
    api = Api(app)
    swagger = Swagger(app)
    CORS(app, 
         origins=['*', 'https://sync-hub-app.vercel.app', 'http://localhost:5173'], 
         supports_credentials=True, 
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'])
    
    # Register simple blueprints only
    from routes.auth import auth_bp
    from routes.devices import devices_bp
    from routes.sync import sync_bp
    from quick_upload import quick_upload_bp
    from minio_direct import minio_direct_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(devices_bp, url_prefix='/api/devices')
    app.register_blueprint(sync_bp, url_prefix='/api/sync')
    app.register_blueprint(quick_upload_bp, url_prefix='/api/files')
    app.register_blueprint(minio_direct_bp, url_prefix='/api/files')

    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def home():
        return jsonify({
            'message': 'SyncHUB Backend API',
            'status': 'Running',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth/login, /api/auth/register',
                'files': '/api/files, /api/files/upload',
                'devices': '/api/devices',
                'test': '/api/test'
            }
        }), 200
    
    # Test endpoint
    @app.route('/api/test', methods=['GET', 'OPTIONS'])
    def test_endpoint():
        if request.method == 'OPTIONS':
            return '', 200
        return jsonify({
            'message': 'Server is running updated code!',
            'endpoints': [
                '/api/devices',
                '/api/devices/register',
                '/api/auth/login',
                '/api/auth/register'
            ]
        }), 200
    
    return app

# Create app instance for gunicorn
app = create_app()

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Error creating database tables: {e}")
    
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)