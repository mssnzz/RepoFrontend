
# GitHub Repository System Frontend Project Setup

Welcome to the GitHub Repository System Frontend project! This guide will walk you through the steps required to set up the project on your local machine.

## Prerequisites

- Git
- Node.js

## Installation

1. **Clone the Repository**  
   Start by cloning the repository from GitHub.
   ```bash
   git clone https://github.com/mssnzz/RepoFrontend.git
   ```

2. **Navigate to the Project Directory**  
   Once the repository is cloned, navigate into the directory.
   ```bash
   cd RepoFrontend
   ```

3. **Install Dependencies**  
   Install the necessary project dependencies using npm.
   ```bash
   npm install
   ```

4. **Update API Base URL**  
   Open the `/services/api.ts` file and modify the `BASE_URL` constant.
   ```typescript
   const BASE_URL = 'http://localhost:4000';
   ```

## Running the Project
    --- npm run dev

