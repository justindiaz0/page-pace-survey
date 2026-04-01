# Page Pace Survey

## Description

Page Pace Survey is a web-based survey tool built to understand the personal reading habits of university students. It collects responses on reading frequency, common distractions, consistency challenges, and burnout patterns — particularly around end-of-day reading. The app stores all responses in a Supabase PostgreSQL database and displays aggregated, anonymous results through interactive charts. It is designed for use in an academic research context as part of BAIS:3300 at the University of Iowa.

## Badges

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Azure](https://img.shields.io/badge/Azure_Static_Web_Apps-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## Features

- Seven-question survey covering reading frequency, timing, distractions, duration, feelings, consistency helpers, and open-ended struggle reasons
- Required field validation with clear, inline error messages before submission
- "Submitting…" loading state and a success confirmation screen after each response
- Responses saved instantly to Supabase — accessible live in the Supabase Table Editor
- Results page with five interactive charts: reading frequency bar chart, preferred time bar chart, distractions horizontal bar chart, session length bar chart, and skipping feelings pie chart
- Fully responsive layout — works on phone, tablet, and desktop in a clean single-column design
- Purple accent color throughout with accessible contrast ratios and keyboard navigation support
- Consistent footer on every page: "Survey by Justin Diaz, BAIS:3300 - Spring 2026"

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI component framework |
| Vite | Build tool and dev server |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible UI component library (Radix UI based) |
| Wouter | Lightweight client-side routing |
| React Hook Form | Form state management |
| Zod | Schema-based form validation |
| Supabase JS Client | Database reads and writes |
| Supabase PostgreSQL | Cloud database for storing survey responses |
| Recharts | Charting library for the results page |
| Azure Static Web Apps | Production hosting |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/installation) v8 or higher
- A [Supabase](https://supabase.com) account with a project created

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/justdiaz/page-pace-survey.git
   cd page-pace-survey
   ```

2. Install dependencies from the workspace root:
   ```bash
   pnpm install
   ```

3. Create a `.env` file inside `artifacts/page-pace-survey/` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. In your Supabase project, open the SQL Editor and run the following:
   ```sql
   CREATE TABLE IF NOT EXISTS survey_responses (
     id SERIAL PRIMARY KEY,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     reading_frequency TEXT NOT NULL,
     reading_time TEXT NOT NULL,
     distractions TEXT[] NOT NULL,
     reading_duration TEXT NOT NULL,
     skipping_feeling TEXT NOT NULL,
     consistency_helpers TEXT[] NOT NULL,
     struggle_reason TEXT NOT NULL
   );

   ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow public inserts" ON survey_responses
     FOR INSERT WITH CHECK (true);

   CREATE POLICY "Allow public reads" ON survey_responses
     FOR SELECT USING (true);
   ```

5. Start the development server:
   ```bash
   pnpm --filter @workspace/page-pace-survey run dev
   ```

6. Open your browser to the local URL shown in the terminal.

## Usage

- Visit `/` to see the survey landing page
- Click **Take Survey** to go to `/survey` and fill out all seven questions
- Submit the form — a success screen confirms your response was saved
- Click **View Results** to go to `/results` and see live aggregated charts
- All data is anonymous and stored in your Supabase project

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Project Structure

```
artifacts/page-pace-survey/
├── public/
│   ├── favicon.svg                  # App favicon
│   ├── opengraph.jpg                # OG image for link previews
│   └── staticwebapp.config.json     # Azure SPA routing fallback config
├── src/
│   ├── components/
│   │   ├── layout.tsx               # Shared page wrapper with footer
│   │   └── ui/                      # shadcn/ui component library
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Responsive breakpoint hook
│   │   └── use-toast.ts             # Toast notification hook
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client, types, and aggregation helpers
│   │   └── utils.ts                 # Tailwind class merge utility
│   ├── pages/
│   │   ├── home.tsx                 # Landing page with navigation buttons
│   │   ├── survey.tsx               # Seven-question survey form
│   │   ├── results.tsx              # Aggregated results with charts
│   │   └── not-found.tsx            # 404 fallback page
│   ├── App.tsx                      # Root component with router setup
│   ├── main.tsx                     # React DOM entry point
│   └── index.css                    # Global styles and Tailwind theme variables
├── package.json                     # Package config and scripts
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite build and dev server config
├── README.md                        # This file
└── WORKING_NOTES.md                 # Internal developer notes
```

## Changelog

### v1.0.0 — 2026-04-01
- Initial release
- Seven-question survey form with full validation
- Supabase integration for storing and reading responses
- Results page with five Recharts visualizations
- Azure Static Web Apps deployment configuration
- Responsive design with purple accent theme
- Footer attribution on all pages

## Known Issues / To-Do

- [ ] No duplicate submission prevention — the same user can submit multiple times
- [ ] The results page fetches all rows client-side; this will slow down as responses grow into the thousands
- [ ] No admin view to export responses as CSV or filter by date range
- [ ] Pie chart labels overlap when multiple options have similar percentages
- [ ] No loading spinner on the home page while Supabase initializes

## Roadmap

- Add a respondent count badge that updates in real time using Supabase Realtime subscriptions
- Add a CSV export button on the results page for offline analysis
- Add an admin-only password-protected view to read individual open-text responses
- Implement duplicate submission prevention using a session-based flag in localStorage
- Add a date range filter on the results page to compare responses over time

## Contributing

This project was created for an academic course and is not actively seeking external contributions. However, if you find a bug or have a suggestion, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch: `git checkout -b fix/your-fix-name`
3. Make your changes and commit: `git commit -m "fix: description of fix"`
4. Push to your fork: `git push origin fix/your-fix-name`
5. Open a Pull Request against the `main` branch

## License

This project is licensed under the [MIT License](LICENSE).

## Author

**Justin Diaz**
University of Iowa — BAIS:3300, Spring 2026

## Contact

GitHub: [github.com/justdiaz](https://github.com/justdiaz)

## Acknowledgements

- [Supabase Docs](https://supabase.com/docs) — database setup and RLS policy reference
- [shadcn/ui](https://ui.shadcn.com) — accessible component library
- [Recharts](https://recharts.org) — charting library documentation
- [Tailwind CSS Docs](https://tailwindcss.com/docs) — utility class reference
- [Azure Static Web Apps Docs](https://learn.microsoft.com/en-us/azure/static-web-apps/) — deployment and routing configuration
- [Vite Docs](https://vitejs.dev/guide/) — build tool configuration
- Replit AI Assistant — used to scaffold, build, and integrate the full application
