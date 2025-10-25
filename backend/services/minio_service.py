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

# Global instance
minio_service = MinIOService()