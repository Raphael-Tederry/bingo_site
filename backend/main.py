"""
Bingo Website - FastAPI Backend
Main application entry point

This module serves as the core FastAPI application for the bingo website.
It handles bingo game generation, profile management, and game state operations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import os
import json
from datetime import datetime

app = FastAPI(title="Bingo API", version="1.0.0")

# Get allowed origins from environment or use localhost as default
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Profiles directory path
PROFILES_DIR = os.path.join(os.path.dirname(__file__), "profiles")

# Comments file path
COMMENTS_FILE = os.path.join(os.path.dirname(__file__), "data", "comments.json")


# ==================== MODELS ====================

class BingoGenerateRequest(BaseModel):
    """
    Request model for generating a new bingo board
    
    Attributes:
        size: Grid size (2-10)
        profile: Profile name or 'custom'
        custom_values: List of custom values (required if profile is 'custom')
        free_space: Whether to enable center free space
    """
    size: int
    profile: str
    custom_values: Optional[List[str]] = None
    free_space: bool = False


class BingoBoard(BaseModel):
    """
    Response model for a bingo board
    
    Attributes:
        size: Grid size
        cells: 2D array of cell values
        profile: Profile name used
        free_space: Whether free space is enabled
    """
    size: int
    cells: List[List[str]]
    profile: str
    free_space: bool


class ProfileInfo(BaseModel):
    """
    Model for profile information
    
    Attributes:
        name: Profile name
        values_count: Number of values available in profile
    """
    name: str
    values_count: int


class Comment(BaseModel):
    """
    Model for a user comment
    
    Attributes:
        username: User's chosen name
        comment: The comment text
        timestamp: When the comment was created (optional, auto-generated)
        id: Unique comment identifier (optional, auto-generated)
    """
    username: str
    comment: str
    timestamp: Optional[str] = None
    id: Optional[str] = None


class CommentCreate(BaseModel):
    """
    Model for creating a new comment
    
    Attributes:
        username: User's chosen name
        comment: The comment text
    """
    username: str
    comment: str


# ==================== HELPER FUNCTIONS ====================

def load_profile_values(profile_name: str) -> List[str]:
    """
    Load values from a profile file
    
    Reason: Retrieve comma-separated values from profile files
    Called by: generate_bingo
    Input: profile_name (str) - Name of the profile file
    Output: List[str] - List of values from the profile
    """
    profile_path = os.path.join(PROFILES_DIR, f"{profile_name}.txt")
    
    if not os.path.exists(profile_path):
        raise HTTPException(status_code=404, detail=f"Profile '{profile_name}' not found")
    
    with open(profile_path, 'r', encoding='utf-8') as f:
        content = f.read().strip()
    
    # Split by comma and clean whitespace
    values = [v.strip() for v in content.split(',') if v.strip()]
    
    return values


def get_available_profiles() -> List[ProfileInfo]:
    """
    Get list of all available profiles
    
    Reason: Provide frontend with available profile options
    Called by: list_profiles endpoint
    Input: None
    Output: List[ProfileInfo] - List of available profiles with metadata
    """
    if not os.path.exists(PROFILES_DIR):
        return []
    
    profiles = []
    for filename in os.listdir(PROFILES_DIR):
        if filename.endswith('.txt'):
            profile_name = filename[:-4]  # Remove .txt extension
            try:
                values = load_profile_values(profile_name)
                profiles.append(ProfileInfo(name=profile_name, values_count=len(values)))
            except Exception:
                continue
    
    return profiles


def ensure_comments_file():
    """
    Ensure comments file and directory exist
    
    Reason: Create data directory and comments file if they don't exist
    Called by: Comment endpoints
    Input: None
    Output: None
    """
    data_dir = os.path.dirname(COMMENTS_FILE)
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    # Only create file if it truly doesn't exist
    # If it exists (even if empty), leave it alone to preserve git content
    if not os.path.exists(COMMENTS_FILE):
        with open(COMMENTS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)


def load_comments() -> List[Comment]:
    """
    Load all comments from the JSON file
    
    Reason: Retrieve stored comments for display
    Called by: get_comments endpoint
    Input: None
    Output: List[Comment] - All stored comments
    """
    ensure_comments_file()
    
    try:
        with open(COMMENTS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return [Comment(**item) for item in data]
    except Exception as e:
        print(f"Error loading comments: {e}")
        return []


def save_comments(comments: List[Comment]):
    """
    Save comments to the JSON file
    
    Reason: Persist comments to storage
    Called by: add_comment endpoint
    Input: comments (List[Comment]) - Comments to save
    Output: None
    """
    ensure_comments_file()
    
    try:
        data = [comment.model_dump() for comment in comments]
        with open(COMMENTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving comments: {e}")
        raise HTTPException(status_code=500, detail="Failed to save comment")


def generate_board_cells(values: List[str], size: int, free_space: bool, strategy: str = "repeat") -> List[List[str]]:
    """
    Generate bingo board cells from available values
    
    Reason: Create randomized bingo board with proper value handling
    Called by: generate_bingo
    Input: 
        values (List[str]) - Available values to use
        size (int) - Board dimensions
        free_space (bool) - Whether to use center free space
        strategy (str) - How to handle insufficient values: 'repeat', 'blank'
    Output: List[List[str]] - 2D array of board cells
    """
    total_cells = size * size
    needed_cells = total_cells - 1 if free_space else total_cells
    
    # Handle insufficient values
    if len(values) < needed_cells:
        if strategy == "blank":
            # Add blank cells
            values = values + [""] * (needed_cells - len(values))
        else:  # repeat
            # Repeat values as needed
            repetitions = (needed_cells // len(values)) + 1
            values = values * repetitions
    
    # Shuffle and select needed values
    shuffled = random.sample(values, min(len(values), needed_cells))
    
    # Create board
    board = []
    cell_index = 0
    center = size // 2
    
    for row in range(size):
        board_row = []
        for col in range(size):
            # Check if this is the center cell and free space is enabled
            if free_space and row == center and col == center:
                board_row.append("★ FREE ★")
            else:
                board_row.append(shuffled[cell_index])
                cell_index += 1
        board.append(board_row)
    
    return board


# ==================== API ENDPOINTS ====================

@app.get("/")
def read_root():
    """
    Root endpoint
    
    Reason: Provide API health check and basic info
    Called by: Health monitoring, initial API discovery
    Input: None
    Output: dict - API information
    """
    return {
        "message": "Bingo API is running",
        "version": "1.0.0",
        "endpoints": ["/profiles", "/generate", "/debug"]
    }


@app.get("/debug")
def debug_info():
    """
    Debug endpoint to check file system state
    
    Reason: Help diagnose deployment issues
    Called by: Debugging
    Input: None
    Output: dict - Debug information
    """
    import os
    
    debug_data = {
        "working_directory": os.getcwd(),
        "main_file_location": __file__,
        "comments_file_path": COMMENTS_FILE,
        "comments_file_exists": os.path.exists(COMMENTS_FILE),
        "data_dir_exists": os.path.exists(os.path.dirname(COMMENTS_FILE)),
    }
    
    # Try to read the file if it exists
    if os.path.exists(COMMENTS_FILE):
        try:
            with open(COMMENTS_FILE, 'r', encoding='utf-8') as f:
                content = json.load(f)
                debug_data["comments_file_content"] = content
                debug_data["comments_count"] = len(content)
        except Exception as e:
            debug_data["comments_file_error"] = str(e)
    
    # List files in data directory
    data_dir = os.path.dirname(COMMENTS_FILE)
    if os.path.exists(data_dir):
        try:
            debug_data["data_dir_contents"] = os.listdir(data_dir)
        except Exception as e:
            debug_data["data_dir_list_error"] = str(e)
    
    return debug_data


@app.get("/profiles", response_model=List[ProfileInfo])
def list_profiles():
    """
    Get all available profiles
    
    Reason: Allow frontend to display profile selection options
    Called by: Frontend profile selector
    Input: None
    Output: List[ProfileInfo] - Available profiles with metadata
    """
    return get_available_profiles()


@app.post("/generate", response_model=BingoBoard)
def generate_bingo(request: BingoGenerateRequest):
    """
    Generate a new bingo board
    
    Reason: Create randomized bingo board based on user selections
    Called by: Frontend bingo generation requests
    Input: BingoGenerateRequest - Board configuration
    Output: BingoBoard - Generated bingo board
    """
    # Validate size
    if request.size < 2 or request.size > 10:
        raise HTTPException(status_code=400, detail="Size must be between 2 and 10")
    
    # Get values based on profile
    if request.profile == "custom":
        if not request.custom_values:
            raise HTTPException(status_code=400, detail="Custom values required for custom profile")
        values = request.custom_values
    else:
        values = load_profile_values(request.profile)
    
    # Calculate required cells
    total_cells = request.size * request.size
    needed_cells = total_cells - 1 if request.free_space else total_cells
    
    # Check if we have enough values
    if len(values) < needed_cells:
        # Return error with insufficient values info
        raise HTTPException(
            status_code=400,
            detail={
                "error": "insufficient_values",
                "message": f"Need {needed_cells} values but only {len(values)} provided",
                "needed": needed_cells,
                "available": len(values)
            }
        )
    
    # Generate board
    cells = generate_board_cells(values, request.size, request.free_space)
    
    return BingoBoard(
        size=request.size,
        cells=cells,
        profile=request.profile,
        free_space=request.free_space
    )


@app.post("/generate-with-strategy", response_model=BingoBoard)
def generate_bingo_with_strategy(request: BingoGenerateRequest, strategy: str = "repeat"):
    """
    Generate bingo board with value handling strategy
    
    Reason: Allow generation even with insufficient values using specified strategy
    Called by: Frontend after user selects handling strategy
    Input: 
        request (BingoGenerateRequest) - Board configuration
        strategy (str) - How to handle insufficient values: 'repeat' or 'blank'
    Output: BingoBoard - Generated bingo board
    """
    # Validate size
    if request.size < 2 or request.size > 10:
        raise HTTPException(status_code=400, detail="Size must be between 2 and 10")
    
    # Get values
    if request.profile == "custom":
        if not request.custom_values:
            raise HTTPException(status_code=400, detail="Custom values required for custom profile")
        values = request.custom_values
    else:
        values = load_profile_values(request.profile)
    
    # Generate board with strategy
    cells = generate_board_cells(values, request.size, request.free_space, strategy)
    
    return BingoBoard(
        size=request.size,
        cells=cells,
        profile=request.profile,
        free_space=request.free_space
    )


@app.get("/comments", response_model=List[Comment])
def get_comments():
    """
    Get all comments
    
    Reason: Provide list of all user comments for display
    Called by: Frontend comments page
    Input: None
    Output: List[Comment] - All comments sorted by newest first
    """
    comments = load_comments()
    # Sort by timestamp, newest first
    comments.sort(key=lambda x: x.timestamp or "", reverse=True)
    return comments


@app.post("/comments", response_model=Comment)
def add_comment(comment_data: CommentCreate):
    """
    Add a new comment
    
    Reason: Allow users to submit suggestions and comments
    Called by: Frontend comments form
    Input: comment_data (CommentCreate) - Username and comment text
    Output: Comment - The created comment with timestamp and id
    """
    # Validate input
    if not comment_data.username or not comment_data.username.strip():
        raise HTTPException(status_code=400, detail="Username is required")
    
    if not comment_data.comment or not comment_data.comment.strip():
        raise HTTPException(status_code=400, detail="Comment is required")
    
    # Load existing comments
    comments = load_comments()
    
    # Create new comment with timestamp and id
    new_comment = Comment(
        username=comment_data.username.strip(),
        comment=comment_data.comment.strip(),
        timestamp=datetime.utcnow().isoformat(),
        id=f"{datetime.utcnow().timestamp()}_{len(comments)}"
    )
    
    # Add to list and save
    comments.append(new_comment)
    save_comments(comments)
    
    return new_comment


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
