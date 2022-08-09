# darker-engine-template

Lightweight functional template implementation of the `darker-engine`.

## How to start?

First...

`yarn`

Next...

`yarn run start`

And finally go to...

`localhost:8080`



https://stackoverflow.com/questions/67344365/electron-why-do-we-need-to-communicate-between-the-main-process-and-the-render
https://stackoverflow.com/questions/38067298/saving-files-locally-with-electron
https://github.com/JoshuaWise/better-sqlite3/issues/620



### Compile on linux (from windows)

https://github.com/electron-userland/electron-builder/issues/4318#issuecomment-704069548

```
docker pull electronuserland/builder
```
```
docker run --rm -ti -v C:\c\pagoru\unrefined-engine\:/project -w /project electronuserland/builder
```

```
yarn upgrade
yarn global add electron-builder
yarn run pack:linux
```


```
npm install --platform=linux --arch=x64 sharp --sharp-install-force
```