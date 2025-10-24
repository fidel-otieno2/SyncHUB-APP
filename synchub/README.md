# SyncHub File Synchronization System

## 1. Introduction
The SyncHub File Synchronization System is a collaborative capstone project designed to enable users to synchronize, manage, and share files seamlessly across devices in real-time. The platform uses open-source technologies such as MinIO and Ngrok to handle secure file transfers and real-time syncing. The goal of SyncHub is to provide a decentralized yet efficient solution for managing files among distributed users, even under network constraints.

The main motivation is to simplify file management within families, teams, and organizations by using one computer as a central server that other connected users can access remotely. SyncHub emphasizes simplicity, data privacy, and scalability, making it suitable for both personal and small enterprise use cases.

## 2. Objectives
The main objectives of SyncHub are:
- To provide a secure, real-time file synchronization platform using open-source technologies.
- To allow users to define, upload, and manage files with custom titles and metadata.
- To enable users to access synced files from any location through a dynamic Ngrok tunnel.
- To ensure all data is stored reliably using MinIO and PostgreSQL.
- To support team collaboration with user authentication and role management.

## 3. Technologies Used
- **Frontend**: React.js (for UI components, routing, and file visualization).
- **Backend**: Flask (for RESTful API endpoints handling file operations and user management).
- **Database**: PostgreSQL (to store metadata, user information, and logs).
- **Storage**: MinIO (open-source object storage for handling file uploads and synchronization).
- **Tunneling**: Ngrok (for exposing the local Flask server to the internet securely).
- **Authentication**: JWT (for secure user login and access control).
- **Version Control**: GitHub (for collaboration and version management).

## 4. System Architecture
The system consists of three main layers:
1. **Frontend Layer**: Handles user interactions and displays files, upload status, and synchronization progress.
2. **Backend Layer**: Built with Flask, it processes file upload, authentication, and database queries. It also interfaces with MinIO and Ngrok.
3. **Storage Layer**: Uses MinIO to store files and PostgreSQL to handle metadata and user management.

A local server (the host device) acts as the central file sync node. Through Ngrok, this server can be accessed remotely via a public URL. Other connected users can upload, download, and synchronize files with real-time updates.

## 5. Database Design
The PostgreSQL schema includes the following tables:
- **users** — Stores user details and authentication credentials.
- **files** — Contains file metadata, titles, and file paths.
- **sync_sessions** — Tracks synchronization logs and session activity.
- **activity_logs** — Records upload, download, and delete actions.
- **user_roles** — Defines access privileges and file permissions.
