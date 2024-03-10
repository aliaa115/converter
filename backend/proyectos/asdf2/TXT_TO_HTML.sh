#!/bin/bash

echo "Pasando a carpeta: $1"
cd "$1"

echo "Obteniendo Archivo: $2"

pwd


# Carpeta para almacenar los archivos divididos
carpeta="txt"
carpetaDestino="html"

# Separador de capítulos
separador="Capítulo"
# separador1="Extra"
# separador2="Último Episodio"


if [ ! -d $carpetaDestino ]; then
mkdir -p -r $carpetaDestino
fi

# Iterar a través de los archivos en la carpeta
# for archivo in "$carpeta"/*; do

archivo="$carpeta/$2"

# Get the name of the file without extension
name=$(basename "$archivo" | sed -e 's/\.[^.]*$//')
archivo_index="$name.html"

carpeta_destino=$carpetaDestino/$name

if [ ! -d "$carpeta_destino" ]; then
  mkdir -p "$carpeta_destino"
fi

echo "<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>
      $name
    </title>
  </head>
  <body><h1>$name</h1>" >"$carpeta_destino/$archivo_index"

  if [ -f "$archivo" ]; then
    # Leer el archivo línea por línea
    while IFS= read -r linea; do
      # Verificar si la línea comienza con el separador de capítulos
      if [[ $linea == "$separador"* ]]; then
        if [ -f "$archivo" ]; then
          if [ -f "$nombre_archivo" ]; then
            echo "</body>
</html>" >>"$nombre_archivo"
          fi
        fi
        # Obtener el número de capítulo
        capitulo=$(echo "$linea" | awk -F ": " '{print $1}' | awk -F " " '{print $2}' | tr -d ':')

        linea=$(echo "$linea" | tr -d ':')

        # Crear el nombre del archivo de destino
        nombre_archivo="$carpeta_destino/$linea.html"

        # Imprimir el nombre del archivo en la consola
        # echo "$nombre_archivo"

        # Escribir el contenido del capítulo en el archivo de destino
        # echo $archivo_index
        echo "<div><a href=\"./$linea.html\">$linea</a></div>" >>"$carpeta_destino/$archivo_index"
        echo "<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>
          $name: $linea
        </title>
      </head>
      <body><h2>$linea</h2>" >"$nombre_archivo"
      else
        echo "<div>$linea</div>" >>"$nombre_archivo"
      fi

    done <"$archivo"
  fi

echo "</body>
</html>" >>"$carpeta_destino/$archivo_index"


# mv "$archivo" "$carpetaTerminados"
# done

echo "$carpeta_destino"
echo "$archivo_index"
