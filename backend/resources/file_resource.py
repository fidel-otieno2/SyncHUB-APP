from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from flask import request
from models import db, File
from serializers import FileSchema
import cloudinary.uploader
import uuid
from datetime import datetime

file_schema = FileSchema()
files_schema = FileSchema(many=True)

class FileListResource(Resource):
    """
    File List Resource
    ---
    get:
      tags:
        - Files
      summary: Get all files
      responses:
        200:
          description: List of files
    post:
      tags:
        - Files
      summary: Upload a file
      responses:
        201:
          description: File uploaded successfully
    """
    
    def get(self):
        try:
            db.create_all()
            files = File.query.all()
            return files_schema.dump(files), 200
        except Exception as e:
            return {'error': str(e)}, 500
    
    def post(self):
        try:
            if 'file' not in request.files:
                return {'error': 'No file provided'}, 400
            
            file = request.files['file']
            if file.filename == '':
                return {'error': 'No file selected'}, 400
                
            title = request.form.get('title', file.filename)
            folder_type = request.form.get('folder_type', 'documents')
            device_name = request.form.get('device_name', 'Unknown Device')
            description = request.form.get('description', '')
            
            file_id = str(uuid.uuid4())
            filename = f"{file_id}_{file.filename}"
            
            try:
                file.stream.seek(0)
                result = cloudinary.uploader.upload(
                    file.stream,
                    public_id=f"synchub/{folder_type}/{filename}",
                    resource_type="auto"
                )
                
                db.create_all()
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
                
                return file_schema.dump(db_file), 201
            except Exception as cloud_error:
                return {'error': f'Upload failed: {str(cloud_error)}'}, 500
                
        except Exception as e:
            return {'error': str(e)}, 500

class FileResource(Resource):
    """
    File Resource
    ---
    get:
      tags:
        - Files
      summary: Get file by ID
      parameters:
        - name: file_id
          in: path
          required: true
          type: string
      responses:
        200:
          description: File details
        404:
          description: File not found
    """
    
    def get(self, file_id):
        try:
            db.create_all()
            file = File.query.get(file_id)
            if not file:
                return {'error': 'File not found'}, 404
            return file_schema.dump(file), 200
        except Exception as e:
            return {'error': str(e)}, 500