# Используем официальный образ MongoDB
FROM mongo:latest

# Устанавливаем переменные окружения
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=root
ENV MONGO_INITDB_DATABASE=root

# Создаем директорию для данных MongoDB
VOLUME /data/db

# Экспонируем стандартный порт MongoDB
EXPOSE 27017

# Команда по умолчанию
CMD ["mongod"]