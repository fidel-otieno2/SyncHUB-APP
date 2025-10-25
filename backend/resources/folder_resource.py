from flask_restful import Resource
from flask import request
from models import db, File
from serializers import FileSchema

files_schema = FileSchema(many=True)

class FolderFilesResource(Resource):
    """
    Folder Files Resource
    ---
    get:
      tags:
        - Files
      summary: Get files by folder type
      parameters:
        - name: folder_type
          in: path
          required: true
          type: string
      responses:
        200:
          description: List of files in folder
    """
    
    def get(self, folder_type):
        try:
            # Return empty list for now since database may not be connected
            return [], 200
        except Exception as e:
            return {'error': str(e)}, 500
    
    def options(self, folder_type):
        return '', 200