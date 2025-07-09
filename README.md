# stock-assessment

Technical Implementation Plan

1. Set up the Vite environment
2. Configure TypeScript
3. Integrate Tailwind CSS.
4. Organize the project with a flexible folder structure:
   - `apiServices/`: Handles all API requests (e.g., using Axios).
   - `components/`: Contains reusable UI components.
   - `config/`: Stores configuration files like `env.ts` for environment variables.
   - `interfaces/`: Defines TypeScript types and interfaces for data consistency.
   - `pages/`: Contains main pages such as the landing page, stock list, and stock detail pages.
5. Use an external API to fetch real-time stock values and symbols.
6. Ensure global styles are loaded by importing `index.css` in `main.tsx`.


Challenges

1. Finding a reliable and free external API for real-time stock data.

Insights and Approach

- Using Vite with React and TypeScript provides a modern, fast, and type-safe development environment.
- Tailwind CSS allows for rapid UI prototyping and consistent design.
- Separating concerns with an organized folder structure improves maintainability and scalability.
- All configuration files (`tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `vite.config.ts`) are set up to work seamlessly together.


