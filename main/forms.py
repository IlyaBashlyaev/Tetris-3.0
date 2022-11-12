from .models import enterSize
from django.forms import ModelForm, TextInput

class enterSizeForm(ModelForm):
    class Meta:
        model = Task
        fields = ['width', 'height']

        widgets = {
            'width': TextInput(attrs = {
                'class': 'form-width',
                'placeholder': 'Enter the width'
            }),

            'height': TextInput(attrs = {
                'class': 'form-height',
                'placeholder': 'Enter the height'
            })
        }