/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_createGrave from "../functions/createGrave.js";
import type * as functions_createRequest from "../functions/createRequest.js";
import type * as functions_createUserIfNotExists from "../functions/createUserIfNotExists.js";
import type * as functions_listOpenRequests from "../functions/listOpenRequests.js";
import type * as functions_messages from "../functions/messages.js";
import type * as functions_utils from "../functions/utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/createGrave": typeof functions_createGrave;
  "functions/createRequest": typeof functions_createRequest;
  "functions/createUserIfNotExists": typeof functions_createUserIfNotExists;
  "functions/listOpenRequests": typeof functions_listOpenRequests;
  "functions/messages": typeof functions_messages;
  "functions/utils": typeof functions_utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
