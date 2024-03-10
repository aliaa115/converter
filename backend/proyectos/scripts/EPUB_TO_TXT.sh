#!/bin/bash

function trim() {
    echo "$1" | sed -e 's/^[ ]*//g' -e 's/[ ]*\$//g'
}

echo "Pasando a carpeta: $1"
cd "$1"

echo "Obteniendo Archivo: $2"

pwd

if [ ! -d "./covers" ]; then
mkdir -p "./covers"
fi

# Carpeta que contiene los archivos a convertir
carpeta_de_archivos_pendientes="./ingresados"

# Carpeta destino de archivos convertidos
carpeta_de_convertidos="./txt/raw"
if [ ! -d "$carpeta_de_convertidos" ]; then
mkdir -p "$carpeta_de_convertidos"
fi

# Obtener el archivo pasado
file="$2"

# Do something with the file
echo "$carpeta_de_archivos_pendientes/$file"

# Get the title of the book
title=$(ebook-meta "$carpeta_de_archivos_pendientes/$file" | cut -d ':' -f2 | head -1)

echo "titulo: $title"

titulo=$(trim "$title")

cover="./covers/$titulo"

ebook-meta "$carpeta_de_archivos_pendientes/$file" --get-cover "$cover.jpg"

echo "titulo: $titulo"

archivo_txt="$carpeta_de_convertidos/$titulo.txt"

ebook-convert "$carpeta_de_archivos_pendientes/$file" "$archivo_txt" --txt-output-formatting=plain

echo "./covers"
echo "$titulo.jpg"
echo "$carpeta_de_convertidos"
echo "$titulo.txt"