# Generated by Django 5.0.6 on 2024-05-12 16:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checkedhub', '0006_visit'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stay',
            fields=[
                ('experience_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='checkedhub.experience')),
                ('place', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='checkedhub.place')),
            ],
            bases=('checkedhub.experience',),
        ),
    ]
