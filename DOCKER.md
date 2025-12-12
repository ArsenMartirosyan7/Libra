# Libra Developer Guide

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Running with Docker Compose](#running-with-docker-compose)
- [Building Target Files](#building-target-files)

## Introduction

Welcome to the developer guide for Project Libra. This guide provides instructions on running the project using Docker Compose and building target files from the terminal.

## Prerequisites

Make sure you have the following installed on your machine:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)
- Git: [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Building Target Files for backend

If you need to build target files for the project without Docker Compose, follow these steps:

1. Navigate to the project root directory:

    ```bash
    cd path/to/project
    ```

2. Build the project using your build tool (e.g., Maven for Java):

    ```bash
    mvn clean package
    ```

   This will compile the code, run tests, and package the application into the target directory.

3. After a successful build, you can find the built artifacts in the `target` directory.

---
## Running with Docker Compose

1. Clone the project repository:

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. Navigate to the project directory:

    ```bash
    cd path/to/project
    ```

3. Run Docker Compose:

    ```bash
    docker-compose up --build
    ```

   This command will build and start the Docker containers specified in the `docker-compose.yml` file.

4. Access the application:

    - Backend: Open your browser and go to `http://localhost:8080`
    - Frontend: Open your browser and go to `http://localhost:3000`

5. To stop the containers, use:

    ```bash
    docker-compose down
    ```
---


That's it! You should now be able to run the project using Docker Compose and build target files using the terminal. If you encounter any issues, refer to the troubleshooting section or reach out to the project maintainers.
