from flask import Blueprint, jsonify, request
from datetime import datetime
from services.minio_service import minio_service

simple_files_bp = Blueprint('simple_files', __name__)

@simple_files_bp.route('', methods=['GET', 'OPTIONS'])
def get_files():
    if request.method == 'OPTIONS':
        return '', 200
    
    files = minio_service.list_files()
    return jsonify(files), 200

@simple_files_bp.route('/by-folder/<folder_type>', methods=['GET', 'OPTIONS'])
def get_files_by_folder(folder_type):
    if request.method == 'OPTIONS':
        return '', 200
    
    files = minio_service.list_files(folder_type)
    return jsonify(files), 200

def add_uploaded_file(file_data):
    # No longer needed since we read directly from MinIO
    pass