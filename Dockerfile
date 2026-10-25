# Dockerfile.production
FROM node:26.12.1-alpine

# Install pnpm explicitly: Node 26 no longer bundles Corepack.
RUN npm install --global --allow-scripts=pnpm pnpm@12.15.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, pnpm-lock.yaml and pnpm-workspace.yaml
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Public URL is bundled by Next.js; supply the deployed origin when building.
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build the Next.js application
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["pnpm", "start"]
