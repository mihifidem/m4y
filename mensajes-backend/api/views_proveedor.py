from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProveedorSerializer

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def get_user_proveedor(request):
    """Obtener o actualizar el proveedor asociado al usuario autenticado"""
    try:
        if not hasattr(request.user, 'proveedor') or not request.user.proveedor:
            return Response({
                "has_proveedor": False,
                "message": "Este usuario no tiene un proveedor asignado"
            }, status=200)
        
        proveedor = request.user.proveedor
        
        if request.method == "GET":
            serializer = ProveedorSerializer(proveedor)
            return Response({
                "has_proveedor": True,
                "proveedor": serializer.data
            }, status=200)
        
        elif request.method == "PUT":
            # Actualizar información del proveedor
            serializer = ProveedorSerializer(proveedor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "success": True,
                    "message": "Información actualizada correctamente",
                    "proveedor": serializer.data
                }, status=200)
            return Response({
                "success": False,
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)
