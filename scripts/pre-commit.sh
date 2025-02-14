#!/bin/bash

# Define the required pattern
EXPECTED_PATTERN="ANDRES MORENO"

# Get list of staged files
FILES=$(git diff --cached --name-only --diff-filter=ACM)

echo Im here
echo $FILES
# Loop through each file and check if it starts with the required pattern
for file in $FILES; do
  # Skip binary files
  if [[ $(file --mime-type -b "$file") == text/* ]]; then
    # Read the first line
    FIRST_LINE=$(head -n 1 "$file")

    # Check if it matches the expected pattern
    if [[ "$FIRST_LINE" != "$EXPECTED_PATTERN"* ]]; then
      echo "❌ ERROR: The file '$file' must start with '$EXPECTED_PATTERN'."
      exit 1
    fi
  fi
done

echo "✅ All files meet the required pattern."
exit 0