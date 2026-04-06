/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as cheatsheet from "../cheatsheet.js";
import type * as content from "../content.js";
import type * as crons from "../crons.js";
import type * as exercises from "../exercises.js";
import type * as flashcards from "../flashcards.js";
import type * as http from "../http.js";
import type * as progress from "../progress.js";
import type * as quizzes from "../quizzes.js";
import type * as spacedRepetition from "../spacedRepetition.js";
import type * as streaks from "../streaks.js";
import type * as sync from "../sync.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  cheatsheet: typeof cheatsheet;
  content: typeof content;
  crons: typeof crons;
  exercises: typeof exercises;
  flashcards: typeof flashcards;
  http: typeof http;
  progress: typeof progress;
  quizzes: typeof quizzes;
  spacedRepetition: typeof spacedRepetition;
  streaks: typeof streaks;
  sync: typeof sync;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
