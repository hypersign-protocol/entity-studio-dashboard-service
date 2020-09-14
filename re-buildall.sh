echo "================REBUILDING START========================="
echo ""
echo ""
echo "Setting up client=================================="
cd client
echo "Cleaning up..."
rm -rf node_modules
rm -rf dist
echo "Cleanup done."
echo "Installing node modules..."
npm i
echo "Node module installation done."
echo "Building the project...."
npm run build-stage
echo "Building done."
echo "Client setup done=================================="
cd -

echo "Setting up server=================================="
cd server
echo "Cleaning up..."
rm -rf node_modules
rm -rf dist
echo "Cleanup done."
echo "Installing node modules..."
npm i
echo "Node module installation done."
echo "Building the project...."
npm run setup
echo "Building done."
echo "Server setup done=================================="
echo ""
echo ""
echo "================REBUILDING FINISHED========================="
exit


