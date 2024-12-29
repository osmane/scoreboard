## Feature: Implement New Server State Context

**Goal:** Introduce a well-engineered React Context to manage server state (Nchan users, server tables). This context will handle initial data fetching and real-time updates via websocket.

**Requirements:**

*   **Create a new Context:**  Name: `StateContext` (or discuss alternative if needed).
*   **Context Provider:**  Should manage the server state.
*   **Initial Data Fetching:** Implement logic to fetch initial Nchan user and server table data.
*   **Nchan Integration:**
    *   Use `NchanSub` class for real-time updates subscription
    *   Use `NchanPub` class to get activeUsers
*   **State Structure:** Define a clear structure for the state held within the Context.
*   **State Structure:** 
    ```typescript
    interface LobbyState {
      activeUsers: number;
      tables: Table[];
      lastUpdated: number;
      userId: string;
      userName: string;
    }
    ```

**Important Considerations:**

*   **Focus on New Context:**  Prioritize building the new `StateContext`. Existing (poorly engineered) context integration/migration is a separate, later phase.
*   **Isolated Implementation:** The new `StateContext` should function independently initially.
*   **Clear Separation:** Ensure the context is responsible for data fetching and real-time updates, not the consuming components.

**Output:**

*   `StateContext.tsx` (or similar naming) file containing the Context definition and Provider implementation.
*   Potentially related files for API calls or websocket logic if needed (e.g., in a `lib/` folder).