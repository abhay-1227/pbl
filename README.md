# PantryPilot AI 🍳

Your personal Nutrition & Wellness Companion - A comprehensive platform for smart recipe generation, nutrition tracking, and traditional Indian yoga exercises.

![PantryPilot AI](public/logo.svg)

## ✨ Features

### 🤖 AI Recipe Generator
- Generate personalized recipes based on available ingredients
- Support for various cuisines (Indian, Italian, Chinese, Mediterranean, Mexican)
- Diet preferences (Vegetarian, Vegan, Gluten-free)
- Customizable cooking time, servings, and calorie targets
- Spice level adjustment (Mild, Medium, Hot)
- Detailed nutritional information for each recipe

### 📊 Nutrition Tracker
- Track daily calories, protein, carbs, and fats
- Organize meals by Breakfast, Lunch, Dinner, and Snacks
- Date-based navigation to view historical data
- Visual progress bars showing daily targets
- Micronutrient tracking (Vitamins, Minerals)
- User-specific data storage

### 🧘 Yoga & Exercises
- Comprehensive library of traditional Indian yoga asanas
- Detailed step-by-step instructions
- Benefits and precautions for each pose
- Filter by level (Beginner, Intermediate, Advanced)
- Filter by focus area (Flexibility, Strength, Balance, Relaxation, Breathing)
- Sanskrit names and descriptions

### 🔐 User Authentication
- Email-based login/signup
- Secure user sessions
- Individual user profiles
- Personalized data storage

### 🎨 Beautiful Design
- Modern glassmorphism UI
- Dark/Light theme toggle
- Smooth animations and transitions
- Fully responsive design
- Eye-friendly color palette

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/pantrypilot-ai.git
cd pantrypilot-ai
```

2. Install dependencies:
```bash
bun install
```

3. Set up the database:
```bash
bunx prisma db push
```

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
pantrypilot-ai/
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   └── logo.svg            # App logo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/       # Authentication API
│   │   │   ├── nutrition/  # Nutrition tracking API
│   │   │   └── recipes/    # Recipe generation API
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main application
│   ├── components/ui/      # UI components
│   └── lib/
│       └── db.ts           # Database client
├── tailwind.config.ts      # Tailwind configuration
└── package.json
```

## 🛠️ Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: SQLite with Prisma ORM
- **AI Integration**: z-ai-web-dev-sdk
- **Icons**: Lucide React

## 📱 Screenshots

### Home Page
Beautiful hero section with AI recipe generator

### Nutrition Tracker
Daily tracking with progress visualization

### Yoga & Exercises
Comprehensive yoga library with detailed instructions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Traditional Indian Yoga practices
- shadcn/ui for beautiful components
- All contributors and users

---

Made with ❤️ by PantryPilot AI Team
