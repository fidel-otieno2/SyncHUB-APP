from datetime import datetime

# Track active devices in real-time
active_devices = {}  # {device_name: {'last_seen': datetime, 'ip': str, 'status': 'active'}}

def register_device(device_name, device_type, ip_address, user_email):
    """Register a device as active"""
    active_devices[device_name] = {
        'last_seen': datetime.utcnow(),
        'ip': ip_address,
        'status': 'active',
        'type': device_type,
        'user_email': user_email
    }
    print(f"Device {device_name} marked as ACTIVE")

def get_devices():
    """Get list of all devices with their status"""
    device_list = []
    current_time = datetime.utcnow()
    
    for i, (device_name, device_info) in enumerate(active_devices.items()):
        time_diff = (current_time - device_info['last_seen']).total_seconds()
        status = 'active' if time_diff < 300 else 'inactive'  # 5 minutes threshold
        
        device_list.append({
            'id': device_info.get('db_id', i + 1),
            'name': device_name,
            'type': device_info.get('type', 'laptop'),
            'status': status,
            'last_seen': device_info['last_seen'].isoformat(),
            'is_main_device': i == 0,
            'user_name': device_info.get('user_email', 'user@example.com').split('@')[0],
            'ip_address': device_info.get('ip', '127.0.0.1')
        })
    
    # Default device if none exist
    if len(device_list) == 0:
        device_list = [{
            'id': 1,
            'name': 'Current Device',
            'type': 'laptop',
            'status': 'active',
            'last_seen': datetime.utcnow().isoformat(),
            'is_main_device': True,
            'user_name': 'User',
            'ip_address': '127.0.0.1'
        }]
    
    return device_list