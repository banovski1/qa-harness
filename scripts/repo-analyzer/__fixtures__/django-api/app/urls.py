from django.urls import path
urlpatterns = [
    path('api/orders/', views.orders),
    path('api/orders/<int:order_id>/', views.order_detail),
]
