from flask import Blueprint, jsonify, request, Response
from minio import Minio
import os

minio_direct_bp = Blueprint('minio_direct', __name__)

# Direct MinIO connection
minio_client = Minio(
    'localhost:9000',
    access_key='minioadmin',
    secret_key='minioadmin',
    secure=False
)

@minio_direct_bp.route('', methods=['GET'])
def get_all_files():
    try:
        files = []
        objects = minio_client.list_objects('synchub-files', recursive=True)
        
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
            objects = minio_client.list_objects('synchub-files', prefix=f'{search_folder}/', recursive=True)
            
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
    try:
        objects = minio_client.list_objects('synchub-files', recursive=True)
        
        for obj in objects:
            filename = obj.object_name.split('/')[-1]
            # Check if this file matches the ID
            if '_' in filename:
                extracted_id = filename.split('_')[0]
            else:
                extracted_id = filename.replace('.', '-').replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '').replace('[', '').replace(']', '')
            
            if extracted_id == file_id or file_id in obj.object_name:
                folder_type = obj.object_name.split('/')[0] if '/' in obj.object_name else 'others'
                
                # Determine content type
                content_type = 'application/octet-stream'
                if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    content_type = f'image/{filename.split(".")[-1].lower()}'
                elif filename.lower().endswith(('.mp4', '.avi', '.mov', '.webm')):
                    content_type = f'video/{filename.split(".")[-1].lower()}'
                elif filename.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a')):
                    content_type = f'audio/{filename.split(".")[-1].lower()}'
                
                return jsonify({
                    'id': file_id,
                    'filename': filename,
                    'title': filename,
                    'description': '',
                    'folder_type': folder_type,
                    'size': obj.size,
                    'content_type': content_type,
                    'url': f'http://localhost:9000/synchub-files/{obj.object_name}',
                    'object_name': obj.object_name,
                    'device_name': 'Unknown Device',
                    'created_at': obj.last_modified.isoformat() if obj.last_modified else None
                }), 200
        
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        print(f"MinIO file details error: {e}")
        return jsonify({'error': str(e)}), 500

@minio_direct_bp.route('/stream/<file_id>', methods=['GET', 'OPTIONS'])
def stream_file(file_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        objects = minio_client.list_objects('synchub-files', recursive=True)
        
        for obj in objects:
            filename = obj.object_name.split('/')[-1]
            extracted_id = filename.split('_')[0] if '_' in filename else filename.replace('.', '-').replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '').replace('[', '').replace(']', '')
            
            if extracted_id == file_id or file_id in obj.object_name:
                response = minio_client.get_object('synchub-files', obj.object_name)
                file_data = response.read()
                
                # Determine content type
                content_type = 'application/octet-stream'
                if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    content_type = f'image/{filename.split(".")[-1].lower()}'
                elif filename.lower().endswith(('.mp4', '.avi', '.mov', '.webm')):
                    content_type = f'video/{filename.split(".")[-1].lower()}'
                elif filename.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a')):
                    content_type = f'audio/{filename.split(".")[-1].lower()}'
                
                return Response(
                    file_data,
                    mimetype=content_type,
                    headers={
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Cache-Control': 'public, max-age=3600'
                    }
                )
        
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        print(f"MinIO stream error: {e}")
        return jsonify({'error': str(e)}), 500

@minio_direct_bp.route('/<file_id>/download', methods=['GET', 'OPTIONS'])
def download_file(file_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        objects = minio_client.list_objects('synchub-files', recursive=True)
        
        for obj in objects:
            filename = obj.object_name.split('/')[-1]
            # Check if this file matches the ID
            extracted_id = filename.split('_')[0] if '_' in filename else filename.replace('.', '-').replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '').replace('[', '').replace(']', '')
            
            if extracted_id == file_id or file_id in obj.object_name:
                # Get the file from MinIO
                response = minio_client.get_object('synchub-files', obj.object_name)
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