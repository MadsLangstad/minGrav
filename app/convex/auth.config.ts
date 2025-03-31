import { v } from "convex/values";
import { defineAuth } from "convex/server";

export default defineAuth({
  providers: [
    {
      domain: "https://clerk.mingrav.com",
      applicationID: "convex",
    },
  ],
});
