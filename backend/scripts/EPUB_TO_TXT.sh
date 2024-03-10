#!/bin/bash

function trim() {
    echo "$1" | sed -e 's/^[ ]*//g' -e 's/[ ]*\$//g'
}

echo "Pasando a carpeta: $1"
cd "$1"

pwd

# Carpeta que contiene los archivos a convertir
carpeta_de_archivos_pendientes="./raw/pendiente"
carpeta_de_archivos_terminados="./raw/terminado"

# Carpeta destino de archivos convertidos
carpeta_de_convertidos="./txt/raw"

# Get a list of all the files in the current directory
files=$(ls "$carpeta_de_archivos_pendientes")

# Filter the list to only include EPUB files
epub_files=$(echo "$files" | grep -E ".*\.epub$")

# Loop over each EPUB file
for file in "$epub_files"; do

    # Do something with the file
    echo "$file"

    # Get the title of the book
    title=$(ebook-meta "$carpeta_de_archivos_pendientes/$file" | cut -d ':' -f2 | head -1)

    echo "titulo: $title"

    titulo=$(trim "$title")

    cover="./covers/$titulo"

    ebook-meta "$carpeta_de_archivos_pendientes/$file" --get-cover "$cover.jpg"

    echo "titulo: $titulo"

    archivo_txt="$carpeta_de_convertidos/$titulo.txt"

    ebook-convert "$carpeta_de_archivos_pendientes/$file" "$archivo_txt" --txt-output-formatting=plain

    echo mv "$carpeta_de_archivos_pendientes/$file $carpeta_de_archivos_terminados"

    mv "$carpeta_de_archivos_pendientes/$file" "$carpeta_de_archivos_terminados"

done
