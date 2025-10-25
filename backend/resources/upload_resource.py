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
            
            # Mock successful upload response
            return {
                'message': 'File uploaded successfully',
                'file_id': file_id,
                'filename': file.filename,
                'title': title,
                'description': description,
                'folder_type': folder_type,
                'size': len(file.read()),
                'device_name': device_name,
                'url': f'https://mock-url.com/{file_id}',
                'public_id': f'synchub/{folder_type}/{filename}',
                'created_at': datetime.utcnow().isoformat()
            }, 201
                
        except Exception as e:
            return {'error': str(e)}, 500
    
    def options(self):
        return '', 200