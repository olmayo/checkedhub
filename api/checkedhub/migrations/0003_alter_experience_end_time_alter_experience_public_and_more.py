# Generated by Django 5.0.6 on 2024-05-11 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checkedhub', '0002_remove_flight_end_date_remove_flight_end_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experience',
            name='end_time',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='experience',
            name='public',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='experience',
            name='start_time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
