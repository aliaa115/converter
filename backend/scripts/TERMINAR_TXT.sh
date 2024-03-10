#!/bin/bash

# Carpeta para almacenar los archivos divididos
carpeta="txt/raw"
carpetaPendiente="txt/pendiente"

# Iterar a través de los archivos en la carpeta
for archivo in "$carpeta"/*; do

  # Get the name of the file without extension
  mv "$archivo" "$carpetaPendiente"

done

sleep 2

echo 'Iniciando conversión de TXT a HTML'
./TXT_TO_HTML.sh
