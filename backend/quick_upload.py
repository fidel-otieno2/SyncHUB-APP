from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime

quick_upload_bp = Blueprint('quick_upload', __name__)

# In-memory storage for demo
files_storage = []

@quick_upload_bp.route('/upload', methods=['POST', 'OPTIONS'])
def quick_upload():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        # Get form data
        title = request.form.get('title', file.filename)
        folder_type = request.form.get('folder_type', 'documents')
        device_name = request.form.get('device_name', 'Unknown Device')
        description = request.form.get('description', '')
        
        # Generate file data
        file_id = str(uuid.uuid4())
        file_data = {
            'id': file_id,
            'filename': file.filename,
            'title': title,
            'description': description,
            'folder_type': folder_type,
            'size': 1024,
            'device_name': device_name,
            'url': f'https://via.placeholder.com/300x200?text={file.filename}',
            'storage_type': 'memory',
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Store in memory
        files_storage.append(file_data)
        
        return jsonify({
            'message': 'File uploaded successfully',
            **file_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quick_upload_bp.route('', methods=['GET'])
def get_all_files():
    return jsonify(files_storage), 200

@quick_upload_bp.route('/by-folder/<folder_type>', methods=['GET'])
def get_files_by_folder(folder_type):
    folder_files = [f for f in files_storage if f.get('folder_type') == folder_type]
    return jsonify(folder_files), 200