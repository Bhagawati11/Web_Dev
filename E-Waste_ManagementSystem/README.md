# EcoDispose (E-waste Management Platform)

## 1. Assignment Title and Case Study
- Application: EcoDispose - Intelligent E-waste Management Platform
- Domain: Environmental Technology, Logistics Management, Civic Service

## 2. Problem Statement
Rapid technological growth is increasing electronic waste. Improper disposal leads to environmental and health hazards. This platform solves low awareness, poor access to certified disposal centers, and unorganized collection.

## 3. Objectives
1. Guide users on safe e-waste disposal methods
2. Locate nearby authorized recycling centers
3. Enable pickup scheduling
4. Promote sustainable recycling
5. Reduce pollution from improper handling

## 4. Scope
- Households, students, offices, businesses
- Collection agencies and authorized centers
- Government and NGOs as secondary stakeholders

## 5. Features
- Nearby disposal center finder
- Pickup scheduling and status tracking
- Multi-location collection planning
- Awareness/educational content
- Logistics optimization

## 6. Tech Stack
- Backend: Node.js, Express
- Database: MongoDB (via Mongoose)
- Frontend: HTML, CSS, JavaScript
- APIs: Geolocation + static center data (plus optional Maps API integration extension)

## 7. Run Locally
1. Install dependencies: `npm install`
2. Create `.env` with:
   - `PORT=5000`
   - `MONGO_URI=mongodb://localhost:27017/ecoDispose`
3. Start server: `npm run dev`
4. Open `http://localhost:5000/`

## 8. Data Models & APIs
- `Center`, `PickupRequest`, `User` (setup ready)
- `GET /api/centers`
- `GET /api/guide?type=`
- `GET /api/pickups`
- `POST /api/pickups`
- `GET /api/awareness`

## 9. Notes
This project folder is the requested `E-waste_ManagementSystem` app.
