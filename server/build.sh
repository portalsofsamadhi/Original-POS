#!/bin/bash

# Build script for the POS Website server

echo "Building server..."
cd server
npm run build

echo "Server build complete!"
