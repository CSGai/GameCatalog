@echo off
echo "shutting down database.."

mongosh admin --eval "db.shutdownServer()"

echo "database has been shut down"