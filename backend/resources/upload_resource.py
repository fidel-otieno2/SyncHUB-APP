from flask_restful import Resource
from flask import request
from models import db, File
from serializers import FileSchema
import uuid
from datetime import datetime

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
except:
    CLOUDINARY_AVAILABLE = False

file_schema = FileSchema()

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
            
            if CLOUDINARY_AVAILABLE:
                file.stream.seek(0)
                result = cloudinary.uploader.upload(
                    file.stream,
                    public_id=f"synchub/{folder_type}/{filename}",
                    resource_type="auto"
                )
                
                # Save to database
                try:
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
                except Exception as db_error:
                    print(f"Database save failed: {db_error}")
                    return {
                        'message': 'File uploaded to Cloudinary but database save failed',
                        'file_id': file_id,
                        'filename': file.filename,
                        'url': result['secure_url']
                    }, 201
            else:
                return {'error': 'Cloudinary not configured'}, 500
                
        except Exception as e:
            return {'error': str(e)}, 500
    
    def options(self):
        return '', 200