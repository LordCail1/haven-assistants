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

### 1. OpenAI Module

The `openai` module in this NestJS project is intricately structured to mirror the division and functionalities of the OpenAI SDK. This module is composed of four primary services:

- **Assistants**: Manages the creation and operation of various AI assistants, aligning with the `assistants` service in the SDK.
- **Messages**: Corresponds with the `messages` service in the SDK, this service is pivotal in managing message creation and retrieval within threads.
- **Runs**: This service aligns with the `runs` service in the SDK, overseeing the execution runs on threads.
- **Threads**: Reflecting the `threads` service of the SDK, this service handles the organization and management of conversation threads.

Each service within this module is designed to closely adhere to the structure and functionality of its SDK counterpart, providing a robust framework for integrating OpenAI's advanced AI capabilities into the project's backend architecture. It is essentially just a wrapper.

### 2. Assistants Module

The `assistants` module is responsible for creating and managing the assistants: `Questioner`, `Refugee`, and `Summarizer`. These assistants are integral to the interview process, with each playing a specific role in interacting with users. The module also includes a `Refugee` assistant, primarily used for testing and simulating the refugee interview experience.

### 3. Haven AI Agent Module

This module contains the controller that responds to client requests and orchestrates the overall interaction with the API. The `haven-ai-agent` module is key to managing the flow of interactions and ensuring a seamless user experience when engaging with the API.

### 4. Helpers Module

The `helpers` module includes various utility methods that support other modules. These methods provide common functionalities that are essential across different parts of the application but did not fit naturally into other specific modules.

### 5. Prompt Creator Module

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

NestJS is a framework for building efficient and scalable server-side applications. It utilizes TypeScript and is heavily inspired by Angular. Key components of a NestJS project include:

- **Controllers**: Handle incoming requests and return responses to the client.
- **Providers/Services**: Encapsulate business logic, used by controllers or other services.
- **Modules**: Organize code into distinct features, grouping controllers and providers.

### Project Structure

This project follows the typical NestJS structure with modules, controllers, and services. Each feature of the API is encapsulated in its dedicated module, ensuring clean separation of concerns and modularity.

### Starting the Project

To start the project, navigate to the root directory and run the following command:

```bash
npm run start
```

This command will compile and launch the application, making it accessible locally for testing purposes.

_Note_: If you want to start it with the purpose of development, you should opt for

```bash
npm run start:dev
```

As this command starts the server with hot reload.

---

## Modification Guidelines

To modify this API:

1. Understand the existing module structure, especially the `HavenAiAgentModule`.
2. Follow NestJS best practices for coding and structure.
3. Ensure any new features align with the primary goal of enhancing user interaction during the sign-up process.
4. Adhere to the existing testing and documentation standards for maintainability.
