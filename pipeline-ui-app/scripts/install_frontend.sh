#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIN_NODE_MAJOR=18
NODE_VERSION=24
NVM_VERSION="v0.40.4"
NVM_DIR="${HOME}/.nvm"

log() {
  printf '\n[%s] %s\n' "pipeline-ui-app" "$1"
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

node_major_version() {
  node -p "process.versions.node.split('.')[0]"
}

load_nvm() {
  if [ -s "${NVM_DIR}/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "${NVM_DIR}/nvm.sh"
    return 0
  fi

  return 1
}

ensure_nvm() {
  if load_nvm; then
    log "Found nvm in ${NVM_DIR}."
    return
  fi

  if ! has_command curl; then
    printf '[pipeline-ui-app] curl is required to install nvm.\n' >&2
    exit 1
  fi

  log "Installing nvm ${NVM_VERSION}..."
  curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash

  if ! load_nvm; then
    printf '[pipeline-ui-app] nvm install completed, but nvm could not be loaded.\n' >&2
    exit 1
  fi
}

install_node_with_nvm() {
  ensure_nvm
  log "Installing Node.js ${NODE_VERSION} with nvm..."
  nvm install "${NODE_VERSION}"
  nvm use "${NODE_VERSION}"
  hash -r
}

ensure_node() {
  if has_command node && has_command npm; then
    local major
    major="$(node_major_version)"
    if [ "$major" -ge "$MIN_NODE_MAJOR" ]; then
      log "Found Node.js $(node -v) and npm $(npm -v)."
      return
    fi

    log "Found Node.js $(node -v), but version ${MIN_NODE_MAJOR}+ is recommended."
  else
    log "Node.js/npm not found."
  fi

  case "$(uname -s)" in
    Darwin|Linux)
      install_node_with_nvm
      ;;
    *)
      printf '[pipeline-ui-app] Unsupported OS: %s\n' "$(uname -s)" >&2
      exit 1
      ;;
  esac

  if ! has_command node || ! has_command npm; then
    printf '[pipeline-ui-app] Node.js/npm install did not complete successfully.\n' >&2
    exit 1
  fi

  log "Using Node.js $(node -v) and npm $(npm -v)."
}

main() {
  ensure_node
  log "Installing frontend dependencies in ${ROOT_DIR}..."
  cd "${ROOT_DIR}"
  npm install
  log "Done. Start the app with: npm run dev"
}

main "$@"
