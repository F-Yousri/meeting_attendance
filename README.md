To get up and running:
- docker build -t meeting_attendance .
- edit docker compose env variables to connect the database (both in the db service and the app service)
- docker compose up -d
- use the database created by docker compose (meeting_attendance) and import the database script to create the meeting_attendance table.