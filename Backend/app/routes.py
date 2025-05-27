from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr
from prisma.models import Slot, Booking
from typing import List
from datetime import datetime, date
from app.db import db



router = APIRouter()


# Models for request/response
class SlotCreate(BaseModel):
    date: str  # Format: "YYYY-MM-DD"
    slots: List[str]  # Format: ["10:00 AM", "2:00 PM", ...]

class BookingCreate(BaseModel):
    email: EmailStr
    date: str  # Format: "YYYY-MM-DD"
    time_slot: str  # Format: "10:00 AM"

class UrgentRequest(BaseModel):
    email: EmailStr
    message: str

# Response models
class AvailableSlotsResponse(BaseModel):
    slots: List[str]

class BookingResponse(BaseModel):
    id: int
    email: str
    date: str
    time_slot: str
    message: str = "Booking confirmed successfully"

# Admin: Create/Update available slots for a specific date
@router.post("/slots")
async def create_or_update_slots(slot_data: SlotCreate):
    try:
        # First, remove existing slots for this date
        await db.slot.delete_many(
            where={"date": slot_data.date}
        )
        
        # Create new slots for this date
        for time_slot in slot_data.slots:
            await db.slot.create(
                data={
                    "date": slot_data.date,
                    "time_slot": time_slot,
                    "booked": False
                }
            )
        
        return {"message": "Slots updated successfully", "date": slot_data.date, "slots": slot_data.slots}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating slots: {str(e)}")

# User: Get available slots for a specific date
@router.get("/slots/available", response_model=AvailableSlotsResponse)
async def get_available_slots(date: str = Query(..., description="Date in YYYY-MM-DD format")):
    try:
        slots = await db.slot.find_many(
            where={
                "date": date,
                "booked": False
            }
        )
        
        # Extract just the time slots
        available_slots = [slot.time_slot for slot in slots]
        
        return AvailableSlotsResponse(slots=available_slots)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching slots: {str(e)}")

# User: Book a slot
@router.post("/book", response_model=BookingResponse)
async def book_slot(booking_data: BookingCreate):
    try:
        # Find the specific slot
        slot = await db.slot.find_first(
            where={
                "date": booking_data.date,
                "time_slot": booking_data.time_slot,
                "booked": False
            }
        )
        
        if not slot:
            raise HTTPException(status_code=404, detail="Slot not found or already booked")
        
        # Create booking
        booking = await db.booking.create(
            data={
                "email": booking_data.email,
                "slot": {
                    "connect": {"id": slot.id}
                }
            }
        )
        
        # Mark slot as booked
        await db.slot.update(
            where={"id": slot.id},
            data={"booked": True}
        )
        
        return BookingResponse(
            id=booking.id,
            email=booking.email,
            date=booking_data.date,
            time_slot=booking_data.time_slot
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error booking slot: {str(e)}")

# Admin: Get all bookings
@router.get("/admin/bookings")
async def get_all_bookings():
    try:
        bookings = await db.booking.find_many(
            include={"slot": True}
        )
        
        formatted_bookings = []
        for booking in bookings:
            formatted_bookings.append({
                "id": booking.id,
                "email": booking.email,
                "date": booking.slot.date,
                "time_slot": booking.slot.time_slot,
                "booked_at": booking.slot.datetime if hasattr(booking.slot, 'datetime') else None
            })
        
        return {"bookings": formatted_bookings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching bookings: {str(e)}")

# Urgent requests
@router.post("/urgent-request")
async def submit_urgent_request(request: UrgentRequest):
    try:
        # Create urgent request in database
        urgent_request = await db.urgentrequest.create(
            data={
                "email": request.email,
                "message": request.message,
                "status": "pending"
            }
        )
        
        return {
            "message": "Urgent request submitted successfully",
            "email": request.email,
            "status": "received",
            "id": urgent_request.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting urgent request: {str(e)}")

# Admin: Get all urgent requests
@router.get("/admin/urgent-requests")
async def get_urgent_requests():
    try:
        urgent_requests = await db.urgentrequest.find_many(
           
        )
        
        formatted_requests = []
        for req in urgent_requests:
            formatted_requests.append({
                "id": req.id,
                "email": req.email,
                "message": req.message,
                "status": req.status,
                "created_at": req.created_at.isoformat(),
            })
        
        return {"urgent_requests": formatted_requests}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching urgent requests: {str(e)}")

# Admin: Update urgent request status
@router.put("/admin/urgent-requests/{request_id}")
async def update_urgent_request_status(request_id: int, status: str):
    try:
        updated_request = await db.urgentrequest.update(
            where={"id": request_id},
            data={"status": status}
        )
        
        return {
            "message": "Status updated successfully",
            "id": updated_request.id,
            "status": updated_request.status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating urgent request status: {str(e)}")