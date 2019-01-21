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
SETTINGS_CSRF=false pm2 start build/index.js
sleep 1
response=$(
    curl http://localhost:3000 \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" -ge 200 && test "$response" -le 299

# Test the REST API

function test_rest_api () {
    echo "Requesting $1 $2"
    STATUS=$(
        curl "$2" \
            -X $1 \
            --write-out %{http_code} \
            --silent \
            --output /dev/null \
    )
    if [ $STATUS -eq $3 ]; then
        echo "SUCCESS: Got $STATUS! Expected $3."
    else
        echo "ERROR: Got $STATUS. Expected $3..."
        exit 1
    fi
}

function test_rest_api_with_body () {
    echo "Requesting $1 $2"
    STATUS=$(
        curl "$2" \
            -X $1 \
            -d "$4" \
            -H "Content-Type: application/json"  \
            --write-out %{http_code} \
            --silent \
            --output /dev/null \
    )
    if [ $STATUS -eq $3 ]; then
        echo "SUCCESS: Got $STATUS! Expected $3."
    else
        echo "ERROR: Got $STATUS. Expected $3..."
        exit 1
    fi
}

test_rest_api GET "http://localhost:3000/products" 200
test_rest_api GET "http://localhost:3000/products/20000" 404

test_rest_api_with_body POST "http://localhost:3000/products" 201 '{ "text": "value1" }'
test_rest_api_with_body POST "http://localhost:3000/products" 400 '{}'
test_rest_api_with_body POST "http://localhost:3000/products/1" 405

test_rest_api GET "http://localhost:3000/products/1" 200

test_rest_api_with_body PUT "http://localhost:3000/products" 405
test_rest_api_with_body PUT "http://localhost:3000/products/1" 200 '{ "text": "value2" }'
test_rest_api_with_body PUT "http://localhost:3000/products/1" 400 '{}'
test_rest_api_with_body PUT "http://localhost:3000/products/20000" 404 '{ "text": "value2" }'

test_rest_api_with_body PATCH "http://localhost:3000/products" 405
test_rest_api_with_body PATCH "http://localhost:3000/products/1" 200 '{ "text": "value2" }'
test_rest_api_with_body PATCH "http://localhost:3000/products/20000" 404 '{ "text": "value2" }'

test_rest_api DELETE "http://localhost:3000/products" 405
test_rest_api DELETE "http://localhost:3000/products/1" 204
test_rest_api DELETE "http://localhost:3000/products/1" 404

pm2 delete index

# Test the default shell scripts to create permissions, groups and users.
npm run build:scripts

# foal run-script create-perm name="My first permission" codeName="my-first-perm"
# foal run-script create-perm name="My second permission" codeName="my-second-perm"

# foal run-script create-group name="My group" codeName="my-group" permissions='[ "my-second-perm" ]'
# foal run-script create-group name="My group2" codeName="my-group2"

# foal run-script create-user userPermissions='[ "my-first-perm" ]' groups='[ "my-group" ]'
foal run create-user