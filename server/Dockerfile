# Используем официальный Node.js образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходники
COPY . .

# Собираем TypeScript (если нужен)
RUN npm run build

# Открываем порт (по умолчанию 8080 для Fly.io)
EXPOSE 8080

# Запускаем сервер
CMD ["npm", "run", "start"] 