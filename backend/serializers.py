from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from models import User, File

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash',)

class FileSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = File
        load_instance = True
    
    created_at = fields.DateTime(format='%Y-%m-%d %H:%M:%S')