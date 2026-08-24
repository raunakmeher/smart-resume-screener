# Smart Resume Screener
 
An AI-assisted resume screening tool that uses the **Google Gemini API** to analyze resumes and job descriptions, semantically match candidates, calculate hybrid scores, identify skill gaps, and rank candidates.
 
## Demo Video


https://github.com/user-attachments/assets/11d4df5d-6745-4c3b-a983-0bef4a25f7b3



 
## Live Deployment
https://smart-resume-screener-sooty-seven.vercel.app/
 
## Features
 
- PDF resume upload and text extraction using Apache PDFBox
- Gemini-powered resume and job description analysis
- AI-based candidate-job matching
- Recruiter screening instructions
- Hybrid candidate scoring
- Candidate ranking with configurable thresholds
- Gemini-powered skill gap analysis
- Bias-aware screening and audit
- PostgreSQL persistence
- Dockerized Spring Boot backend
## Hybrid Scoring
 
```
finalScore = requiredSkillScore  * 0.40
           + semanticScore       * 0.30
           + experienceScore     * 0.20
           + preferredSkillScore * 0.10
```
 
## Tech Stack
 
- **Backend:** Java 21, Spring Boot, Spring Data JPA, PostgreSQL, Apache PDFBox
- **Frontend:** React, Vite, Tailwind CSS
- **AI:** Google Gemini API
- **Deployment:** Docker, Render, Vercel
## Project Structure
 
```
backend/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
└── Dockerfile
 
frontend/
├── src/
│   ├── api/
│   ├── components/
│   └── pages/
└── vite.config.js
```
 
## Running Locally
 
### Backend
 
**Requirements:**
- Java 21
- PostgreSQL
- Gemini API key
**Set:**
 
```
DATABASE_URL=jdbc:postgresql://localhost:5432/smartresume
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
GEMINI_API_KEY=your_gemini_key
ALLOWED_ORIGINS=http://localhost:5173
```
 
**Then:**
 
```bash
cd backend
./mvnw spring-boot:run
```
 
On Windows:
 
```bash
mvnw.cmd spring-boot:run
```
 
Backend runs on: `http://localhost:8080`
 
### Frontend
 
```bash
cd frontend
npm install
npm run dev
```
 
Frontend runs on: `http://localhost:5173`
 
## Environment Variables
 
### Backend
 
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL JDBC URL |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Server port |
| `ALLOWED_ORIGINS` | Allowed frontend origins |
 
### Frontend
 
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Production backend URL |

 
## Main APIs
 
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/resumes/upload` | Upload resume |
| POST | `/api/resumes/{id}/analyze` | Analyze resume with Gemini |
| POST | `/api/jobs` | Create job |
| POST | `/api/jobs/{id}/analyze` | Analyze JD with Gemini |
| POST | `/api/screening/resume/{resumeId}/job/{jobId}` | Screen candidate |
| GET | `/api/ranking/job/{jobId}?threshold=70` | Rank candidates |
| POST | `/api/skill-gap/resume/{resumeId}/job/{jobId}` | Analyze skill gaps |
| GET | `/api/bias/audit` | View bias audit |
 
## Deployment
 
```
GitHub
   ├──→ Vercel
   │     └── React Frontend
   │
   └──→ Render
         ├── Spring Boot Backend
         └── PostgreSQL
                │
                └── Gemini API
```
 
For production:
 
- Set `VITE_API_URL` in Vercel to the Render backend URL.
- Set `ALLOWED_ORIGINS` in Render to the Vercel frontend URL.
- Set database credentials and `GEMINI_API_KEY` as Render environment variables.
## Limitations
 
- No authentication or authorization.
- PDF uploads are limited to 10 MB.
- The deployed backend may sleep when idle on free hosting.
- Gemini API usage requires a valid API key.

## Future Enhancements
 
- User authentication and role-based access (recruiter, admin, candidate)
- Bulk resume upload and batch screening
- Support for additional resume formats (DOCX, TXT)
- Export screening results and rankings to CSV/PDF
  
## Author
 
Raunak Meher
