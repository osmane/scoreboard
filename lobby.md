I need a Next.js (Typescript) implementation for a lobby system with the following requirements:

**Core Functionality:**

*   **Table Management:** Users can create, join, spectate, and (if they are the creator) delete "tables". Each table represents a game instance.
*   **User Management:**
    *   Users are assigned a unique, persistent, and randomly generated ID upon arrival at the site (client-side).
    *   This ID is used to identify the user throughout their session.
*   **Table State:**
    *   A table can hold a maximum of two players.
    *   After two players have joined, only spectating is permitted for new users.
    *   The table creator is the only user who can delete a table.
*   **Data Persistence:** Active table information (including the creator, list of players, and the table's current status) must be stored in a persistent Redis key-value store using `@vercel/kv`.

**Backend (API):**

*   Implement API routes under `/api/tables` for the following actions:
    *   **`POST /api/tables`**: Create a new table.  Expects a user ID and returns the newly created table's ID.
    *   **`GET /api/tables`**: Fetch all active tables with their details.
    *   **`GET /api/tables/[tableId]`**: Fetch a specific table by its ID.
    *   **`PUT /api/tables/[tableId]/join`**: Allows a user to join a table.  Expects the user ID. Handle logic for table capacity and return the updated table status
    *   **`PUT /api/tables/[tableId]/spectate`**: Allows a user to spectate a table.  Expects the user ID.
    *   **`DELETE /api/tables/[tableId]`**: Allows the creator of the table to delete it. Expects user ID for authentication.
*   These API endpoints should handle the logic for manipulating the Redis store.

**Implementation Details:**

*   **Technologies:** Next.js (Typescript), Redis (via `@vercel/kv`).

**Assumptions:**

*   You have access to `kv` from "@vercel/kv" and it's correctly configured.

**Desired Output:**

*  I am looking for the backend logic in the `/pages/api/tables` folder.
*  Please suggest any data structure or common functions I should implement.
*  Aim for minimal well structured maintainable code without too many comments.
*  A table that has not been used for 1 minute should be closed and not be visible to users in the lobby
*  The table object in kv will have the users who have joined and creation and last used timestamp

**Important:** This is a starting point. Feel free to make sensible design decisions and suggestions. Prioritize clarity and maintainability in your code.

**Data Structure:**

```typescript
export interface Player {
  id: string;
  name: string;
}

export interface Table {
  id: string;
  players: Player[];
  createdAt: number;
  lastUsedAt: number;
  isActive: boolean;
}
```