from flask import Blueprint, jsonify, request
from datetime import datetime

simple_files_bp = Blueprint('simple_files', __name__)

# Mock file storage
uploaded_files = []

@simple_files_bp.route('', methods=['GET', 'OPTIONS'])
def get_files():
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify(uploaded_files), 200

@simple_files_bp.route('/by-folder/<folder_type>', methods=['GET', 'OPTIONS'])
def get_files_by_folder(folder_type):
    if request.method == 'OPTIONS':
        return '', 200
    
    folder_files = [f for f in uploaded_files if f.get('folder_type') == folder_type]
    return jsonify(folder_files), 200

def add_uploaded_file(file_data):
    uploaded_files.append(file_data)