from django.shortcuts import render, redirect

def index(request, width, height):
    return render(request, 'main/tetris.html', {'width': width, 'height': height})

def settings(request):
    return render(request, 'main/settings.html')

def changeSize(request, width, height):
    return render(request, 'main/tetris.html', {'width': width, 'height': height})