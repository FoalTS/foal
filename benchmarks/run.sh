#!/usr/bin/env sh
set -e

# Empty benchmark.txt if it exists.
:> benchmark.txt

echo '========================================================================' >> benchmark.txt
echo 'Framework: ExpressJS' >> benchmark.txt
echo '========================================================================' >> benchmark.txt
SETTINGS_JWT_SECRET=secret node express.js &
pid=$!

sleep 3

ab -n 100 -c 10 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o" \
  http://localhost:3000/api/users >> benchmark.txt

kill $pid

echo '========================================================================' >> benchmark.txt
echo 'Framework: FoalTS' >> benchmark.txt
echo '========================================================================' >> benchmark.txt
SETTINGS_JWT_SECRET=secret node foal.js &
pid=$!

sleep 3

ab -n 100 -c 10 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o" \
  http://localhost:3000/api/users >> benchmark.txt

kill $pid