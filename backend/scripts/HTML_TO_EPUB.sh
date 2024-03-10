#!/bin/bash

# Carpeta que contiene los archivos HTML
carpeta='html/pendiente'
carpeta_terminados='html/terminado'

# Carpeta de destino para los archivos EPUB
carpeta_destino="epub"

for directorio in "$carpeta"/*; do
  # Obtener el nombre del directorio
  dir=$(basename "$directorio")

  # Imprimir el nombre del directorio
  echo "Directorio: $dir"
  if [ -d "$carpeta/$dir" ]; then
    echo "Aqui"

    fecha_actual=$(date +%Y%m%d)

    # Crear la carpeta de destino si no existe
    carpeta_de_guardado="$carpeta_destino/$fecha_actual"
    mkdir -p "$carpeta_de_guardado"

    if [ -f "covers/$dir.jpg" ]; then
      ebook-convert "$carpeta/$dir/index.html" "$carpeta_de_guardado/$dir.epub" --cover "covers/$dir.jpg"

    else
      ebook-convert "$carpeta/$dir/index.html" "$carpeta_de_guardado/$dir.epub"

    fi

    echo "Archivo EPUB generado: $carpeta_de_guardado/$dir.epub"

    rm -r "$carpeta_terminados/$dir"
    mv "$carpeta/$dir" "$carpeta_terminados/$dir"
  fi
done

# for dir in $(ls "$directory"); do
#   # Check if the directory is a directory
#   if [ -d "$carpeta/$dir" ]; then
#     # Print the name of the directory
#     echo "$dir"
#   fi
# done
