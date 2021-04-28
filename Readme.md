for http request validators
typescript-json-schema "src/requests/onMessageRequest.ts" OnMessageRequest --out models/on-message-request.json --required

for websockets runtime validators
ts-interface-builder src/requests/*.ts -o src/requests/generated