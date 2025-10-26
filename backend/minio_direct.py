from flask import Blueprint, jsonify
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
            
            files.append({
                'id': obj.object_name.replace('/', '_'),
                'filename': filename,
                'title': filename,
                'folder_type': folder_type,
                'size': obj.size,
                'url': f'http://localhost:9000/synchub-files/{obj.object_name}',
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
                files.append({
                    'id': obj.object_name.replace('/', '_'),
                    'filename': filename,
                    'title': filename,
                    'folder_type': folder_type,
                    'size': obj.size,
                    'url': f'http://localhost:9000/synchub-files/{obj.object_name}',
                    'created_at': obj.last_modified.isoformat() if obj.last_modified else None
                })
        
        return jsonify(files), 200
    except Exception as e:
        print(f"MinIO folder error: {e}")
        return jsonify([]), 200