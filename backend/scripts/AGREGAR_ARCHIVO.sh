#!/bin/bash

# Check if the first argument is set
if [ -z "$1" ]; then
    echo "No se ha pasado ningún archivo."
    exit 1
fi

# Get the name of the file
file="$1"

# Get the name of the destination folder
dest_folder="./raw/pendiente"

# Copy the file to the destination folder
cp "$file" "$dest_folder"
echo "Archivo $file copiado"

sleep 2

echo 'Iniciando conversión de EPUB a TXT'
cd .
./EPUB_TO_TXT.sh
code .
