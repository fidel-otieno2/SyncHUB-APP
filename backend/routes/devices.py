from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from device_manager import get_devices, register_device, active_devices
import uuid

devices_bp = Blueprint('devices', __name__)

@devices_bp.route('', methods=['GET', 'OPTIONS'])
def get_devices_list():
    if request.method == 'OPTIONS':
        return '', 200
    
    device_list = get_devices()
    print(f"Returning {len(device_list)} devices from active tracking")
    return jsonify(device_list), 200

@devices_bp.route('/register', methods=['POST', 'OPTIONS'])
def register_device_endpoint():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json() or {}
        print(f"Received device registration data: {data}")
        
        device_name = data.get('device_name', 'New Device')
        device_type = data.get('device_type', 'laptop')
        user_email = data.get('email', 'unknown@example.com')
        ip_address = request.remote_addr or '127.0.0.1'
        
        device_id = str(uuid.uuid4())[:8]
        
        active_devices[device_name] = {
            'last_seen': datetime.utcnow(),
            'ip': ip_address,
            'status': 'active',
            'type': device_type,
            'user_email': user_email,
            'db_id': device_id
        }
        
        print(f"Device registered successfully: {device_name} (ID: {device_id})")
        
        return jsonify({
            'message': 'Device registered successfully',
            'device': {
                'id': device_id,
                'name': device_name,
                'type': device_type,
                'status': 'active'
            }
        }), 201
    except Exception as e:
        print(f"Error registering device: {e}")
        return jsonify({'error': str(e)}), 500

@devices_bp.route('/heartbeat', methods=['POST', 'OPTIONS'])
def device_heartbeat():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        user_agent = request.headers.get('User-Agent', '')
        ip_address = request.remote_addr or '127.0.0.1'
        
        is_mobile = any(x in user_agent.lower() for x in ['mobile', 'android', 'iphone', 'ipad'])
        device_type = 'phone' if is_mobile else 'laptop'
        device_name = f"{'Phone' if is_mobile else 'Laptop'} Device"
        
        active_devices[device_name] = {
            'last_seen': datetime.utcnow(),
            'ip': ip_address,
            'status': 'active',
            'type': device_type,
            'user_email': 'user@example.com'
        }
        
        print(f"Heartbeat: {device_name} marked as ACTIVE")
        
        return jsonify({'message': 'Heartbeat received', 'device': device_name}), 200
    except Exception as e:
        print(f"Heartbeat error: {e}")
        return jsonify({'error': str(e)}), 500