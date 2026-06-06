import express, { json, Request, Response } from "express";
import {
  handleCreateRecipe,
  handleDeleteRecipe,
  handleGetRecipe,
  handleGetRecipes,
  handleGetUserRecipes,
  handleUpdateRecipe,
} from "./handlers/recipes";
import {
  handleGetMeals,
  handleGetMeal,
  handleCreateMeal,
  handleUpdateMeal,
  handleDeleteMeal,
  handleGetUserMeals,
} from "./handlers/meals";
import { handleSignup, handleLogin, handleLogout } from "./handlers/auth";
import { handleCreateMacroGoals, handleGetMacroGoals } from "./handlers/macroGoals";
import { requireAuth } from "./middleware/auth";
import { bodyValidator, idValidator } from "./middleware/validation";
import { signupSchema, loginSchema } from "./dto/auth";
import { createRecipeSchema, updateRecipeSchema } from "./dto/recipes";
import { createMealSchema, updateMealSchema } from "./dto/meals";
import { calculateMacroGoalsSchema } from "./dto/macroGoals";


const app = express();
const cookieParser = require("cookie-parser");

app.use(json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.post('/signup', bodyValidator(signupSchema), handleSignup);
app.post('/login', bodyValidator(loginSchema), handleLogin);
app.post('/logout', handleLogout);

app.get("/recipes", handleGetRecipes);
app.get("/users/:id/recipes", idValidator(), handleGetUserRecipes);
app.get("/recipes/:id", idValidator(), handleGetRecipe);
app.post("/recipes", bodyValidator(createRecipeSchema), handleCreateRecipe);
app.put(
  "/recipes/:id",
  idValidator(),
  bodyValidator(updateRecipeSchema),
  handleUpdateRecipe,
);
app.delete("/recipes/:id", idValidator(), handleDeleteRecipe);

app.get("/meals", handleGetMeals);
app.get("/users/:id/meals", idValidator(), handleGetUserMeals);
app.get("/meals/:id", idValidator(), handleGetMeal);
app.post("/meals", bodyValidator(createMealSchema), handleCreateMeal);
app.put(
  "/meals/:id",
  idValidator(),
  bodyValidator(updateMealSchema),
  handleUpdateMeal,
);
app.delete("/meals/:id", idValidator(), handleDeleteMeal);

app.post("/macro-goals", requireAuth, bodyValidator(calculateMacroGoalsSchema), handleCreateMacroGoals);
app.get("/macro-goals", requireAuth, handleGetMacroGoals);

export default app;
