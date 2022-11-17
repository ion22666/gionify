import json
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from rest_framework import permissions
from django.core import exceptions

from .permissions import IsOwnerOrReadOnly
from api.serializers import MusicSer
from musics.models import Music
from colorthief import ColorThief

class MusicList(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly]

    def get(self, request, format=None):
        try:
            data = dict(request.GET)
            order_by = ''.join(data.get('order_by','id'))
            try:
                rows = abs(int(''.join(data.get('rows','10')).replace(',','.').split('.')[0])) 
            except ValueError:
                rows = 10
            songs = Music.objects.all().order_by(order_by)[0:rows]
            serializer = MusicSer(songs, many=True)
            return Response(serializer.data)
        except exceptions.FieldError:
            return Response({'error':'FieldError, order_by must be in ['+', '.join(get_model_fields(Music))+']'},status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        serializer = MusicSer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MusicDetail(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly]

    def get_object(self, pk):
        try:
            return Music.objects.get(pk=pk)
        except Music.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        song = self.get_object(pk)
        serializer = MusicSer(song)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        song = self.get_object(pk)
        serializer = MusicSer(song, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        song = self.get_object(pk)
        song.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(('GET',))
def get_dominant_colors(request,pk,format='json'):
    data = dict(request.GET)
    color_count = abs(int(''.join(data.get('color_count','2')).replace(',','.').split('.')[0]))
    id = abs(int(''.join(data.get('id','0')).replace(',','.').split('.')[0]))
    try:
        return Response({'dominant_colors':ColorThief(Music.objects.get(pk=pk).cover_image).get_palette(color_count=color_count)},status=status.HTTP_200_OK)
    except Music.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

def get_model_fields(model):
    return [ field.name for field in model._meta.fields]