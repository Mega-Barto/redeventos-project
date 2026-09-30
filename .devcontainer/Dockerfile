FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

ENV TZ=America/Bogota

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends tzdata postgresql-client \
    && ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime \
    && echo "$TZ" > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun
RUN ln -s /usr/local/bin/bun /usr/local/bin/bunx

RUN arch="$(dpkg --print-architecture)" \
    && curl -fsSL "https://github.com/supabase/cli/releases/latest/download/supabase_linux_${arch}.tar.gz" \
    | tar -xz -C /usr/local/bin supabase

RUN mkdir -p /home/node/.bun/install/cache \
    && chown -R node:node /home/node/.bun
