from flask_restful import Resource
from flask import request
import cloudinary.uploader
import uuid
from datetime import datetime

class FileUploadResource(Resource):
    """
    File Upload Resource
    ---
    post:
      tags:
        - Files
      summary: Upload a file
      responses:
        201:
          description: File uploaded successfully
    """
    
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
                
                return {
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
                }, 201
            except Exception as cloud_error:
                return {'error': f'Upload failed: {str(cloud_error)}'}, 500
                
        except Exception as e:
            return {'error': str(e)}, 500
    
    def options(self):
        return '', 200