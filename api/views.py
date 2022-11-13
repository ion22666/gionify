from rest_framework import status
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.response import Response

from api.serializers import MusicSer
from musics.models import Music


@api_view(['GET'])
def music_list(request):
    if request.method == "GET":
        serializer = MusicSer(Music.objects.all(),many=True)
        return Response(serializer.data)
        
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = MusicSer(data=data)
        print(serializer)
        print(type(serializer))
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
    return HttpResponse(status=405)

@api_view(['GET', 'PUT', 'DELETE'])
def music_detail(request,pk,format = None):

    try:
        music = Music.objects.get(pk=pk)
    except Music.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        return Response(MusicSer(music).data, status=status.HTTP_200_OK)

    if request.method == "PUT":
        instance = MusicSer(music,data=request.data)
        if instance.is_valid(raise_exception=True):
            instance.save()
            return Response(instance.data, status=status.HTTP_202_ACCEPTED)
    
    if request.method == "DELETE":
        music.delete()
        return Response(instance.data, status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)