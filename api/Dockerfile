# syntax=docker/dockerfile:1
FROM --platform=linux/amd64 python:3.12
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY . /code/

WORKDIR /code
COPY requirements.txt /code/
RUN pip install --upgrade --no-cache-dir -r requirements.txt