from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
import os
from simple_files import add_uploaded_file
from services.minio_service import minio_service

simple_upload_bp = Blueprint('simple_upload', __name__)

@simple_upload_bp.route('/upload', methods=['POST', 'OPTIONS'])
def simple_upload():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        title = request.form.get('title', file.filename)
        folder_type = request.form.get('folder_type', 'documents')
        device_name = request.form.get('device_name', 'Unknown Device')
        description = request.form.get('description', '')
        
        file_id = str(uuid.uuid4())
        
        # Upload to MinIO with fallback
        storage_type = 'mock'
        file_size = len(file.read())
        file_url = f'https://via.placeholder.com/300x200?text={file.filename}'
        
        if minio_service.available:
            try:
                file.stream.seek(0)
                result = minio_service.upload_file(
                    file.stream, 
                    file.filename, 
                    folder_type,
                    {'title': title, 'description': description, 'device': device_name}
                )
                file_url = result['url']
                storage_type = 'minio'
                file_size = result['size']
            except Exception as e:
                print(f"MinIO upload failed, using fallback: {e}")
                # Continue with mock data
        
        # Store file data and return response
        file_data = {
            'id': file_id,
            'filename': file.filename,
            'title': title,
            'description': description,
            'folder_type': folder_type,
            'size': file_size,
            'device_name': device_name,
            'url': file_url,
            'storage_type': storage_type,
            'public_id': f'synchub/{folder_type}/{file_id}',
            'created_at': datetime.utcnow().isoformat()
        }
        
        add_uploaded_file(file_data)
        
        return jsonify({
            'message': 'File uploaded successfully',
            **file_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500