# UniClass-Web-Dev-Group-Project

**Clone**
- **Repo:** Clone the project and open it.

```bash
git clone <your-repo-ssh-or-https> UniClass-Web-Group-Project
cd UniClass-Web-Group-Project
```

**Environment**
- **Backend folder:** [uniclass-backend](uniclass-backend)
- **Node:** Install Node.js (v16+) and `npm`.
- **Install deps:**

```bash
cd uniclass-backend
npm install
```

**Environment variables**
- Copy the env template (create a file named `.env` in `uniclass-backend`):

```bash
cp .env.example .env   # or create .env manually
```

- Required variables (example):

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
JWT_SECRET=someLongSecret
DB_HOST=127.0.0.1
DB_PORT=1521
DB_USER=app_user
DB_PASS=app_password
DB_SID=ORCLCDB   # or the SID of your PDB/instance
```

**Oracle: Create a PDB and application user**
- You can use an existing Oracle Container Database (CDB). If you need a new Pluggable Database (PDB), connect as SYSDBA and run (adjust file paths for your system):

```sql
-- connect as SYSDBA
-- sqlplus / as sysdba

CREATE PLUGGABLE DATABASE uni_pdb
	ADMIN USER pdb_admin IDENTIFIED BY YourAdminPassword
	FILE_NAME_CONVERT = ('/u01/app/oracle/oradata/ORCLCDB/', '/u01/app/oracle/oradata/uni_pdb/');

ALTER PLUGGABLE DATABASE uni_pdb OPEN;
```

- Switch to the PDB and create the application user and tablespace (example):

```sql
-- connect to the PDB
ALTER SESSION SET CONTAINER=uni_pdb;

CREATE USER app_user IDENTIFIED BY app_password
	DEFAULT TABLESPACE users_ts
	TEMPORARY TABLESPACE temp;

CREATE TABLESPACE users_ts DATAFILE '/u01/app/oracle/oradata/uni_pdb/users_ts01.dbf' SIZE 100M AUTOEXTEND ON;

GRANT CONNECT, RESOURCE TO app_user;
GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW, CREATE SEQUENCE TO app_user;
```

- Note: paths like `/u01/app/oracle/oradata/...` must exist and be writable by Oracle. If you're using Oracle XE or a managed instance, follow its docs for PDB creation or use an existing PDB.

**Run backend**
- Build (TypeScript) and start the Nest app from the `uniclass-backend` folder:

```bash
cd uniclass-backend
npm run build
npm run start
```

**Troubleshooting & notes**
- If TypeScript complains about missing env typing, ensure `.env` values are set or cast where necessary.
- For local Oracle development, a Dockerized Oracle or Oracle XE installation is recommended. See Oracle docs for official images and licensing.
- The API auth routes live under `/api/v1/auth` (see [src/auth](uniclass-backend/src/auth)).

lETS BUILD...
