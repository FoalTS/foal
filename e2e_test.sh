mkdir e2e-test-temp
cd e2e-test-temp

# Test app creation
foal createapp my-app || exit 1
cd my-app

# Check some compilation errors
if grep -Ril "../../Users/loicp" .; then
    echo "Compilation error: \"../../Users/loicp\" has been found in one of the builds."
    exit 1
fi

# Test the generators
foal g entity flight || exit 1
foal g hook foo-bar || exit 1
foal g service foo || exit 1
foal g controller bar --register || exit 1
foal g rest-api product --register || exit 1
foal g sub-app bar-foo || exit 1
foal g script bar-script || exit 1

# Test linting
npm run lint || exit 1

# Build and run the unit tests
npm run build:test || exit 1
npm run start:test || exit 1

# Make and run the migrations
npm run makemigrations --name=my-migration || exit 1
npm run migrations || exit 1

# Build and run the e2e tests
npm run build:e2e || exit 1
npm run start:e2e || exit 1

# Build the app
npm run build || exit 1

# Test the application when it is started
pm2 start build/index.js || exit 1
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

pm2 delete index || exit 1

# Test the default shell scripts to create users.
foal run create-user || exit 1

#################################################################
# Repeat (almost) the same tests with a Mongoose and YAML project
#################################################################

cd ..

# Test app creation
foal createapp my-mongodb-app --mongodb --yaml || exit 1
cd my-mongodb-app

# Check some compilation errors
if grep -Ril "../../Users/loicp" .; then
    echo "Compilation error: \"../../Users/loicp\" has been found in one of the builds."
    exit 1
fi

# Test the generators
foal g model flight || exit 1

# Test linting
npm run lint || exit 1

# Build and run the unit tests
npm run build:test || exit 1
npm run start:test || exit 1

# Build and run the e2e tests
npm run build:e2e || exit 1
npm run start:e2e || exit 1

# Build the app
npm run build || exit 1

# Test the application when it is started
PORT=3001 pm2 start build/index.js || exit 1
sleep 1
response=$(
    curl http://localhost:3001 \
        --write-out %{http_code} \
        --silent \
        --output /dev/null \
)
test "$response" -ge 200 && test "$response" -le 299

pm2 delete index || exit 1

# Test the default shell scripts to create users.
foal run create-user || exit 1
