# Feature Implementation Plan: Tetris Game

## 📋 Todo Checklist
- [x] Create a new Git branch ✅ Implemented
- [x] Create the folder structure for the game ✅ Implemented
- [x] Create the `index.html` file ✅ Implemented
- [x] Create the `style.css` file ✅ Implemented
- [x] Create the `script.js` file ✅ Implemented
- [x] Create the `server.py` file ✅ Implemented
- [x] Final Review and Testing ✅ Implemented

## 🔍 Analysis & Investigation

### Codebase Structure
The current codebase is a collection of games. Each game has its own folder. I will create a new folder called `tetris` for the new game.

### Current Architecture
The current architecture is to have a separate folder for each game. Each game is a simple web-based game with HTML, CSS, and JavaScript. A Python web server is used to serve the game.

### Dependencies & Integration Points
The game will use DaisyUI and TailwindCSS for the UI. These will be included via CDN.

### Considerations & Challenges
The main challenge will be to implement the Tetris game logic in JavaScript.

## 📝 Implementation Plan

### Prerequisites
- Python 3 should be installed.

### Step-by-Step Implementation
1. **Create a new Git branch**: 
   - Branch name: `26-01-22-issue-1`.
   - **Implementation Notes**: Created branch `26-01-22-issue-1`.
   - **Status**: ✅ Completed

2. **Switch to the new branch**:
   - `git checkout -b 26-01-22-issue-1`
   - **Implementation Notes**: Switched to branch `26-01-22-issue-1`. Committed initial setup files for the new branch.
   - **Status**: ✅ Completed

3. **Create the folder structure for the game**:
   - Create a new folder named `tetris` in the root of the repository.
   - **Implementation Notes**: Created `tetris` folder. Encountered an issue with `git add` not tracking empty folder, so created `temp.txt` inside, committed, then removed `temp.txt` and committed its removal.
   - **Status**: ✅ Completed

4. **Create the `index.html` file**:
   - Files to modify: `tetris/index.html`
   - Changes needed: Create a new HTML file with the basic structure for the game. Include the DaisyUI and TailwindCSS CDNs. The game will have a canvas for the game board, a scoreboard, and buttons for START, STOP, PAUSE/RESUME, and DIFFICULTY.
   - **Implementation Notes**: Created `tetris/index.html` with the specified content.
   - **Status**: ✅ Completed

5. **Create the `style.css` file**:
   - Files to modify: `tetris/style.css`
   - Changes needed: Create a new CSS file to style the game.
   - **Implementation Notes**: Created `tetris/style.css` with basic styling.
   - **Status**: ✅ Completed

6. **Create the `script.js` file**:
   - Files to modify: `tetris/script.js`
   - Changes needed: Create a new JavaScript file to implement the Tetris game logic. This will include the game board, the tetrominoes, the game loop, and the controls.
   - **Implementation Notes**: Created `tetris/script.js` with the core Tetris game logic.
   - **Status**: ✅ Completed

7. **Create the `server.py` file**:
   - Files to modify: `tetris/server.py`
   - Changes needed: Create a new Python file to serve the game. The server will run on port 8080.
   - **Implementation Notes**: Created `tetris/server.py` to serve the game on port 8080.
   - **Status**: ✅ Completed

- **Final Step**: Create a `stats.json` file in the `/plans` directory with the filename `tetris-game.md-stats.json`.

### Testing Strategy
- The game will be tested manually by playing it in the browser.

### Web Server Verification (for web-based tasks)
1.  **Run the server in the background**:
    - Command: `python tetris/server.py & echo $! > server_pid.txt` (This will store the PID in a file for later use)
    - Ensure the command runs the server in the background.
2.  **Verify server response with curl**:
    - Command: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080`
    - Expected output: `200`
    - Implement a retry mechanism with a timeout if the initial check fails.
3.  **Troubleshoot if not 200**:
    - If the `curl` command does not return `200`, analyze server logs (if available) for errors.
    - Provide steps to diagnose common issues (e.g., port conflicts, missing dependencies, incorrect configuration).
    - Repeat verification after troubleshooting.
4.  **Keep Server Running for User Instructions**:
    - The server will be left running.
    - The Process ID (PID) of the running server will be stored in `server_pid.txt`.
    - Wait for the user to give further instructions. Do not kill the server until explicitly told to do so.

## 🎯 Success Criteria
- A working Tetris game that can be played in the browser.
- The game has a working scoreboard, START, STOP, PAUSE/RESUME, and DIFFICULTY buttons.
- The game is served by a Python web server on port 8080.
