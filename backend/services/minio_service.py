from minio import Minio
from config import Config
import uuid
from io import BytesIO

class MinIOService:
    def __init__(self):
        try:
            self.client = Minio(
                Config.MINIO_ENDPOINT,
                access_key=Config.MINIO_ACCESS_KEY,
                secret_key=Config.MINIO_SECRET_KEY,
                secure=Config.MINIO_SECURE
            )
            self.bucket = Config.MINIO_BUCKET
            self._ensure_bucket()
            self.available = True
        except Exception as e:
            print(f"MinIO not available: {e}")
            self.available = False
    
    def _ensure_bucket(self):
        if not self.client.bucket_exists(self.bucket):
            self.client.make_bucket(self.bucket)
    
    def upload_file(self, file_stream, filename, folder_type, metadata=None):
        if not self.available:
            raise Exception("MinIO service not available")
        
        file_id = str(uuid.uuid4())
        object_name = f"{folder_type}/{file_id}_{filename}"
        
        file_stream.seek(0)
        file_data = file_stream.read()
        file_size = len(file_data)
        
        self.client.put_object(
            self.bucket,
            object_name,
            BytesIO(file_data),
            length=file_size,
            metadata=metadata or {}
        )
        
        return {
            'object_name': object_name,
            'file_id': file_id,
            'size': file_size,
            'url': f"http://{Config.MINIO_ENDPOINT}/{self.bucket}/{object_name}"
        }
    
    def get_file_url(self, object_name):
        if not self.available:
            return None
        return self.client.presigned_get_object(self.bucket, object_name)
    
    def delete_file(self, object_name):
        if not self.available:
            return False
        try:
            self.client.remove_object(self.bucket, object_name)
            return True
        except:
            return False
    
    def list_files(self, folder_type=None):
        if not self.available:
            return []
        
        try:
            prefix = f"{folder_type}/" if folder_type else ""
            objects = self.client.list_objects(self.bucket, prefix=prefix, recursive=True)
            
            files = []
            for obj in objects:
                try:
                    # Get object metadata
                    stat = self.client.stat_object(self.bucket, obj.object_name)
                    metadata = stat.metadata or {}
                    
                    # Parse object name to get file info
                    path_parts = obj.object_name.split('/')
                    if len(path_parts) >= 2:
                        folder = path_parts[0]
                        filename_with_id = path_parts[1]
                        # Extract original filename (remove UUID prefix)
                        if '_' in filename_with_id:
                            file_id = filename_with_id.split('_')[0]
                            original_filename = '_'.join(filename_with_id.split('_')[1:])
                        else:
                            file_id = filename_with_id
                            original_filename = filename_with_id
                    else:
                        folder = 'documents'
                        file_id = obj.object_name
                        original_filename = obj.object_name
                    
                    files.append({
                        'id': file_id,
                        'filename': original_filename,
                        'title': metadata.get('title', original_filename),
                        'description': metadata.get('description', ''),
                        'folder_type': folder,
                        'size': obj.size,
                        'device_name': metadata.get('device', 'Unknown Device'),
                        'url': f"http://{Config.MINIO_ENDPOINT}/{self.bucket}/{obj.object_name}",
                        'object_name': obj.object_name,
                        'created_at': obj.last_modified.isoformat() if obj.last_modified else None
                    })
                except Exception as e:
                    print(f"Error processing file {obj.object_name}: {e}")
                    continue
            
            return files
        except Exception as e:
            print(f"Error listing files: {e}")
            return []

# Global instance
minio_service = MinIOService()