from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, {'width': 12, 'height': 20}),
    path('settings', views.settings),
    path('width<int:width>/height<int:height>', views.changeSize)
]
