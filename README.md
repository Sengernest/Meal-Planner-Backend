# Meal Planner Backend

## Local Setup
1. Install dependencies
```
npm install
```
2. Run the dev server
```
npm run dev
```
3. Start a Postgres instance using docker compose
```
docker compose up -d
```
** NOTE:  Ensure you do not already have a local Postgres instance running on port 5432 **  
4. Set environment variables e.g.
```
PORT=3000
DATABASE_URL=postgres://postgres:mypassword@localhost:5432/postgres
```

## Database
### Applying changes to database
Whenever a change is made to the schema, run the following command to update the actual database.
```
npx drizzle-kit push
```

### Accessing database with psql
```
docker exec -it <container_name> psql -U postgres
```
