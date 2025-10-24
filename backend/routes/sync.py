from flask import Blueprint, jsonify, request

sync_bp = Blueprint('sync', __name__)

@sync_bp.route('/status', methods=['GET', 'OPTIONS'])
def sync_status():
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        'status': 'synced',
        'last_sync': '2025-10-24T19:30:00Z',
        'devices_count': 1
    }), 200

@sync_bp.route('/trigger', methods=['POST', 'OPTIONS'])
def trigger_sync():
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        'message': 'Sync triggered successfully',
        'status': 'syncing'
    }), 200