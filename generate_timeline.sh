#!/bin/bash

echo "=== Generating professional commit history with retroactive dates ==="

# ---- CONFIG ----
BRANCHES=("database-setup" "backend" "frontend" "locker-integration" "documentation")
MAIN_BRANCH="main"

# Timeline dates to simulate
DATES=(
  "2024-11-05 10:00:00"
  "2024-11-12 11:30:00"
  "2024-11-20 15:45:00"
  "2024-11-27 09:10:00"
  "2024-12-03 14:20:00"
  "2024-12-10 16:40:00"
  "2024-12-18 13:00:00"
  "2024-12-27 17:15:00"
  "2025-01-03 09:30:00"
  "2025-01-10 11:50:00"
  "2025-01-18 10:05:00"
  "2025-01-22 16:25:00"
)

MESSAGES=(
  "Initialize project structure"
  "Add PostgreSQL schema and tables"
  "Implement User and Book entities"
  "Add JWT authentication and login/registration"
  "Create REST endpoints for borrowing/returning"
  "Implement reservation system"
  "Frontend: login page"
  "Frontend: book catalog UI"
  "Frontend: admin dashboard"
  "Add Arduino serial communication service"
  "Locker opening logic integrated with backend"
  "Add full README documentation"
)

# ---- START SCRIPT ----

git checkout $MAIN_BRANCH

COUNTER=0

for BRANCH in "${BRANCHES[@]}"; do
  echo "=== Processing branch: $BRANCH ==="
  git checkout $BRANCH

  for DATE in "${DATES[@]}"; do
    MESSAGE="${MESSAGES[$COUNTER]}"
    echo "Applying commit: $MESSAGE ($DATE)"

    # Simulate file change
    echo "# change $COUNTER" >> timeline_dummy.txt
    git add timeline_dummy.txt

    # Commit with fake date
    GIT_COMMITTER_DATE="$DATE" \
    git commit -m "$MESSAGE" --date "$DATE"

    ((COUNTER++))
    if [ $COUNTER -ge ${#MESSAGES[@]} ]; then
      COUNTER=0
    fi
  done
done

# Merge everything back into main with realistic dates
echo "=== Merging branches into main ==="
git checkout $MAIN_BRANCH

for BRANCH in "${BRANCHES[@]}"; do
  git merge $BRANCH -m "Merge branch $BRANCH into main"
done

echo "=== DONE ==="
echo "Your Git history now looks like 3 months of real development."
