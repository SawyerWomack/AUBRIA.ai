# AUBRIA - AI Keynote Speaker Platform

A Next.js web application for the AUBRIA AI-generated keynote speaker system, built by Auburn University students.

---

## What This Project Does

- **Public website** showcasing AUBRIA (Home, Our Team pages)
- **Keynote request form** with live pricing calculator
- **File uploads** to AWS S3 (branding materials, background styles)
- **Admin dashboard** (password-protected) to view/manage requests
- **PDF export** for submitted requests
- **Data storage** in AWS DynamoDB

---

## Prerequisites

Before you start, make sure you have this installed on your computer:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org
   - To check if installed, open a terminal and run: `node --version`

2. **npm** (comes automatically with Node.js)
   - To check: `npm --version`

---

## Step 1: Download the Project

If you haven't already, clone or download this repository:

```bash
git clone https://github.com/SawyerWomack/AUBRIA.ai.git
cd AUBRIA.ai/aubria-next
```

Or if you already have the files, navigate to the `aubria-next` folder:

```bash
cd aubria-next
```

---

## Step 2: Install Dependencies

Run this command inside the `aubria-next` folder:

```bash
npm install
```

This will download all required packages. It may take 1-2 minutes.

---

## Step 3: Configure Environment Variables

AWS (IAM credentials, DynamoDB table, S3 bucket) is already set up. **Contact Bhuvana for the credentials.**

Inside the `aubria-next` folder, open the file called `.env.local` in any text editor.

Replace the placeholder values with the credentials Bhuvana provides:

```
# AWS Configuration
AWS_ACCESS_KEY_ID=ask-bhuvana
AWS_SECRET_ACCESS_KEY=ask-bhuvana
AWS_REGION=ask-bhuvana

# S3 Bucket for file uploads
S3_BUCKET_NAME=ask-bhuvana

# Admin password for viewing requests
ADMIN_PASSWORD=ask-bhuvana
```

**What to fill in:**

| Variable | What it is |
|----------|-----------|
| `AWS_ACCESS_KEY_ID` | AWS access key (get from Bhuvana) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key (get from Bhuvana) |
| `AWS_REGION` | AWS region where services are set up (get from Bhuvana) |
| `S3_BUCKET_NAME` | S3 bucket name for file uploads (get from Bhuvana) |
| `ADMIN_PASSWORD` | Password for the admin dashboard (get from Bhuvana) |

> **Warning:** Never share this file publicly or commit it to GitHub. It contains sensitive credentials.

---

## Step 4: Run on Your Desktop

Start the development server:

```bash
npm run dev
```

You should see output like:

```
  Next.js 16.x
  - Local: http://localhost:3000
```

Open your browser and visit these pages:

| URL | What it is |
|-----|-----------|
| http://localhost:3000 | Home page |
| http://localhost:3000/our-team | Our Team page |
| http://localhost:3000/request | Keynote request form |
| http://localhost:3000/admin | Admin dashboard (enter your password) |

> **Note:** If port 3000 is already in use, Next.js will automatically use port 3001. Check the terminal output for the correct URL.

To stop the server, press `Ctrl + C` in the terminal.

---

## Deploying to a Server (Make It Live on the Internet)

Below are three options. Pick the one that works best for you.

---

### Option A: Deploy to Vercel (Recommended - Easiest)

Vercel is made by the creators of Next.js. It's free for small projects and requires no server setup.

**Step 1: Create a Vercel account**

Go to https://vercel.com and sign in with your GitHub account.

**Step 2: Install the Vercel CLI**

Open your terminal and run:

```bash
npm install -g vercel
```

**Step 3: Deploy**

Make sure you're in the `aubria-next` folder, then run:

```bash
vercel
```

Follow the prompts:
- Log in when asked
- Accept the default project settings
- Wait for the deployment to finish

It will give you a live URL like `https://aubria-xxxx.vercel.app`.

**Step 4: Add your environment variables**

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** > **Environment Variables**
4. Add each variable one by one:

| Key | Value |
|-----|-------|
| `AWS_ACCESS_KEY_ID` | your access key |
| `AWS_SECRET_ACCESS_KEY` | your secret key |
| `AWS_REGION` | your region (e.g., `us-east-1`) |
| `S3_BUCKET_NAME` | your bucket name |
| `ADMIN_PASSWORD` | your admin password |

**Step 5: Redeploy**

After adding environment variables, redeploy to activate them:

```bash
vercel --prod
```

Your site is now live at the URL Vercel gave you.

---

### Option B: Deploy to AWS EC2 (Self-Hosted)

Use this if you want full control over the server.

**Step 1: Launch an EC2 instance**

1. Go to AWS Console > EC2 > **Launch Instance**
2. Choose **Ubuntu 24.04 LTS** as the operating system
3. Instance type: `t2.micro` (free tier eligible) or `t3.small` for production
4. Create a new key pair (download the `.pem` file - you'll need it to connect)
5. In **Network settings**, allow these ports:
   - SSH (port 22) - from your IP
   - HTTP (port 80) - from anywhere
   - HTTPS (port 443) - from anywhere
6. Click **Launch instance**

**Step 2: Connect to your server**

Open a terminal on your computer and run:

```bash
ssh -i your-key.pem ubuntu@your-server-ip
```

> Replace `your-key.pem` with the path to your downloaded key file, and `your-server-ip` with your EC2 instance's public IP address.

**Step 3: Install Node.js on the server**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify it installed:

```bash
node --version
npm --version
```

**Step 4: Upload your project to the server**

Open a **new terminal on your computer** (not the SSH session) and run:

```bash
scp -i your-key.pem -r aubria-next ubuntu@your-server-ip:~/aubria-next
```

**Step 5: Set up the project on the server**

Go back to your SSH session and run:

```bash
cd ~/aubria-next
npm install
```

**Step 6: Create the environment file on the server**

```bash
nano .env.local
```

Paste your environment variables (same as Step 3 in the local setup):

```
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket
ADMIN_PASSWORD=your-password
```

Save the file: press `Ctrl + X`, then `Y`, then `Enter`.

**Step 7: Build the project**

```bash
npm run build
```

This creates an optimized production version. It takes about 1-2 minutes.

**Step 8: Install PM2 (keeps the app running 24/7)**

```bash
sudo npm install -g pm2
pm2 start npm --name "aubria" -- start
pm2 save
pm2 startup
```

The last command (`pm2 startup`) will print a command that starts with `sudo`. Copy and run that command.

Now your app will automatically restart if the server reboots.

**Step 9: Set up Nginx (serves the app on port 80)**

Install Nginx:

```bash
sudo apt-get install -y nginx
```

Create the configuration file:

```bash
sudo nano /etc/nginx/sites-available/aubria
```

Paste this (replace `your-domain.com` with your domain or server IP):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save the file (`Ctrl + X`, `Y`, `Enter`), then enable it:

```bash
sudo ln -s /etc/nginx/sites-available/aubria /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Step 10 (Optional): Add HTTPS (SSL certificate)**

If you have a domain name pointed to your server:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Follow the prompts to get a free SSL certificate.

Your site is now live at `http://your-server-ip` (or `https://your-domain.com` with SSL).

---

### Option C: Deploy with Docker

Use this if you're familiar with Docker and want a portable deployment.

**Step 1: Create a Dockerfile**

Create a file called `Dockerfile` in the `aubria-next` folder:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

**Step 2: Build the Docker image**

```bash
docker build -t aubria .
```

**Step 3: Run the container**

```bash
docker run -p 3000:3000 --env-file .env.local aubria
```

The app will be available at `http://localhost:3000`.

---

## Pricing Structure

The request form calculates pricing automatically based on two inputs:

| Item | Cost |
|------|------|
| Video production | $250 per minute |
| 1 revision round | Free (included) |
| 2 revision rounds | +$250 |
| 3 revision rounds | +$500 |

**Example:** A 3-minute video with 2 revision rounds = (3 x $250) + $250 = **$1,000**

---

## Project Structure

```
aubria-next/
├── .env.local                    # Your credentials (DO NOT share)
├── public/                       # Images and static files
│   ├── Gemini_Generated_Image_*.png   # Hero image
│   ├── aubria_composite.png           # Team composite image
│   └── our-story/                     # Team member photos
├── src/
│   ├── lib/
│   │   └── aws.ts                # AWS DynamoDB + S3 helper functions
│   └── app/
│       ├── globals.css           # All styling
│       ├── layout.tsx            # Root HTML layout
│       ├── page.tsx              # Home page (/)
│       ├── our-team/
│       │   └── page.tsx          # Our Team page (/our-team)
│       ├── request/
│       │   └── page.tsx          # Request form (/request)
│       ├── admin/
│       │   └── page.tsx          # Admin dashboard (/admin)
│       └── api/
│           ├── requests/
│           │   ├── route.ts      # POST: create request, GET: list all
│           │   └── [id]/
│           │       └── route.ts  # GET: single request, PATCH: update status
│           ├── upload/
│           │   └── route.ts      # POST: upload file to S3
│           ├── download/
│           │   └── route.ts      # GET: download file from S3
│           └── admin/
│               └── login/
│                   └── route.ts  # POST: validate admin password
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm install` fails | Make sure Node.js 18+ is installed: `node --version` |
| `npm run dev` fails | Make sure you ran `npm install` first |
| Form submit says "resource not found" | Your `AWS_REGION` in `.env.local` doesn't match where the DynamoDB table was created. Ask Bhuvana for the correct region. |
| Files won't upload | Ask Bhuvana to verify the S3 bucket CORS configuration |
| Admin login doesn't work | Check that `ADMIN_PASSWORD` is set in `.env.local` and restart the dev server |
| Port 3000 in use | Next.js will auto-switch to 3001. Check terminal output for the URL |
| Styles look wrong on mobile | Hard-refresh your browser with `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac) |
| Changes to `.env.local` not working | Stop the server (`Ctrl + C`) and restart it (`npm run dev`) |

---

## Team

Built by the AUBRIA Student Team, CSSE, Samuel Ginn College of Engineering, Auburn University.

Faculty Advisor: Dr. Gerry Dozier
