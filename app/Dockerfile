FROM python:3.8-slim-buster

WORKDIR /app

COPY entrypoint.sh /entrypoint.sh
RUN useradd appuser
RUN groupadd appgroup
ENTRYPOINT ["/bin/sh", "entrypoint.sh"]

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD ["./start.sh"]