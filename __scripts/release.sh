#!/bin/bash

export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

TMP_FOLDER=".tmp-build"

_copy_tmp() {
  rm -r "${TMP_FOLDER}"
  mkdir "./${TMP_FOLDER}"

  local files=("src" "icons" "package.json" "yarn.lock" "tsconfig.json" "webpack.config.js" "__binaries" "__scripts")
  for file in ${files[@]}; do
    cp -R "./${file}" "./${TMP_FOLDER}/${file}"
  done
}

_copy_tmp
cd ${TMP_FOLDER}

yarn

echo \*\* Voidpixel Release Wizard \*\*

NAME=$(cat package.json  | jq -r '.name')
VERSION=$(cat package.json  | jq -r '.version')

VERSION_ARR=(${VERSION//./ })
BUILD_ID=$VERSION_ARR

BUILD_NAME="build-${BUILD_ID}"
echo "We are gonna release \"${BUILD_NAME}\"!"

sleep 2

PLATFORMS=()

_set_platform() {
  local options=("all" "mac" "linux" "win")
  echo build-$BUILD_ID selected!
  echo "What platforms you want to compile?"
  local selected_option=$(printf "%s\n" "${options[@]}" | fzf --reverse --height 40%)
  case ${selected_option} in
    ("all")
      PLATFORMS=("mac" "linux" "win")
      ;;
    ("mac")
      PLATFORMS=("mac")
      ;;
    ("linux")
      PLATFORMS=("linux")
      ;;
    ("win")
      PLATFORMS=("win")
      ;;
  esac
}


EXTENSION=""
FILE_NAME=""

_cp_build() {
  COPY_FROM="./dist/${FILE_NAME}${EXTENSION}"
  COPY_TO="../__builds/${NAME}_${BUILD_NAME}${EXTENSION}"
  echo "${COPY_FROM} -> ${COPY_TO}"
  cp "${COPY_FROM}" "${COPY_TO}"
}

_build_files() {
  for PLATFORM in ${PLATFORMS[@]}; do
     echo "Start building... ${PLATFORM}!"
     case $PLATFORM in
         ("mac")
            npm run pack:mac
            FILE_NAME="${NAME}-${VERSION}"
            EXTENSION=".dmg"
            _cp_build
            ;;
         ("linux")
            npm run pack:linux
            FILE_NAME="${NAME}-${VERSION}"
            EXTENSION=".tar.gz"
            _cp_build
            ;;
         ("win")
            npm run pack:win
            FILE_NAME="${NAME} ${VERSION}"
            EXTENSION=".exe"
            _cp_build
            ;;
     esac
     echo "${PLATFORM} done!"
  done
  echo "${BUILD_NAME} done!"
}
_select_build
_set_platform
_build_files