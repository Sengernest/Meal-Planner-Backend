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
3. Pull PostgreSQL image and start a Postgres instance
```
docker pull postgres
docker run -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres  
```
4. Set environment variables e.g.
```
PORT=3000
DATABASE_URL=postgres://postgres:mypassword@localhost:5432/postgres
```

## Applying changes to database
Whenever a change is made to the schema, run the following command to update the actual database.
```
npx drizzle-kit push
```
