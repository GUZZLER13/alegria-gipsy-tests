# Alegria Gipsy - E2E Tests

This repository contains End-to-End (E2E) tests for the **Alegria Gipsy** project, powered by [Playwright](https://playwright.dev/).

## 🎯 Target Application

The tests run against the production version of the site:
👉 **[URL_A_REMPLACER_PAR_L_USER]**

*(Note: Replace `[URL_A_REMPLACER_PAR_L_USER]` with the actual production URL)*

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/GUZZLER13/alegria-gipsy-tests.git
    cd alegria-gipsy-tests
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    ```bash
    npx playwright install
    ```

## 🧪 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests in UI mode (Interactive)
```bash
npx playwright test --ui
```

### Run specific test file
```bash
npx playwright test tests/example.spec.ts
```

### View HTML Report
```bash
npx playwright show-report
```

## 📂 Project Structure

- `tests/`: Contains the test specifications (`.spec.ts`).
- `test-examples/`: Default examples provided by Playwright.
- `playwright.config.ts`: Configuration file (browsers, base URL, etc.).
