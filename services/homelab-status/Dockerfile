FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py checks.yaml ./
ENV DB_PATH=/data/status.db CHECKS_FILE=/app/checks.yaml
VOLUME ["/data"]
EXPOSE 8787
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8787"]
