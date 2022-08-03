#!/bin/sh

uri='http://localhost:4080/graphql'


# curl --request POST \
#   --header 'content-type: application/json' \
#   --url $uri \
#   --data '{"query":"query { __typename }"}' \
#   | json_pp

# got error response for the first request time 
# and the second time
# apollo-performance server is not configured correctry
# or i'm doing something wrong

# curl --get $uri \
#    -H 'Content-Type: application/json' \
#    -H 'Accept: application/json' \
#   --data-urlencode \
# 'extensions={"persistedQuery":{"version":1,"sha256Hash":"ecf4edb46db40b5132295c0291d62fb65d6759a9eedfa4d5d612dd5ec54a6b38"}}' \
# | json_pp

# apollo persists this query
# curl --get $uri \
#    -H 'Content-Type: application/json' \
#    -H 'Accept: application/json' \
#   --data-urlencode 'query={__typename}' \
#   --data-urlencode 'extensions={"persistedQuery":{"version":1,"sha256Hash":"ecf4edb46db40b5132295c0291d62fb65d6759a9eedfa4d5d612dd5ec54a6b38"}}' \
#   | json_pp



# json_with_query=$(cat << EOF
# {
#   "query" : "
#     query CachedBook {
#       cachedBook {
#         title
#         cachedTitle
#       }
#     }"
# }
# EOF
# )

# echo $json_with_query

# unable to use multiline json
# minify json here https://codebeautify.org/jsonminifier

curl --request POST \
  --header 'content-type: application/json' \
  --url $uri \
  --data ' { "query" : "query CachedBook { cachedBook { title cachedTitle } }" } ' \
  | json_pp
