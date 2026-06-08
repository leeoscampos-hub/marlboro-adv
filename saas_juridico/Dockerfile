FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV APP_HOST=0.0.0.0
ENV APP_PORT=8765

WORKDIR /app

RUN addgroup --system lexflow && adduser --system --ingroup lexflow lexflow

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py ./server.py
COPY field_crypto.py ./field_crypto.py
COPY db_crypto.py ./db_crypto.py
COPY static ./static

RUN chown -R lexflow:lexflow /app
USER lexflow

EXPOSE 8765

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8765/api/health', timeout=3).read()"

CMD ["python", "server.py"]
