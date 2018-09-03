mkdir e2e-test-temp
cd e2e-test-temp

# Test app creation
foal createapp my-app
cd my-app
npm install

# Test linting
npm run lint

# Test building
npm run build
npm run build:test

# Run the generated unit tests
npm run start:test

# Test the application when it is started
pm2 start lib/index.js
sleep 1
response=$(
    curl http://localhost:3000 \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" -ge 200 && test "$response" -le 299
pm2 delete index

# Test the default shell scripts to create permissions, groups and users.
node lib/scripts/create-perm name="My first permission" codeName="my-first-perm"
node lib/scripts/create-perm name="My second permission" codeName="my-second-perm"

node lib/scripts/create-group name="My group" codeName="my-group" permissions='[ "my-second-perm" ]'

node lib/scripts/create-user userPermissions='[ "my-first-perm" ]' groups='[ "my-group" ]'