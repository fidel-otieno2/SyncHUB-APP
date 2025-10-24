from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
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
    CORS(app, origins='*', supports_credentials=True, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.files import files_bp
    from routes.devices import devices_bp
    from routes.sync import sync_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(files_bp, url_prefix='/api/files')
    app.register_blueprint(devices_bp, url_prefix='/api/devices')
    app.register_blueprint(sync_bp, url_prefix='/api/sync')

    
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

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Error creating database tables: {e}")
    app.run(debug=True, host='0.0.0.0', port=5000)