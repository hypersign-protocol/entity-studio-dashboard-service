cd client
# rm -rf node_modules
rm -rf dist
npm i
npm run build-stage
cd -

cd server
# rm -rf node_modules
rm -rf dist
npm i
npm run setup
exit
