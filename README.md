# InteriorAI - Design Analyzer

InteriorAI is a modern, AI-powered web application that transforms how users interact with interior design. By leveraging the multimodal capabilities of **Google Gemini 2.5 Flash**, the application analyzes uploaded photos of rooms to identify specific design styles and generate actionable shopping recommendations.

![App Screenshot](https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop)

## 🚀 Key Features

*   **Instant Style Recognition**: accurately identifies complex interior design styles (e.g., "Mid-Century Modern", "Japandi", "Industrial") from a single photo.
*   **Visual Analysis**: Provides a concise, engaging description of the aesthetic elements present in the room.
*   **Curated Shopping Lists**: Automatically generates a list of 5-8 furniture or decor items visible in the photo or complementary to the style, complete with material details and estimated prices.
*   **Demo Mode**: Includes pre-loaded example images for users to test the capabilities instantly.
*   **Responsive UI**: A clean, mobile-friendly interface built with React and Tailwind CSS.

## 💡 Use Cases

### 1. For Homeowners & DIY Renovators
*   **"What style is this?"**: Users often see a room they love on Pinterest or Instagram but don't know the terminology to search for it. InteriorAI identifies the exact style name.
*   **Recreating a Look**: Users can upload a photo of a dream room, and the app breaks it down into individual purchasable items (e.g., "Teak Sideboard", "Bouclé Armchair"), making it easier to shop for similar pieces.

### 2. For Real Estate & Staging
*   **Listing Descriptions**: Agents can upload photos of a staged home to generate professional descriptions of the decor style for property listings.
*   **Staging Ideas**: Upload an empty or partially furnished room to get ideas on what items (Shopping List) would fit a specific aesthetic target.

### 3. For Interior Design Enthusiasts
*   **Education**: Learn to distinguish between similar styles (e.g., Scandi vs. Minimalist) by analyzing different photos and reading the AI's breakdown of style elements.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Model**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
*   **Icons**: Lucide React
*   **Build Tool**: Vite (implied)

## 📦 Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Ensure you have a valid Google Gemini API Key. The application expects the key to be available in `process.env.API_KEY`.

4.  **Run the application**
    ```bash
    npm start
    ```

## 📄 License

MIT
