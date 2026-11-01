FROM node:26.13.0-alpine

RUN npm install --global --allow-scripts=pnpm pnpm@12.15.0
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

# Next.js embeds this public origin in the browser bundle.
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "start"]
