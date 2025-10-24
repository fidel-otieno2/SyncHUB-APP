from flask import Blueprint, request, jsonify, Response
from minio import Minio
import uuid
import mimetypes
from io import BytesIO
from datetime import datetime

files_bp = Blueprint('files', __name__)

def get_minio_client():
    return Minio(
        'localhost:9000',
        access_key='minioadmin',
        secret_key='minioadmin',
        secure=False
    )

@files_bp.route('', methods=['GET', 'OPTIONS'])
def get_files():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        minio_client = get_minio_client()
        bucket_name = 'synchub-files'
        files = []
        
        if minio_client.bucket_exists(bucket_name):
            objects = minio_client.list_objects(bucket_name, recursive=True)
            for obj in objects:
                try:
                    obj_stat = minio_client.stat_object(bucket_name, obj.object_name)
                    metadata = obj_stat.metadata or {}
                    
                    def get_metadata(key):
                        return (metadata.get(f'x-amz-meta-{key}') or 
                               metadata.get(key) or 
                               metadata.get(key.lower()) or '')
                    
                    path_parts = obj.object_name.split('/')
                    if len(path_parts) > 1:
                        folder_type = path_parts[0]
                        filename_part = path_parts[1]
                        file_id = filename_part.split('_')[0] if '_' in filename_part else filename_part
                    else:
                        folder_type = 'documents'
                        file_id = obj.object_name.split('_')[0] if '_' in obj.object_name else obj.object_name
                    
                    files.append({
                        'id': file_id,
                        'filename': get_metadata('original_filename') or obj.object_name.split('/')[-1],
                        'title': get_metadata('title') or obj.object_name.split('/')[-1],
                        'description': get_metadata('description'),
                        'folder_type': folder_type,
                        'size': obj.size,
                        'created_at': obj.last_modified.isoformat() if obj.last_modified else None,
                        'device_name': get_metadata('device_name') or 'Unknown Device',
                        'object_name': obj.object_name
                    })
                except Exception as e:
                    print(f"Error processing file {obj.object_name}: {e}")
                    continue
        
        return jsonify(files), 200
        
    except Exception as e:
        print(f"Error fetching files: {str(e)}")
        return jsonify([]), 200

@files_bp.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        title = request.form.get('title', file.filename)
        folder_type = request.form.get('folder_type', 'documents')
        device_name = request.form.get('device_name', 'Unknown Device')
        
        minio_client = get_minio_client()
        bucket_name = 'synchub-files'
        
        if not minio_client.bucket_exists(bucket_name):
            minio_client.make_bucket(bucket_name)
        
        file_id = str(uuid.uuid4())
        object_name = f"{folder_type}/{file_id}_{file.filename}"
        
        file.stream.seek(0)
        file_data = file.stream.read()
        file_size = len(file_data)
        
        content_type = file.content_type
        if not content_type:
            content_type, _ = mimetypes.guess_type(file.filename)
        if not content_type:
            content_type = 'application/octet-stream'
        
        metadata = {
            'title': title,
            'description': request.form.get('description', ''),
            'original_filename': file.filename,
            'folder_type': folder_type,
            'device_name': device_name,
            'upload_time': datetime.utcnow().isoformat()
        }
        
        minio_client.put_object(
            bucket_name,
            object_name,
            BytesIO(file_data),
            length=file_size,
            content_type=content_type,
            metadata=metadata
        )
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file_id': file_id,
            'filename': file.filename,
            'folder_type': folder_type,
            'object_name': object_name
        }), 200
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@files_bp.route('/by-folder/<folder_type>', methods=['GET', 'OPTIONS'])
def get_files_by_folder(folder_type):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        minio_client = get_minio_client()
        bucket_name = 'synchub-files'
        
        if not minio_client.bucket_exists(bucket_name):
            return jsonify([]), 200
        
        # Map plural folder names to singular for storage compatibility
        folder_mapping = {
            'videos': 'video',
            'images': 'image', 
            'documents': 'document',
            'music': 'audio',
            'archives': 'archive',
            'others': 'other'
        }
        
        # Try both the original folder name and mapped name
        search_folders = [folder_type]
        if folder_type in folder_mapping:
            search_folders.append(folder_mapping[folder_type])
        
        files = []
        for search_folder in search_folders:
            objects = list(minio_client.list_objects(bucket_name, prefix=f"{search_folder}/"))
            if objects:
                break
        
        for obj in objects[:50]:  # Limit to 50 files to prevent timeout
            try:
                path_parts = obj.object_name.split('/')
                if len(path_parts) > 1:
                    filename_part = path_parts[1]
                    file_id = filename_part.split('_')[0] if '_' in filename_part else filename_part
                else:
                    file_id = obj.object_name.split('_')[0] if '_' in obj.object_name else obj.object_name
                
                files.append({
                    'id': file_id,
                    'filename': obj.object_name.split('/')[-1],
                    'title': obj.object_name.split('/')[-1],
                    'description': '',
                    'folder_type': folder_type,
                    'size': obj.size,
                    'created_at': obj.last_modified.isoformat() if obj.last_modified else None,
                    'device_name': 'Unknown Device',
                    'object_name': obj.object_name
                })
            except Exception as e:
                continue
        
        return jsonify(files), 200
        
    except Exception as e:
        return jsonify([]), 200

@files_bp.route('/<file_id>', methods=['GET', 'OPTIONS'])
def get_file_details(file_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        minio_client = get_minio_client()
        bucket_name = 'synchub-files'
        objects = minio_client.list_objects(bucket_name, recursive=True)
        
        for obj in objects:
            if file_id in obj.object_name:
                obj_stat = minio_client.stat_object(bucket_name, obj.object_name)
                metadata = obj_stat.metadata or {}
                
                def get_metadata(key):
                    return (metadata.get(f'x-amz-meta-{key}') or 
                           metadata.get(key) or 
                           metadata.get(key.lower()) or '')
                
                return jsonify({
                    'id': file_id,
                    'filename': get_metadata('original_filename') or obj.object_name.split('/')[-1],
                    'title': get_metadata('title') or obj.object_name.split('/')[-1],
                    'description': get_metadata('description'),
                    'size': obj.size,
                    'content_type': obj_stat.content_type,
                    'created_at': obj.last_modified.isoformat() if obj.last_modified else None,
                    'folder_type': get_metadata('folder_type') or 'documents',
                    'device_name': get_metadata('device_name') or 'Unknown Device'
                }), 200
        
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/stream/<file_id>', methods=['GET', 'OPTIONS'])
def stream_file(file_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        minio_client = get_minio_client()
        bucket_name = 'synchub-files'
        objects = minio_client.list_objects(bucket_name, recursive=True)
        
        for obj in objects:
            if file_id in obj.object_name:
                response = minio_client.get_object(bucket_name, obj.object_name)
                file_data = response.read()
                obj_stat = minio_client.stat_object(bucket_name, obj.object_name)
                
                content_type = obj_stat.content_type
                if not content_type:
                    content_type, _ = mimetypes.guess_type(obj.object_name)
                if not content_type:
                    content_type = 'application/octet-stream'
                
                response = Response(
                    file_data,
                    mimetype=content_type,
                    headers={
                        'Content-Disposition': 'inline',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    }
                )
                return response
        
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/<file_id>/download', methods=['GET', 'OPTIONS'])
def download_file(file_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        minio_client = get_minio_client()
        bucket_name = 'synchub-files'
        objects = minio_client.list_objects(bucket_name, recursive=True)
        
        for obj in objects:
            if file_id in obj.object_name:
                response = minio_client.get_object(bucket_name, obj.object_name)
                file_data = response.read()
                obj_stat = minio_client.stat_object(bucket_name, obj.object_name)
                metadata = obj_stat.metadata or {}
                
                filename = metadata.get('x-amz-meta-original_filename', obj.object_name.split('/')[-1])
                
                return Response(
                    file_data,
                    mimetype=obj_stat.content_type or 'application/octet-stream',
                    headers={
                        'Content-Disposition': f'attachment; filename="{filename}"',
                        'Content-Length': str(len(file_data))
                    }
                )
        
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/delete/<file_id>', methods=['DELETE', 'OPTIONS'])
def delete_file_endpoint(file_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        minio_client = get_minio_client()
        bucket_name = 'synchub-files'
        objects = minio_client.list_objects(bucket_name, recursive=True)
        
        for obj in objects:
            if file_id in obj.object_name:
                minio_client.remove_object(bucket_name, obj.object_name)
                return jsonify({'message': 'File deleted successfully'}), 200
        
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/move/<file_id>', methods=['POST', 'OPTIONS'])
def move_file_endpoint(file_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        new_folder = data.get('folder_type')
        
        if not new_folder:
            return jsonify({'error': 'New folder type required'}), 400
        
        minio_client = get_minio_client()
        bucket_name = 'synchub-files'
        objects = minio_client.list_objects(bucket_name, recursive=True)
        
        for obj in objects:
            if file_id in obj.object_name:
                # Get original file data and metadata
                response = minio_client.get_object(bucket_name, obj.object_name)
                file_data = response.read()
                obj_stat = minio_client.stat_object(bucket_name, obj.object_name)
                metadata = obj_stat.metadata or {}
                
                # Create new object name with new folder
                filename = obj.object_name.split('/')[-1]
                new_object_name = f"{new_folder}/{filename}"
                
                # Update metadata with new folder type
                updated_metadata = dict(metadata)
                updated_metadata['x-amz-meta-folder_type'] = new_folder
                
                # Copy to new location
                minio_client.put_object(
                    bucket_name,
                    new_object_name,
                    BytesIO(file_data),
                    length=len(file_data),
                    content_type=obj_stat.content_type,
                    metadata=updated_metadata
                )
                
                # Delete original file
                minio_client.remove_object(bucket_name, obj.object_name)
                
                return jsonify({
                    'message': 'File moved successfully',
                    'new_folder': new_folder,
                    'new_object_name': new_object_name
                }), 200
        
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500