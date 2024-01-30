# Haven AI Agent API

## What is this API and Why Does It Exist?

The Haven AI Agent API is a NestJS-based backend solution designed to enhance the sign-up process for Haven, a platform aiding immigrants in Canada. This API integrates OpenAI's GPT technologies, facilitating personalized interactions with users during their sign-up journey. It aims to collect essential information from refugees and assist them in sharing their unique stories, thereby enabling Supporters to better understand and aid their resettlement.

---

## Dependencies

This API leverages several key dependencies for optimal functionality:

- **@nestjs/common, @nestjs/core**: Fundamental NestJS modules for building scalable server-side applications.
- **OpenAI SDK**: Integrates OpenAI's GPT technologies for AI-driven interactions.
- **Class-validator, Class-transformer**: Utilized for data validation and transformation.
- **UUID**: Generates unique identifiers.
- **Swagger (NestJS Swagger)**: Provides a Swagger UI for API documentation, making it easier to understand and interact with the API's endpoints.
- Other essential dependencies, as outlined in the `package.json` file

---

## Module Overview

### 1. 'openai' Module

The `openai` module in this NestJS project is intricately structured to mirror the division and functionalities of the OpenAI SDK. This module is composed of four primary services:

- **Assistants**: Manages the creation and operation of various AI assistants, aligning with the `assistants` service in the SDK.
- **Messages**: Corresponds with the `messages` service in the SDK, this service is pivotal in managing message creation and retrieval within threads.
- **Runs**: This service aligns with the `runs` service in the SDK, overseeing the execution runs on threads.
- **Threads**: Reflecting the `threads` service of the SDK, this service handles the organization and management of conversation threads.

Each service within this module is designed to closely adhere to the structure and functionality of its SDK counterpart, providing a robust framework for integrating OpenAI's advanced AI capabilities into the project's backend architecture. It is essentially just a wrapper.

### 2. 'assistants' Module

The `assistants` module is responsible for creating and managing the assistants: `Questioner`, `Refugee`, and `Summarizer`. These assistants are integral to the interview process, with each playing a specific role in interacting with users. The module also includes a `Refugee` assistant, primarily used for testing and simulating the refugee interview experience.

### 3. 'haven-ai-agent' Module

This module contains the controller that responds to client requests and orchestrates the overall interaction with the API.

### 4. 'helpers' Module

The `helpers` module includes various utility methods that support other modules. These methods provide common functionalities that are essential across different parts of the application but did not fit naturally into other specific modules.

### 5. 'prompt-creator' Module

Tasked with processing information from the interviewed refugees, the `prompt-creator` module generates formatted prompts compatible with the OpenAI API. It ensures that the data collected during interviews is structured appropriately for efficient and accurate processing by the AI system.

---

Certainly, here's a revised version of the Deployment section, including the information that the environment variables are already set:

---

## Deployment

The HavenOpenaiApi is currently deployed as a Web App, with essential configurations already in place:

1. **Web App Resource**: Deployed under the name `HavenOpenaiApi`.

2. **Continuous Deployment**: Configured for automatic updates. Any changes pushed to the `main` branch trigger a re-deployment, ensuring the application is always up-to-date.

3. **Environment Configuration**:
   - **OPENAI_KEY**: The API key from OpenAI.
   - **ORGANIZATION_ID**: This identifies the organization linked to the OpenAI API key.

These environment variables are currently configured in the Web App's settings. If modifications are required, the above information will be useful.

---

## Understanding NestJS and Project Structure

### Basics of NestJS

NestJS is a TypeScript-based framework for building efficient, scalable server-side applications. It's inspired by Angular and organizes code into modules, controllers, and providers/services, enabling a modular and maintainable architecture.

### Project Structure

Our project follows the NestJS structure, with each API feature encapsulated in its dedicated module. This ensures clean separation of concerns and enhances modularity.

### Environment Setup for Local Development

Before running the project locally, ensure that the environment variables are set up correctly. NestJS manages environment variables through `.env` files. You should have three `.env` files:

- `.env.development`
- `.env.production`
- `.env.test`

Each file should include `OPENAI_KEY` and `ORGANIZATION_ID`. You have the flexibility to use different OpenAI API keys for different environments, such as testing, development, and production. The appropriate `.env` file is automatically loaded based on the `NODE_ENV` value, which is determined by the start-up command used from `package.json`.

### Starting the Project

To start the project, use the following commands:

- `npm run start`: Starts the server without hot reload (development mode).
- `npm run start:dev`: Starts the server with hot reload (development mode).

### Other Commands for Production

For production-related tasks, the following commands are available:

- `npm run build`: Compiles the project and creates a `dist` folder. This is a necessary step before running the application in production.
- `npm run start:prod`: Starts the server in production mode. This command sets `NODE_ENV` to production and runs the compiled application from the `dist` directory.

---

I've reviewed the latest version of your README.md file and will reorganize the "Modification Guidelines" section into the three suggested subsections. The content from the "Recommended Reading for NestJS" will be incorporated into the first subsection. The structure for the other two subsections will be created, awaiting your detailed instructions on how to modify the behavior of the assistants and the tests. Here's the updated structure:

---

## Modification Guidelines

### 1. General Changes to the Codebase

For foundational knowledge necessary to work effectively with NestJS, spending 30 to 45 minutes reading just the following documentation pages is highly beneficial. This will equip you with the essentials for wiring up components in NestJS and guide you to more advanced features:

1. [First Steps in NestJS](https://docs.nestjs.com/first-steps): Introduction to the framework, covering basic concepts and setup.
2. [Controllers in NestJS](https://docs.nestjs.com/controllers): Handling incoming requests and responses.
3. [Providers in NestJS](https://docs.nestjs.com/providers): Understanding the role of providers/services in the application.
4. [Modules in NestJS](https://docs.nestjs.com/modules): Structuring the application using modules.

These resources provide a starting point for anyone new to NestJS. Alternatively, observing and mimicking how existing modules are wired up can offer practical insights.

Thank you for the clarification. With the provided example in mind, here's the revised explanation for updating the behavior of the assistants:

### 2. Making Changes to the Behavior of the Assistants

To modify the behavior of an assistant, you should update the `instructions.txt` file within the respective assistant's service folder. Here’s the process using an assistant service file as an example:

1. **Locate the Service File**: Find the service file for the specific assistant, such as `assistants.questioner.service.ts` for the Questioner assistant.

2. **Create a New Revision**: Make a new folder for the revision (e.g., `v3`) under the assistant's directory and add a new `instructions.txt` file with the updated behavior.

3. **Update Service File**: Modify the service file to load the new instruction file. For instance, in the `AssistantsQuestionerService` class:

   ```typescript
   const instructions = await this.loadInstructions(
     __dirname,
     'v3/instructions.txt',
     AssistantName.QUESTIONER,
   );
   ```

4. **Reload the Server**: Restart the server after making changes. This will reload the assistants with the latest instructions, as they are wiped clean from the OpenAI website [https://platform.openai.com/assistants] and reloaded upon loading the `assistants.module.ts` file.

Following this method, you can manage updates to the assistants' behaviors and maintain a revision history.

### 3. Making Changes to Tests

#### Test Configurations

The project has two test configurations:

1. **E2E Tests**: The configuration file for E2E tests is located in the `/test` directory at the root of the repository. All E2E test files should be placed here and must end with `.e2e-spec.ts`.

2. **Unit Tests**: The configuration for unit tests is within the `package.json`. Unit test files, ending with `.spec.ts`, are found in the `/src` directory, typically within a `test` folder in each module.

#### Test Commands

The following commands, as specified in `package.json`, are used for running tests:

- `npm run test`: Runs all unit tests using Jest.
- `npm run test:watch`: Runs unit tests in watch mode.
- `npm run test:e2e`: Executes E2E tests, using the configuration specified in `./test/jest-e2e.json`.
- `npm run test:e2e:watch`: Runs E2E tests in watch mode, still from the configuration specified in `./test/jest-e2e.json`.
