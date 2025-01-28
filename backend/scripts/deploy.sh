#!/bin/bash

# Stop running containers
docker-compose down

# Pull latest images
docker-compose pull

# Start containers
docker-compose up -d

# Clean up unused images
docker image prune -f 