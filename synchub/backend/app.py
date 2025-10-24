from flask import Flask
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.files import files_bp
from routes.devices import devices_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for all routes
    CORS(app, origins=['*'], supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(files_bp, url_prefix='/api/files')
    app.register_blueprint(devices_bp, url_prefix='/api/devices')
    
    @app.route('/')
    def health_check():
        return {'status': 'SyncHUB Backend Running', 'version': '1.0.0'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)