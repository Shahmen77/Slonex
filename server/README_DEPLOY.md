# Деплой backend на Render

1. **Зарегистрируйтесь** на https://render.com/ (можно через GitHub).
2. **Создайте новый Web Service**:
   - Нажмите "New +" → "Web Service".
   - Подключите ваш репозиторий (или загрузите проект).
   - Выберите папку `server` как корневую для backend.
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Environment: Node
3. **Добавьте переменные окружения** (Environment):
   - `DATABASE_URL` — строка подключения к вашей базе данных (Postgres).
   - `JWT_SECRET` — любой длинный секрет (например, сгенерируйте на https://generate-random.org/).
   - `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` — данные вашей почты для отправки писем.
   - `CLIENT_URL` — адрес вашего фронта (например, https://your-frontend.netlify.app)
4. **Нажмите Deploy**. Render сам соберёт и запустит сервер.
5. После запуска вы увидите ссылку вида `https://your-backend-name.onrender.com`.
6. Для фронта используйте: `https://your-backend-name.onrender.com/api` в переменной VITE_API_URL.

**Важно:**
- Если нужна бесплатная база данных — Render позволяет создать бесплатный Postgres (нажмите "New +" → "PostgreSQL").
- Если возникнут ошибки — смотрите логи на вкладке "Logs".
- Если нужна помощь — пишите! 