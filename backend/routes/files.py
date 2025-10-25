from flask import Blueprint, request, jsonify, Response
import uuid
import mimetypes
from io import BytesIO
from datetime import datetime

# Optional MinIO import
try:
    from minio import Minio
    MINIO_AVAILABLE = True
except ImportError:
    MINIO_AVAILABLE = False

try:
    import cloudinary
    import cloudinary.uploader
    from config import Config
    
    cloudinary.config(
        cloud_name=Config.CLOUDINARY_CLOUD_NAME,
        api_key=Config.CLOUDINARY_API_KEY,
        api_secret=Config.CLOUDINARY_API_SECRET
    )
    CLOUDINARY_AVAILABLE = True
except Exception as e:
    CLOUDINARY_AVAILABLE = False
    print(f"Cloudinary not available: {e}")

files_bp = Blueprint('files', __name__)

def get_minio_client():
    if not MINIO_AVAILABLE:
        raise Exception("MinIO not available")
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
        from models import db, File
        db.create_all()  # Ensure tables exist
        files = File.query.all()
        
        return jsonify([{
            'id': f.id,
            'filename': f.filename,
            'title': f.title,
            'description': f.description,
            'folder_type': f.folder_type,
            'size': f.size,
            'created_at': f.created_at.isoformat() if f.created_at else None,
            'device_name': f.device_name,
            'url': f.cloudinary_url
        } for f in files]), 200
        
    except Exception as e:
        print(f"Error fetching files: {str(e)}")
        return jsonify([]), 200

@files_bp.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        print(f"Upload request received. CLOUDINARY_AVAILABLE: {CLOUDINARY_AVAILABLE}")
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        title = request.form.get('title', file.filename)
        folder_type = request.form.get('folder_type', 'documents')
        device_name = request.form.get('device_name', 'Unknown Device')
        description = request.form.get('description', '')
        
        print(f"Upload params: title={title}, folder_type={folder_type}, filename={file.filename}")
        
        file_id = str(uuid.uuid4())
        filename = f"{file_id}_{file.filename}"
        
        if CLOUDINARY_AVAILABLE:
            print("Uploading to Cloudinary...")
            # Upload to Cloudinary
            file.stream.seek(0)
            result = cloudinary.uploader.upload(
                file.stream,
                public_id=f"synchub/{folder_type}/{filename}",
                resource_type="auto",
                folder=f"synchub/{folder_type}"
            )
            print(f"Cloudinary upload result: {result.get('secure_url')}")
            
            # Save to database
            try:
                from models import db, File
                print("Creating database tables...")
                db.create_all()  # Ensure tables exist
                
                print("Saving file to database...")
                db_file = File(
                    id=file_id,
                    filename=file.filename,
                    title=title,
                    description=description,
                    folder_type=folder_type,
                    size=result.get('bytes', 0),
                    device_name=device_name,
                    cloudinary_url=result['secure_url'],
                    cloudinary_public_id=result['public_id']
                )
                db.session.add(db_file)
                db.session.commit()
                print("File saved to database successfully")
            except Exception as db_error:
                print(f"Database error: {db_error}")
                db.session.rollback()
                return jsonify({'error': f'Database save failed: {str(db_error)}'}), 500
            
            return jsonify({
                'message': 'File uploaded successfully to Cloudinary',
                'file_id': file_id,
                'filename': file.filename,
                'title': title,
                'description': description,
                'folder_type': folder_type,
                'size': result.get('bytes', 0),
                'device_name': device_name,
                'url': result['secure_url'],
                'public_id': result['public_id'],
                'created_at': datetime.utcnow().isoformat()
            }), 200
        else:
            print("Cloudinary not available, using fallback")
            return jsonify({
                'message': 'File upload simulated (Cloudinary not available)',
                'file_id': file_id,
                'filename': file.filename,
                'title': title,
                'description': description,
                'folder_type': folder_type,
                'size': 0,
                'device_name': device_name,
                'created_at': datetime.utcnow().isoformat()
            }), 200
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@files_bp.route('/by-folder/<folder_type>', methods=['GET', 'OPTIONS'])
def get_files_by_folder(folder_type):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        from models import db, File
        db.create_all()  # Ensure tables exist
        files = File.query.filter_by(folder_type=folder_type).all()
        
        return jsonify([{
            'id': f.id,
            'filename': f.filename,
            'title': f.title,
            'description': f.description,
            'folder_type': f.folder_type,
            'size': f.size,
            'created_at': f.created_at.isoformat() if f.created_at else None,
            'device_name': f.device_name,
            'url': f.cloudinary_url
        } for f in files]), 200
        
    except Exception as e:
        print(f"Error fetching files by folder: {str(e)}")
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