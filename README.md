#  Marine Litter & Plastic Pollution Detector

A web application powered by Google's Gemini Vision AI to detect, analyze, and categorize marine plastic waste in coastal and underwater environments. 

***  Live Demo:** [https://marine-litter-detector.onrender.com](https://marine-litter-detector.onrender.com)

##  Features
* **AI Image Detection:** Upload images to instantly identify plastic bottles, microplastics, and other marine debris.
* **Pollution Index Scoring:** Calculates a localized pollution severity score based on detected waste.
* **Bounding Box Overlays:** Visually highlights and labels detected litter directly on the image with confidence scores.
* **TACO Taxonomy:** Utilizes the Trash Annotations in Context (TACO) framework for accurate waste categorization.

##  Tech Stack
* **Frontend:** React, TypeScript, Vite
* **Backend:** Node.js
* **AI Integration:** Google Gemini API (Gemini Vision)
* **Deployment:** Render

##  Run Locally

To run this project on your own machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Nelcy2005/marine-litter-detector.git](https://github.com/Nelcy2005/marine-litter-detector.git)


**Install dependencies:**

**Bash**
npm install

**Configure Environment Variables:**
Create a .env file in the root directory and add your Gemini API key:

**Code snippet**
GEMINI_API_KEY="your_api_key_here"

**Start the development server:**
**Bash**
npm run dev

👨‍💻 Developer
Nelcy Vincent