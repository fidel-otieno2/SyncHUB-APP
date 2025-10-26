from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from services.minio_service import minio_service

quick_upload_bp = Blueprint('quick_upload', __name__)

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
        
        # Upload to MinIO if available
        if minio_service.available:
            try:
                file.stream.seek(0)
                result = minio_service.upload_file(
                    file.stream, 
                    file.filename, 
                    folder_type,
                    {'title': title, 'description': description, 'device': device_name}
                )
                file_data['url'] = result['url']
                file_data['size'] = result['size']
                file_data['storage_type'] = 'minio'
            except Exception as e:
                print(f"MinIO upload failed: {e}")
        
        return jsonify({
            'message': 'File uploaded successfully',
            **file_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quick_upload_bp.route('', methods=['GET'])
def get_all_files():
    print(f"MinIO available: {minio_service.available}")
    if minio_service.available:
        files = minio_service.list_files()
        print(f"Found {len(files)} files in MinIO")
        return jsonify(files), 200
    print("MinIO not available, returning empty list")
    return jsonify([]), 200

@quick_upload_bp.route('/by-folder/<folder_type>', methods=['GET'])
def get_files_by_folder(folder_type):
    print(f"MinIO available: {minio_service.available}, folder: {folder_type}")
    if minio_service.available:
        files = minio_service.list_files(folder_type)
        print(f"Found {len(files)} files in folder {folder_type}")
        return jsonify(files), 200
    print(f"MinIO not available for folder {folder_type}")
    return jsonify([]), 200