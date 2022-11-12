from django.db import models

class enterSize(models.Model):
    width = models.CharField('Width', max_length = 3)
    height = models.CharField('Height', max_length = 3)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Option'
        verbose_name_plural = 'Options'