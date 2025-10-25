from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Integer()
    email = fields.String()
    name = fields.String()
    role = fields.String()
    is_active = fields.Boolean()

class FileSchema(Schema):
    id = fields.String()
    filename = fields.String()
    title = fields.String()
    description = fields.String()
    folder_type = fields.String()
    size = fields.Integer()
    device_name = fields.String()
    cloudinary_url = fields.String()
    cloudinary_public_id = fields.String()
    created_at = fields.DateTime(format='%Y-%m-%d %H:%M:%S')