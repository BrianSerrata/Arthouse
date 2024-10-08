# Generated by Django 5.0.6 on 2024-05-25 22:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_generatedimage_user"),
    ]

    operations = [
        migrations.CreateModel(
            name="GeneratedSong",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("user", models.TextField()),
                ("description", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AlterField(
            model_name="generatedimage",
            name="image",
            field=models.URLField(),
        ),
        migrations.CreateModel(
            name="AudioFile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file", models.FileField(upload_to="audio_files/")),
                (
                    "song",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="audio_files",
                        to="api.generatedsong",
                    ),
                ),
            ],
        ),
    ]
