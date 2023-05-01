## Getting Started

To get up and running with the `meeting_attendance` application, follow these steps:

1. Build the Docker image for the `meeting_attendance` application:

```
docker build -t meeting_attendance .
```

2. Edit the Docker Compose environment variables to connect the database. Open the `docker-compose.yml` file and modify the `environment` section for both the `db` and `app` services to set the appropriate values for `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.

3. Start the Docker Compose containers:

```
docker-compose up -d
```

4. Use the database created by Docker Compose (`meeting_attendance`) and import the database script `meeting_attendance.sql` to create the `meeting_attendance` table. You can use a MySQL client such as Adminer or phpMyAdmin to import the script.