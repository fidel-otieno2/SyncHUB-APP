from flask import Blueprint, jsonify, request, Response
from minio import Minio
import os

minio_direct_bp = Blueprint('minio_direct', __name__)

# Environment-aware MinIO connection
try:
    MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT', 'localhost:9000')
    MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY', 'minioadmin')
    MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY', 'minioadmin')
    MINIO_SECURE = os.getenv('MINIO_SECURE', 'False').lower() == 'true'
    MINIO_BUCKET = os.getenv('MINIO_BUCKET', 'synchub-files')
    
    minio_client = Minio(
        MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=MINIO_SECURE
    )
    
    # Test connection
    minio_client.bucket_exists(MINIO_BUCKET)
    MINIO_AVAILABLE = True
    print(f"MinIO connected: {MINIO_ENDPOINT}")
except Exception as e:
    print(f"MinIO not available: {e}")
    MINIO_AVAILABLE = False
    minio_client = None

@minio_direct_bp.route('', methods=['GET'])
def get_all_files():
    if not MINIO_AVAILABLE:
        return jsonify([]), 200
    
    try:
        files = []
        objects = minio_client.list_objects(MINIO_BUCKET, recursive=True)
        
        for obj in objects:
            folder_type = obj.object_name.split('/')[0] if '/' in obj.object_name else 'others'
            filename = obj.object_name.split('/')[-1]
            
            # Extract UUID from filename if present, make URL-safe
            if '_' in filename:
                file_id = filename.split('_')[0]
            else:
                # Create URL-safe ID from filename
                file_id = filename.replace('.', '-').replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '').replace('[', '').replace(']', '')
            
            files.append({
                'id': file_id,
                'filename': filename,
                'title': filename,
                'folder_type': folder_type,
                'size': obj.size,
                'url': f'http://localhost:9000/synchub-files/{obj.object_name}',
                'object_name': obj.object_name,
                'created_at': obj.last_modified.isoformat() if obj.last_modified else None
            })
        
        return jsonify(files), 200
    except Exception as e:
        print(f"MinIO error: {e}")
        return jsonify([]), 200

@minio_direct_bp.route('/by-folder/<folder_type>', methods=['GET'])
def get_files_by_folder(folder_type):
    if not MINIO_AVAILABLE:
        return jsonify([]), 200
    
    try:
        files = []
        # Map frontend folder names to MinIO folder names
        folder_map = {
            'music': ['music', 'audio'],
            'images': ['images', 'pictures'],
            'videos': ['videos', 'video'],
            'documents': ['documents'],
            'archives': ['archives'],
            'others': ['others']
        }
        
        search_folders = folder_map.get(folder_type, [folder_type])
        
        for search_folder in search_folders:
            objects = minio_client.list_objects(MINIO_BUCKET, prefix=f'{search_folder}/', recursive=True)
            
            for obj in objects:
                filename = obj.object_name.split('/')[-1]
                # Extract UUID from filename if present, make URL-safe
                if '_' in filename:
                    file_id = filename.split('_')[0]
                else:
                    # Create URL-safe ID from filename
                    file_id = filename.replace('.', '-').replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '').replace('[', '').replace(']', '')
                
                files.append({
                    'id': file_id,
                    'filename': filename,
                    'title': filename,
                    'folder_type': folder_type,
                    'size': obj.size,
                    'url': f'http://localhost:9000/synchub-files/{obj.object_name}',
                    'object_name': obj.object_name,
                    'created_at': obj.last_modified.isoformat() if obj.last_modified else None
                })
        
        return jsonify(files), 200
    except Exception as e:
        print(f"MinIO folder error: {e}")
        return jsonify([]), 200

@minio_direct_bp.route('/<file_id>', methods=['GET'])
def get_file_details(file_id):
    if not MINIO_AVAILABLE:
        return jsonify({'error': 'Storage not available'}), 503
    
    try:
        objects = minio_client.list_objects(MINIO_BUCKET, recursive=True)
        
        for obj in objects:
            filename = obj.object_name.split('/')[-1]
            # Check if this file matches the ID
            if '_' in filename:
                extracted_id = filename.split('_')[0]
            else:
                extracted_id = filename.replace('.', '-').replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '').replace('[', '').replace(']', '')
            
            if extracted_id == file_id or file_id in obj.object_name:
                folder_type = obj.object_name.split('/')[0] if '/' in obj.object_name else 'others'
                
                return jsonify({
                    'id': file_id,
                    'filename': filename,
                    'title': filename,
                    'description': '',
                    'folder_type': folder_type,
                    'size': obj.size,
                    'url': f'http://localhost:9000/synchub-files/{obj.object_name}',
                    'object_name': obj.object_name,
                    'device_name': 'Unknown Device',
                    'created_at': obj.last_modified.isoformat() if obj.last_modified else None
                }), 200
        
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        print(f"MinIO file details error: {e}")
        return jsonify({'error': str(e)}), 500

@minio_direct_bp.route('/<file_id>/download', methods=['GET', 'OPTIONS'])
def download_file(file_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    if not MINIO_AVAILABLE:
        return jsonify({'error': 'Storage not available'}), 503
    
    try:
        objects = minio_client.list_objects(MINIO_BUCKET, recursive=True)
        
        for obj in objects:
            filename = obj.object_name.split('/')[-1]
            # Check if this file matches the ID
            extracted_id = filename.split('_')[0] if '_' in filename else filename.replace('.', '-').replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '').replace('[', '').replace(']', '')
            
            if extracted_id == file_id or file_id in obj.object_name:
                # Get the file from MinIO
                response = minio_client.get_object(MINIO_BUCKET, obj.object_name)
                file_data = response.read()
                
                from flask import Response
                return Response(
                    file_data,
                    mimetype='application/octet-stream',
                    headers={
                        'Content-Disposition': f'attachment; filename="{filename}"',
                        'Content-Length': str(len(file_data)),
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    }
                )
        
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        print(f"MinIO download error: {e}")
        return jsonify({'error': str(e)}), 500