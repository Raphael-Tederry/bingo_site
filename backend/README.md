# Bingo Site - Backend

FastAPI backend for the Bingo Site application.

## Setup

### Automatic Setup (Recommended)

```bash
python setup.py
```

### Manual Setup

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Running the Server

### Development Mode (with auto-reload)

```bash
# Make sure virtual environment is activated
uvicorn main:app --reload
```

### Production Mode

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### GET /
Health check endpoint

### GET /profiles
Returns list of available bingo profiles with metadata

**Response:**
```json
[
  {
    "name": "office",
    "values_count": 25
  }
]
```

### POST /generate
Generate a new bingo board

**Request Body:**
```json
{
  "size": 5,
  "profile": "office",
  "custom_values": ["optional", "custom", "values"],
  "free_space": false
}
```

**Response:**
```json
{
  "size": 5,
  "cells": [["cell1", "cell2", ...], ...],
  "profile": "office",
  "free_space": false
}
```

### POST /generate-with-strategy?strategy=repeat
Generate bingo board with value handling strategy

**Query Parameters:**
- `strategy`: "repeat" or "blank"

Same request/response format as `/generate`

### GET /comments
Get all user comments

**Response:**
```json
[
  {
    "id": "1234567890.123_0",
    "username": "John Doe",
    "comment": "Great bingo site!",
    "timestamp": "2026-01-19T01:00:00.000000"
  }
]
```

### POST /comments
Submit a new comment

**Request Body:**
```json
{
  "username": "John Doe",
  "comment": "Great bingo site!"
}
```

**Response:**
```json
{
  "id": "1234567890.123_0",
  "username": "John Doe",
  "comment": "Great bingo site!",
  "timestamp": "2026-01-19T01:00:00.000000"
}
```

## Project Structure

```
backend/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
├── setup.py            # Setup script
└── README.md           # This file
```

## Dependencies

- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **python-multipart**: Form data support

## Code Documentation

All functions include comprehensive documentation with:
- **Reason**: Purpose of the function
- **Called by**: Where it's invoked
- **Input**: Parameters and types
- **Output**: Return values

## Adding Profiles

To add new bingo profiles:

1. Create a `.txt` file in the `../profiles/` directory
2. Add comma-separated values:
   ```
   Value 1, Value 2, Value 3, ...
   ```
3. Restart the server
4. Profile will be automatically available via API

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000` (Next.js default)

To add more origins, edit the CORS middleware in `main.py`.

## Environment Variables

Currently no environment variables are required. All configuration is done in code.

## Error Handling

The API includes comprehensive error handling:
- **400**: Bad request (invalid parameters)
- **404**: Profile not found
- **500**: Internal server error

Insufficient values return a special error format:
```json
{
  "detail": {
    "error": "insufficient_values",
    "message": "Need X values but only Y provided",
    "needed": X,
    "available": Y
  }
}
```
