try:
    import cloudinary
    import cloudinary.uploader
    from config import Config
    
    # Configure Cloudinary
    cloudinary.config(
        cloud_name=Config.CLOUDINARY_CLOUD_NAME,
        api_key=Config.CLOUDINARY_API_KEY,
        api_secret=Config.CLOUDINARY_API_SECRET
    )
    CLOUDINARY_AVAILABLE = True
except ImportError:
    CLOUDINARY_AVAILABLE = False
    print("Cloudinary not available - install with: pip install cloudinary")

def upload_file(file_data, filename, folder_type):
    """Upload file to Cloudinary"""
    if not CLOUDINARY_AVAILABLE:
        return {
            'success': False,
            'error': 'Cloudinary not configured'
        }
    
    try:
        result = cloudinary.uploader.upload(
            file_data,
            public_id=f"synchub/{folder_type}/{filename}",
            resource_type="auto",
            folder=f"synchub/{folder_type}"
        )
        return {
            'success': True,
            'url': result['secure_url'],
            'public_id': result['public_id'],
            'size': result.get('bytes', 0)
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def delete_file(public_id):
    """Delete file from Cloudinary"""
    if not CLOUDINARY_AVAILABLE:
        return False
    
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result['result'] == 'ok'
    except Exception as e:
        return False

def get_file_url(public_id):
    """Get file URL from Cloudinary"""
    if not CLOUDINARY_AVAILABLE:
        return None
    
    try:
        return cloudinary.CloudinaryImage(public_id).build_url()
    except Exception as e:
        return None