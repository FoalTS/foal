mkdir e2e-test-temp
cd e2e-test-temp

# Test app creation
foal createapp my-app
cd my-app
npm install

# Test linting
npm run lint

# Test the generators that do not require user interaction
foal g entity flight
foal g hook foo-bar
foal g module bar-foo
foal g script bar-script

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
foal run-script create-perm name="My first permission" codeName="my-first-perm"
foal run-script create-perm name="My second permission" codeName="my-second-perm"

foal run-script create-group name="My group" codeName="my-group" permissions='[ "my-second-perm" ]'

foal run-script create-user userPermissions='[ "my-first-perm" ]' groups='[ "my-group" ]'