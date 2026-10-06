FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

ENV TZ=America/Bogota
ARG SUPABASE_VERSION=2.119.0

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends tzdata postgresql-client \
    && ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime \
    && echo "$TZ" > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

COPY --from=oven/bun:1.2.17 /usr/local/bin/bun /usr/local/bin/bun
RUN ln -sf /usr/local/bin/bun /usr/local/bin/bunx

RUN arch="$(dpkg --print-architecture)" \
    && curl -fsSL "https://github.com/supabase/cli/releases/download/v${SUPABASE_VERSION}/supabase_linux_${arch}.tar.gz" \
    | tar -xz -C /usr/local/bin supabase \
    && chmod 755 /usr/local/bin/supabase

RUN mkdir -p /home/node/.bun/install/cache \
    && chown -R node:node /home/node/.bun
