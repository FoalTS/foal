#!/usr/bin/env bash
set -e

rm -rf ./node_modules
npm install -g @foal/cli

rm -rf e2e-test-temp

mkdir e2e-test-temp
cd e2e-test-temp

# Test app creation
npx --yes @foal/cli createapp my-app
cd my-app

# Check some compilation errors
if grep -Rl "../../Users/loicp" .; then
    echo "Compilation error: \"../../Users/loicp\" has been found in one of the builds."
    exit 1
fi

# Test the generators
npx foal g entity flight
npx foal g hook foo-bar
npx foal g service foo
npx foal g controller bar --register
npx foal g rest-api product --register
npx foal g script bar-script

# Test linting
npm run lint

# Build and run the unit tests
npm run build:test
npm run start:test

# Make and run the migrations
npm run makemigrations
npm run migrations

# Build and run the e2e tests
npm run build:e2e
npm run start:e2e

# Build the app
npm run build

# Test the application when it is started
node build/index.js &
sleep 1
response=$(
    curl http://localhost:3001 \
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
        echo "SUCCESS: Got $STATUS as expected."
    else
        echo "ERROR: Got $STATUS! Expected $3..."
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

test_rest_api GET "http://localhost:3001/products" 200
test_rest_api GET "http://localhost:3001/products/20000" 404
test_rest_api GET "http://localhost:3001/products/ab" 400

test_rest_api_with_body POST "http://localhost:3001/products" 201 '{ "text": "value1" }'
test_rest_api_with_body POST "http://localhost:3001/products" 400 '{}'
test_rest_api_with_body POST "http://localhost:3001/products/1" 404

test_rest_api GET "http://localhost:3001/products/1" 200

test_rest_api_with_body PUT "http://localhost:3001/products" 404
test_rest_api_with_body PUT "http://localhost:3001/products/1" 200 '{ "text": "value2" }'
test_rest_api_with_body PUT "http://localhost:3001/products/1" 400 '{}'
test_rest_api_with_body PUT "http://localhost:3001/products/20000" 404 '{ "text": "value2" }'
test_rest_api_with_body PUT "http://localhost:3001/products/ab" 400 '{ "text": "value2" }'

test_rest_api_with_body PATCH "http://localhost:3001/products" 404
test_rest_api_with_body PATCH "http://localhost:3001/products/1" 200 '{ "text": "value2" }'
test_rest_api_with_body PATCH "http://localhost:3001/products/20000" 404 '{ "text": "value2" }'
test_rest_api_with_body PATCH "http://localhost:3001/products/ab" 400 '{ "text": "value2" }'

test_rest_api DELETE "http://localhost:3001/products" 404
test_rest_api DELETE "http://localhost:3001/products/1" 204
test_rest_api DELETE "http://localhost:3001/products/1" 404
test_rest_api DELETE "http://localhost:3001/products/ab" 400

kill -9 $(ps aux | grep '\snode\s')

# Test the default shell scripts to create users.
npx foal run create-user

#################################################################
# Repeat (almost) the same tests with a MongoDB and YAML project
#################################################################

cd ..

# Test app creation
npx @foal/cli createapp my-mongodb-app --mongodb --yaml
cd my-mongodb-app

# Check some compilation errors
if grep -Ril "../../Users/loicp" .; then
    echo "Compilation error: \"../../Users/loicp\" has been found in one of the builds."
    exit 1
fi

# Test linting
npm run lint

# Build and run the unit tests
npm run build:test
npm run start:test

# Build and run the e2e tests
npm run build:e2e
npm run start:e2e

# Build the app
npm run build

# Test the application when it is started
node build/index.js &
sleep 1
response=$(
    curl http://localhost:3001 \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" -ge 200 && test "$response" -le 299

kill -9 $(ps aux | grep '\snode\s')

# Test the default shell scripts to create users.
npx foal run create-user
