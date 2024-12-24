```markdown
# Billiards Game Messaging Specification

This document outlines the messaging specification for a billiards game application utilizing nchan server-sent events. The core game logic resides on the clients. Game recording for resumption and replay is a key feature.

## Nchan Integration

Each game instance will have a dedicated channel based on its unique ID.

* **Publish Channel:** `/publish/table{id}` - Clients publish messages related to the game on this channel.
* **Subscribe Channel:** `/subscribe/table{id}` - Clients subscribe to this channel to receive messages for a specific game.

**Message Format:** All messages will be JSON objects.

```json
{
  "type": "message_type",
  "timestamp": "ISO 8601 timestamp",
  "payload": {
    // Message-specific data
  }
}
```

## Message Types

### Game Management

* **`game_start`**: Sent when a new game starts.
    ```json
    {
      "type": "game_start",
      "timestamp": "2023-10-27T10:00:00Z",
      "payload": {
        "player1_id": "user_id_1",
        "player2_id": "user_id_2",
        "starting_player": "user_id_1", // ID of the player who breaks
        "game_rules": {
          "type": "8-ball"
          // Other rule-specific settings if needed
        },
        "initial_table_state": {
          // Representation of the initial ball positions
          // Example: {"cue_ball": [x, y], "ball_1": [x, y], ...}
        }
      }
    }
    ```

* **`game_end`**: Sent when the game concludes.
    ```json
    {
      "type": "game_end",
      "timestamp": "2023-10-27T10:30:00Z",
      "payload": {
        "winner": "user_id_1",
        "scores": {
          "user_id_1": 8,
          "user_id_2": 3
        }
      }
    }
    ```

### Player Actions

* **`aim`**: Sent by the current player to indicate their aiming intention. This is for real-time feedback to opponents and spectators and is **not recorded**.
    ```json
    {
      "type": "aim",
      "timestamp": "2023-10-27T10:10:00Z",
      "payload": {
        "player_id": "user_id_1",
        "cue_position": [x, y],
        "cue_direction": [dx, dy]
      }
    }
    ```

* **`shot`**: Sent by the current player when they execute a shot. Defines the initial parameters of the cue ball.
    ```json
    {
      "type": "shot",
      "timestamp": "2023-10-27T10:10:02Z",
      "payload": {
        "player_id": "user_id_1",
        "cue_ball_position": [x, y],
        "cue_ball_velocity": [vx, vy],
        "cue_ball_spin": { "x": 0.1, "y": -0.2, "z": 0 } // Optional spin
      }
    }
    ```

* **`outcome`**: Sent by the player *after* the shot is complete and the balls have settled. This message is crucial for game recording and state synchronization.
    ```json
    {
      "type": "outcome",
      "timestamp": "2023-10-27T10:10:05Z",
      "payload": {
        "player_id": "user_id_1",
        "is_break": true,
        "score": {
          "user_id_1": 1,
          "user_id_2": 0
        },
        "table_state": {
          "cue_ball": [x, y],
          "ball_1": [x, y],
          "ball_2": "pocket_3", // or [x, y] if on the table
          // ... all ball positions and states
        },
        "foul": false, // Or detail the foul type if applicable
        "next_player": "user_id_1" // Who plays next
      }
    }
    ```

### Spectator Management

* **`spectator_join`**: Sent when a spectator joins the game.
    ```json
    {
      "type": "spectator_join",
      "timestamp": "2023-10-27T10:20:00Z",
      "payload": {
        "spectator_id": "spectator_id_1"
      }
    }
    ```

* **`spectator_leave`**: Sent when a spectator leaves the game.
    ```json
    {
      "type": "spectator_leave",
      "timestamp": "2023-10-27T10:25:00Z",
      "payload": {
        "spectator_id": "spectator_id_1"
      }
    }
    ```

## Game Recording and Resumption

A separate recording server will be responsible for persisting the game state.

**Recording Process:**

1. **`outcome` messages are sent to the recording server.** Each `outcome` message represents a definitive game state.
2. **The recording server stores these `outcome` messages in order**, associated with the `table{id}`.

**Resumption Process:**

1. **Initial Connection:** When a player navigates to `/game/table{id}`, the client first needs to retrieve the game state.
2. **Requesting Game History:** The client makes a request to the recording server for all recorded `outcome` messages associated with the `table{id}`.
3. **State Reconstruction:** The client replays the received `outcome` messages in chronological order. Each `outcome` message overwrites the previous game state, effectively reconstructing the game to its current point.
4. **Current State:** The last `outcome` message in the sequence represents the current, up-to-date game state. The client initializes its game view based on this state.
5. **Subscribing to Nchan:** After reconstructing the state, the client subscribes to the `/subscribe/table{id}` channel to receive real-time updates.

**Replay Feature:**

* Clients can request the recorded `outcome` messages for a completed game.
* Clients can then iterate through these messages to visually replay the game, updating the game table state after each `outcome`.

## Spectator Behavior

* Spectators subscribe to the same `/subscribe/table{id}` channel as the players.
* They receive all game messages, allowing them to observe the real-time progression.
* Upon joining, a spectator client should ideally perform the same state reconstruction process as a resuming player by requesting and replaying the `outcome` history. This ensures they see the current game state.

## Client Responsibilities

* **Game Logic:** Clients are responsible for interpreting messages and updating the game state accordingly. This includes predicting ball movements based on `shot` messages (acting as a "slave" and following the `outcome`), handling scoring, and detecting game-ending conditions.
* **Message Publishing:** Clients publish messages to the appropriate `/publish/table{id}` channel.
* **State Management:** Clients maintain the current game state.
* **Recording Integration:** Clients are responsible for sending `outcome` messages to the separate recording server.
* **Resumption:** Clients implement the logic for requesting and replaying recorded `outcome` messages upon navigating to `/game/table{id}`.
* **Animation and Prediction:** Opponent and spectator clients will attempt to animate the shot based on the `shot` message but will ultimately rely on the `outcome` for the definitive state.

## Considerations

* **Table State Representation:** The `table_state` within the `outcome` message must be comprehensive enough to fully represent the positions and states of all balls.
* **Idempotency:** The state reconstruction process should be idempotent. Replaying the same sequence of `outcome` messages should always result in the same game state.
* **Error Handling:** Clients should handle network issues and invalid messages.
* **Recording Server API:**  The recording server will need an API endpoint to:
    * Receive and store `outcome` messages.
    * Retrieve all `outcome` messages for a given `table{id}`.
* **Initial Game State for New Players:** When a new player joins a game in progress (perhaps replacing a disconnected player), the same resumption mechanism should be used to bring them up to speed.

This specification provides a concise framework for the billiards game messaging system, focusing on the core mechanics and the crucial game recording and resumption features.
```