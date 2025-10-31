from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from datetime import datetime
from services.minio_service import minio_service
from models import db, File

quick_upload_bp = Blueprint('quick_upload', __name__)

@quick_upload_bp.route('/upload', methods=['POST', 'OPTIONS'])
@jwt_required()
def quick_upload():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        current_user_id = get_jwt_identity()

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

        new_file = File(
            id=file_id,
            filename=file.filename,
            title=title,
            description=description,
            folder_type=folder_type,
            device_name=device_name,
            user_id=current_user_id
        )

        if minio_service.available:
            try:
                file.stream.seek(0)
                result = minio_service.upload_file(
                    file.stream,
                    file.filename,
                    folder_type,
                    file_id,
                    {'title': title, 'description': description, 'device': device_name}
                )
                new_file.cloudinary_url = result['url']
                new_file.size = result['size']
                
                db.session.add(new_file)
                db.session.commit()
            except Exception as e:
                print(f"MinIO upload failed: {e}")
                return jsonify({'error': f'Upload failed: {str(e)}'}), 500
        else:
            return jsonify({'error': 'MinIO not available'}), 500

        return jsonify({
            'message': 'File uploaded successfully',
            'id': file_id,
            'filename': file.filename,
            'title': title,
            'folder_type': folder_type
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quick_upload_bp.route('', methods=['GET'])
@jwt_required()
def get_all_files():
    try:
        current_user_id = get_jwt_identity()
        files = File.query.filter_by(user_id=current_user_id).all()

        result = []
        for f in files:
            file_data = {
                'id': f.id,
                'filename': f.filename,
                'title': f.title,
                'description': f.description or '',
                'folder_type': f.folder_type,
                'size': f.size or 0,
                'device_name': f.device_name or 'Unknown Device',
                'url': f.cloudinary_url or '',
                'created_at': f.created_at.isoformat() if f.created_at else None
            }
            result.append(file_data)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quick_upload_bp.route('/by-folder/<folder_type>', methods=['GET'])
@jwt_required()
def get_files_by_folder(folder_type):
    try:
        current_user_id = get_jwt_identity()
        files = File.query.filter_by(user_id=current_user_id, folder_type=folder_type).all()

        result = []
        for f in files:
            file_data = {
                'id': f.id,
                'filename': f.filename,
                'title': f.title,
                'description': f.description or '',
                'folder_type': f.folder_type,
                'size': f.size or 0,
                'device_name': f.device_name or 'Unknown Device',
                'url': f.cloudinary_url or '',
                'created_at': f.created_at.isoformat() if f.created_at else None
            }
            result.append(file_data)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@quick_upload_bp.route('/<file_id>/download', methods=['GET', 'OPTIONS'])
@jwt_required()
def download_file(file_id):
    if request.method == 'OPTIONS':
        return '', 200

    try:
        current_user_id = get_jwt_identity()
        file = File.query.filter_by(id=file_id, user_id=current_user_id).first()

        if not file:
            return jsonify({'error': 'File not found'}), 404

        if minio_service.available:
            try:
                object_name = f"{file.folder_type}/{file_id}_{file.filename}"
                response = minio_service.client.get_object(minio_service.bucket, object_name)
                file_data = response.read()

                return Response(
                    file_data,
                    mimetype='application/octet-stream',
                    headers={
                        'Content-Disposition': f'attachment; filename="{file.filename}"',
                        'Content-Length': str(len(file_data)),
                    }
                )
            except Exception as e:
                print(f"MinIO download error: {e}")
                # Clean up orphaned database record
                db.session.delete(file)
                db.session.commit()
                return jsonify({'error': 'File not found in storage - record cleaned up'}), 404
        else:
            return jsonify({'error': 'MinIO not available'}), 404

    except Exception as e:
        print(f"Download error: {e}")
        return jsonify({'error': str(e)}), 500

@quick_upload_bp.route('/<file_id>', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_file_details(file_id):
    if request.method == 'OPTIONS':
        return '', 200

    try:
        current_user_id = get_jwt_identity()
        file = File.query.filter_by(id=file_id, user_id=current_user_id).first()

        if not file:
            return jsonify({'error': 'File not found'}), 404

        content_type = 'application/octet-stream'
        if file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            content_type = f'image/{file.filename.split(".")[-1].lower()}'
        elif file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.webm')):
            content_type = f'video/{file.filename.split(".")[-1].lower()}'

        return jsonify({
            'id': file.id,
            'filename': file.filename,
            'title': file.title,
            'description': file.description,
            'folder_type': file.folder_type,
            'size': file.size,
            'content_type': content_type,
            'url': file.cloudinary_url,
            'device_name': file.device_name,
            'created_at': file.created_at.isoformat() if file.created_at else None
        }), 200

    except Exception as e:
        print(f"File details error: {e}")
        return jsonify({'error': str(e)}), 500

@quick_upload_bp.route('/move/<file_id>', methods=['POST', 'OPTIONS'])
@jwt_required()
def move_file(file_id):
    if request.method == 'OPTIONS':
        return '', 200

    try:
        current_user_id = get_jwt_identity()
        file = File.query.filter_by(id=file_id, user_id=current_user_id).first()

        if not file:
            return jsonify({'error': 'File not found'}), 404

        data = request.get_json()
        new_folder = data.get('folder_type')

        if not new_folder:
            return jsonify({'error': 'New folder type required'}), 400

        old_folder = file.folder_type
        
        # Move in MinIO if available
        if minio_service.available:
            try:
                old_object = f"{old_folder}/{file_id}_{file.filename}"
                new_object = f"{new_folder}/{file_id}_{file.filename}"
                
                # Get file data
                response = minio_service.client.get_object(minio_service.bucket, old_object)
                file_data = response.read()
                
                # Upload to new location
                from io import BytesIO
                minio_service.client.put_object(
                    minio_service.bucket,
                    new_object,
                    BytesIO(file_data),
                    length=len(file_data)
                )
                
                # Delete old location
                minio_service.client.remove_object(minio_service.bucket, old_object)
            except Exception as e:
                print(f"MinIO move error: {e}")

        # Update database
        file.folder_type = new_folder
        db.session.commit()

        return jsonify({
            'message': 'File moved successfully',
            'new_folder': new_folder,
            'file': {
                'id': file.id,
                'filename': file.filename,
                'title': file.title,
                'description': file.description,
                'folder_type': file.folder_type,
                'size': file.size,
                'device_name': file.device_name,
                'url': file.cloudinary_url,
                'created_at': file.created_at.isoformat() if file.created_at else None
            }
        }), 200

    except Exception as e:
        print(f"Move error: {e}")
        return jsonify({'error': str(e)}), 500

@quick_upload_bp.route('/delete/<file_id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def delete_file(file_id):
    if request.method == 'OPTIONS':
        return '', 200

    try:
        current_user_id = get_jwt_identity()
        file = File.query.filter_by(id=file_id, user_id=current_user_id).first()

        if not file:
            return jsonify({'error': 'File not found'}), 404

        # Delete from MinIO
        if minio_service.available:
            object_name = f"{file.folder_type}/{file_id}_{file.filename}"
            minio_service.delete_file(object_name)

        # Delete from database
        db.session.delete(file)
        db.session.commit()

        return jsonify({'message': 'File deleted successfully'}), 200

    except Exception as e:
        print(f"Delete error: {e}")
        return jsonify({'error': str(e)}), 500
