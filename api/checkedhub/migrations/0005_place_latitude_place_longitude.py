# Generated by Django 5.0.6 on 2024-05-12 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checkedhub', '0004_place_flight_airport_arrival_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='latitude',
            field=models.DecimalField(decimal_places=15, default=0, max_digits=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='place',
            name='longitude',
            field=models.DecimalField(decimal_places=15, default=0, max_digits=20),
            preserve_default=False,
        ),
    ]
