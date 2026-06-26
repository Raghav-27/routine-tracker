# Study Grind Dashboard

An interactive daily timetable tracker covering **July 30, 2026 to January 1, 2027** (155 days). Built with React. Track your daily schedule, mark blocks complete, edit tasks, and watch your streak grow.

---

## Features

- **Calendar view** — all 155 days laid out month by month, colour-coded by status
- **Day detail panel** — click any date to open a full breakdown of the day's schedule
- **Block tracking** — tick off individual tasks or mark the whole day done at once
- **Streak counter** — counts consecutive fully-completed days automatically
- **Overall progress bar** — shows how far through the 155-day journey you are
- **Editable schedule** — rename tasks, change timings, swap categories, add or delete blocks
- **Clean white theme** — light, minimal UI with indigo accents and colour-coded categories

## How to Use

### Tracking a Day
1. Click any date on the calendar — a detail panel opens on the right
2. Click individual blocks to tick them off (strikethrough = done)
3. Or hit **Mark All Done** to complete the whole day in one click
4. A green dot appears on fully completed days in the calendar

### Calendar Day Colours
| Colour | Meaning |
|--------|---------|
| Green | All blocks complete |
| Yellow | Partially done |
| Light red | Missed (past date, not completed) |
| Purple | Today |
| White / grey | Upcoming |

### Editing the Schedule
1. Click **Edit Schedule** in the top-right header
2. Select any date to open the day panel (if not already open)
3. Click any block row — an inline editor appears with fields for:
   - **Icon** — any emoji or symbol
   - **Task name** — free text
   - **Time** — free text (e.g. `9:00-10:00 AM`)
   - **Category** — dropdown (Fitness, Class, DSA, Project, Meal, Break, Sleep)
4. Hit **Save** to apply, **Cancel** to discard, or the delete button to remove the block
5. Use **+ Add Task** at the bottom to insert a new block
6. Click **Done Editing** to return to tracking mode

> Schedule changes apply globally — all days share the same template.

---

## Tech Stack

- **React** (functional components, hooks)
- **No external dependencies** — pure React with inline styles
- **State** — all data lives in-memory via `useState`; refreshing the page resets progress

---

## Project Structure

```
timetable-dashboard.jsx   # Single-file React component — everything lives here
README.md                 # This file
```

---

## Customisation

### Changing the Date Range
At the top of `timetable-dashboard.jsx`, edit the two constants:
```js
const START = new Date(2026, 6, 30);  // months are 0-indexed: 6 = July
const END   = new Date(2027, 0, 1);   // 0 = January
```

### Adding a New Category
In the `CAT_COLORS` object, add an entry:
```js
const CAT_COLORS = {
  // ...existing categories...
  study: { light:"#F0FDF4", border:"#22C55E", text:"#15803D" },
};
```
It will automatically appear in the category dropdown when editing blocks.

---

*Built for the Jul 30 to Jan 1 grind. Stay consistent.*
