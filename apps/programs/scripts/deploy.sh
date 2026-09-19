#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════════════
# Open-XP — Anchor Program Deploy Script (Devnet)
# ═══════════════════════════════════════════════════════════════

CLUSTER="devnet"
PROGRAM_DIR="$(dirname "$0")/.."

echo "════════════════════════════════════════════════"
echo "  Open-XP — Deploying Anchor Program to $CLUSTER"
echo "════════════════════════════════════════════════"

# Check prerequisites
command -v anchor >/dev/null 2>&1 || { echo "❌ Anchor CLI not found. Install: https://www.anchor-lang.com/docs/installation"; exit 1; }
command -v solana >/dev/null 2>&1 || { echo "❌ Solana CLI not found. Install: https://docs.solanalabs.com/cli/install"; exit 1; }

# Verify cluster
CURRENT_CLUSTER=$(solana config get | grep "RPC URL" | awk '{print $NF}')
echo "📡 Current RPC: $CURRENT_CLUSTER"

# Build
echo ""
echo "🔨 Building Anchor program..."
cd "$PROGRAM_DIR"
anchor build

# Get program ID
PROGRAM_ID=$(solana-keygen pubkey target/deploy/open_xp-keypair.json 2>/dev/null || echo "")
if [ -z "$PROGRAM_ID" ]; then
  echo "⚠️  No keypair found. Generating new program keypair..."
  solana-keygen new --no-bip39-passphrase -o target/deploy/open_xp-keypair.json
  PROGRAM_ID=$(solana-keygen pubkey target/deploy/open_xp-keypair.json)
fi

echo "📋 Program ID: $PROGRAM_ID"

# Update program ID in source
echo ""
echo "📝 Updating program ID in lib.rs and Anchor.toml..."
sed -i "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" programs/open-xp/src/lib.rs
sed -i "s/open_xp = \".*\"/open_xp = \"$PROGRAM_ID\"/" Anchor.toml

# Rebuild with updated ID
echo ""
echo "🔨 Rebuilding with updated program ID..."
anchor build

# Check balance
BALANCE=$(solana balance | awk '{print $1}')
echo ""
echo "💰 Wallet balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
  echo "⚠️  Low balance. Requesting airdrop..."
  solana airdrop 2 --url $CLUSTER || echo "Airdrop failed — you may need to fund the wallet manually."
fi

# Deploy
echo ""
echo "🚀 Deploying to $CLUSTER..."
anchor deploy --provider.cluster $CLUSTER

echo ""
echo "════════════════════════════════════════════════"
echo "  ✅ Deployment Complete!"
echo "  Program ID: $PROGRAM_ID"
echo "  Cluster: $CLUSTER"
echo "════════════════════════════════════════════════"

# Export IDL
echo ""
echo "📦 Exporting IDL..."
cp target/idl/open_xp.json ../../packages/shared/src/idl/ 2>/dev/null || echo "⚠️  IDL file not found — run anchor build first."

echo "🏁 Done!"
