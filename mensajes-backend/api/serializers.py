from rest_framework import serializers
from .models import Code, Message, Reply, Proveedor

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'

# serializers.py
class MessageSerializer(serializers.ModelSerializer):
    code = serializers.CharField(source='code.code', read_only=True)
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = [
                  "id",
            "code",
            "user",
            "title",
            "text",
            "video",
            "audio",
            "buyer_email",
            "notify_on_read",
            "max_views",
            "views_count",
            "expires_at",
            "created_at",
            "updated_at",
            "is_read",
            "replies",
        ]


class CodeSerializer(serializers.ModelSerializer):
    message = MessageSerializer(read_only=True)

    class Meta:
        model = Code
        fields = '__all__'


class ProveedorSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Proveedor
        fields = [
            'prefix',
            'name',
            'user_info',
            'background_class',
            'background_image',
            'primary_text_class',
            'secondary_text_class',
            'accent_class',
            'card_class',
            'comercial_name',
            'address',
            'phone',
            'email',
            'bio',
            'website',
            'facebook',
            'instagram',
            'twitter',
            'linkedin',
            'tiktok',
        ]
    
    def get_user_info(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'username': obj.user.username,
                'email': obj.user.email,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name,
            }
        return None
