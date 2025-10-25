from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
import os
from simple_files import add_uploaded_file

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
        
        # Store file data and return response
        file_data = {
            'id': file_id,
            'filename': file.filename,
            'title': title,
            'description': description,
            'folder_type': folder_type,
            'size': 1024,
            'device_name': device_name,
            'url': f'https://res.cloudinary.com/demo/image/upload/sample.jpg',
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