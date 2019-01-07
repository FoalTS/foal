mkdir e2e-test-temp
cd e2e-test-temp

# Test app creation
foal createapp my-app
cd my-app

# Test the generators
foal g entity flight
foal g hook foo-bar
foal g service foo
foal g controller bar --register
foal g rest-api product --register
foal g sub-app bar-foo
foal g script bar-script

# Test linting
npm run lint

# Build the app
npm run build:app

# Build and run the migrations
npm run migration:generate -- -n my-migration
npm run build:migrations
npm run migration:run

# Build and run the unit tests
npm run build:test
npm run start:test

# Build and run the e2e tests
npm run build:e2e
npm run start:e2e

# Test the application when it is started
pm2 start build/index.js
sleep 1
response=$(
    curl http://localhost:3000 \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" -ge 200 && test "$response" -le 299

# Test the REST API
# TODO: use a function for the tests below.

# GET /products -> 200
response=$(
    curl http://localhost:3000/products \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" = 200

# POST /products -> 201
response=$(
    curl http://localhost:3000/products \
        -X POST \
        -d '{ "text": "value1" }' \
        -H "Content-Type: application/json"  \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" = 201

# POST /products -> 400
response=$(
    curl http://localhost:3000/products \
        -X POST \
        -d '{}' \
        -H "Content-Type: application/json"  \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" = 400

# GET /products/1 -> 200
response=$(
    curl http://localhost:3000/products/1 \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" = 200

# GET /products/2 -> 404
response=$(
    curl http://localhost:3000/products/2 \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" = 404

# PUT /products/1 -> 200
response=$(
    curl http://localhost:3000/products/1 \
        -X PUT \
        -d '{ "text": "value2" }' \
        -H "Content-Type: application/json"  \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" = 200

# DELETE /products/1 -> 200
response=$(
    curl http://localhost:3000/products/1 \
        -X DELETE \
        -d '{ "text": "value1" }' \
        -H "Content-Type: application/json"  \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" = 200

# DELETE /products/1 -> 404
response=$(
    curl http://localhost:3000/products/1 \
        -X DELETE \
        -d '{ "text": "value1" }' \
        -H "Content-Type: application/json"  \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" = 404

pm2 delete index

# Test the default shell scripts to create permissions, groups and users.
npm run build:scripts

# foal run-script create-perm name="My first permission" codeName="my-first-perm"
# foal run-script create-perm name="My second permission" codeName="my-second-perm"

# foal run-script create-group name="My group" codeName="my-group" permissions='[ "my-second-perm" ]'
# foal run-script create-group name="My group2" codeName="my-group2"

# foal run-script create-user userPermissions='[ "my-first-perm" ]' groups='[ "my-group" ]'
foal run-script create-user