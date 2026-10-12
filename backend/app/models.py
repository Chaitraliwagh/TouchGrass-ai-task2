"""Pydantic models: what the frontend sends and what it gets back."""
from typing import Literal, Optional
from pydantic import BaseModel, Field


class ActivityRequest(BaseModel):
    time: Literal["15 minutes", "30 minutes", "1 hour", "2 hours", "Half day"]
    difficulty: Literal["Easy", "Moderate", "Challenging"]
    company: Literal["Alone", "With Friends", "With Family", "With Partner"]
    mood: Literal["Relaxing", "Adventurous", "Social", "Active", "Creative", "Curious"]
    interest: Literal["Nature", "Walking", "Photography", "Fitness", "Observation", "Exploring", "Games"]
    environment: Optional[str] = Field(default="", max_length=80)


class ActivityPlan(BaseModel):
    activity_name: str
    description: str = ""
    duration: str
    difficulty: str
    company: str = ""
    why: str = ""
    what_to_carry: list[str] = []
    steps: list[str]
    offline_challenge: str
    screen_off_goal: str
    safety: str
