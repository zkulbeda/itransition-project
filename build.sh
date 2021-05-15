#ts-node sync_database.ts
tsc --project tsconfig.json
cd "./frontend/main" || exit;
yarn next build
