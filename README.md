# Habit App - API

Building Habits one step at a time.

Live app: (https://habit-app-omega.vercel.app/)

## Intro

HabitNow is a tool that users can use to build habits. There is no limit to the number of goals that they can add, each with an individual calendar. Users add a habit with the number of times per week they want to complete the habit and note about it. The habit is then added to the user's dashboard. Users track days by tapping the calendar of the day they have completed their habit. This is what establishes the routine of the habit.

## Technologies

- Node and Express
  - Authentication via JWT
  - RESTful API
- Testing
  - Supertest (integration)
    -Mocha and Chai (unit)
- Database
  - Postgres SQL
  - Knex.js

## Deployed with Heroku

## API Endpoints

### Users Router

```

-/api/users

-- GET - gets all users

-- POST - creates a new user
```

### Habits Router

```

-/api/habits

-- GET - gets all habits by user

-- DELETE - creates a new habit
```

### Habits/:id Router (not in use for current version)

```

-/api/habits/:habit_id

-- GET - gets habit by habit_id

-- DELETE - deletes habit by id

-- PATCH - updates habit by id
```

### Progress Router

```
-/api/progress

-- GET - gets progress by habit and date

-- POST - creates a new day of progress on the calendar of the individual habit also deletes progress by habit and date if date matches with empty post
```

### Progress/:byhabits Router

```

-/api/progress/:byhabits

-- GET - gets progess by habit
```
