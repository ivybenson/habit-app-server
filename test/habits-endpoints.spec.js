const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeUsersArray } = require("./users.fixtures");
const { makeHabitArray } = require("./chabits.fixtures");
const { makeProgressArray } = require("./progress.fixtures");

const HabitsService = require("../src/habits/habit-service");

describe(`Habits service object`, function () {
  let db;
  let authToken;

  before(`setup db`, () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  beforeEach("register and login", () => {
    let users = makeUsersArray();
    return supertest(app)
      .post("/api/users")
      .send(users[0])
      .then((res) => {
        return supertest(app)
          .post("/api/auth/login")
          .send(users[0])
          .then((res2) => {
            authToken = res2.body.authToken;
          });
      });
  });

  function makeAuthHeader(user) {
    const testUser = { password: user.password, username: user.username };
    return supertest(app)
      .post("/login")
      .set("Authorization", `Bearer ${authToken}`)
      .send(testUser);
  }

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE users, categories, todos RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE users, categories, todos RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/todos`, () => {
    context(`Given no todos,`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/todos")
          .set("Authorization", `Bearer ${authToken}`)
          .expect(200, []);
      });
    });

    context("Given there are todos in the db", () => {
      const testUsers = makeUsersArray();
      const testTodos = makeTodosArray();
      const testCats = makeCatArray();

      beforeEach("insert todos", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("categories").insert(testCats);
          })
          .then(() => {
            return db.into("todos").insert(testTodos);
          });
      });

      it("Responds with 200 and all of the todos", () => {
        return supertest(app)
          .get("/api/todos")
          .set("Authorization", `Bearer ${authToken}`)
          .expect(200, testTodos);
      });
    });
  });
  describe(`GET /api/todos/:id`, () => {
    context(`Given no todos`, () => {
      it(`responds with 404`, () => {
        const todoId = 123456;
        return supertest(app)
          .get(`/api/todos/${todoId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(404, { error: { message: `Todo doesn't exist` } });
      });
    });

    context("Given there are todos in the database", () => {
      const testUsers = makeUsersArray();
      const testTodos = makeTodosArray();
      const testCats = makeCatArray();

      beforeEach("insert todos", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("categories").insert(testCats);
          })
          .then(() => {
            return db.into("todos").insert(testTodos);
          });
      });
      it("responds with 200 and the specified todo", () => {
        const todoId = 2;
        const expectedTodo = testTodos[todoId - 1];
        return supertest(app)
          .get(`/api/todos/${todoId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(200, expectedTodo);
      });
    });
  });
  describe(`POST /api/todos`, () => {
    const testUsers = makeUsersArray();
    const testCats = makeCatArray();
    beforeEach("insert todo", () => {
      return db
        .into("users")
        .insert(testUsers)
        .then(() => {
          return db.into("categories").insert(testCats);
        });
    });
    it(`creates a todo, responding with 201 and the new todo`, () => {
      const newTodo = {
        id: 1,
        category: "productivity",
        title: "test new todo",
        description: "test todo description",
        checked: false,
        category_id: 1,
        user_id: 1,
      };
      return supertest(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newTodo)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).to.eql(newTodo.id);
          expect(res.body.category).to.eql(newTodo.category);
          expect(res.body.title).to.eql(newTodo.title);
          expect(res.body.description).to.eql(newTodo.description);
          expect(res.body.checked).to.eql(newTodo.checked);
          expect(res.body.category_id).to.eql(newTodo.category_id);
          expect(res.body.user_id).to.eql(newTodo.user_id);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/todos/${res.body.id}`);
          const expected = new Intl.DateTimeFormat("en-US").format(new Date());
          const actual = new Intl.DateTimeFormat("en-US").format(
            new Date(res.body.start_date)
          );
          expect(actual).to.eql(expected);
        })
        .then((res) =>
          supertest(app)
            .get(`/api/todos/${res.body.id}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(res.body)
        );
    });
    const requiredFields = [
      "category",
      "title",
      "description",
      "checked",
      "category_id",
      "user_id",
    ];

    requiredFields.forEach((field) => {
      const newTodo = {
        category: "productivity",
        title: "Read LOTR trilogy",
        description: "Read first book by NYE",
        checked: false,
        category_id: 1,
        user_id: 1,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newTodo[field];

        return supertest(app)
          .post("/api/todos")
          .set("Authorization", `Bearer ${authToken}`)
          .send(newTodo)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });
  describe(`DELETE /api/todos/:id`, () => {
    context(`Given no todos`, () => {
      it(`responds with 404`, () => {
        const todoId = 123456;
        return supertest(app)
          .delete(`/api/todos/${todoId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(404, { error: { message: `Todo doesn't exist` } });
      });
    });

    context("Given there are todos in the database", () => {
      const testUsers = makeUsersArray();
      const testCats = makeCatArray();
      const testTodos = makeTodosArray();

      beforeEach("insert todo", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("categories").insert(testCats);
          })
          .then(() => {
            return db.into("todos").insert(testTodos);
          });
      });

      it("responds with 204 and removes the todo", () => {
        const idToRemove = 2;
        const expectedTodos = testTodos.filter(
          (todo) => todo.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/todos/${idToRemove}`)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(204)
          .then((res) => {
            supertest(app).get(`/api/todos`).expect(expectedTodos);
          });
      });
    });
  });
  describe(`PATCH /api/todos/:id`, () => {
    context(`Given no todos`, () => {
      it(`responds with 404`, () => {
        const testId = 123456;
        return supertest(app)
          .delete(`/api/todos/${testId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(404, { error: { message: `Todo doesn't exist` } });
      });
    });

    context("Given there are todos in the database", () => {
      const testUsers = makeUsersArray();
      const testCats = makeCatArray();
      const testTodos = makeTodosArray();

      beforeEach("insert todos", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("categories").insert(testCats);
          })
          .then(() => {
            return db.into("todos").insert(testTodos);
          });
      });

      it("responds with 204 and updates the todo", () => {
        const idToUpdate = 2;
        const updateTodo = {
          category: "productivity",
          title: "Read LOTR trilogy",
          description: "Read first book by NYE",
          start_date: "2020-01-03T00:00:00.000Z",
          checked: false,
          category_id: 1,
          user_id: 1,
        };
        const expectedTodo = {
          ...testTodos[idToUpdate - 1],
          ...updateTodo,
        };
        return supertest(app)
          .patch(`/api/todos/${idToUpdate}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(updateTodo)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/todos/${idToUpdate}`)
              .set("Authorization", `Bearer ${authToken}`)
              .expect(expectedTodo)
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/todos/${idToUpdate}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Request body must contain either 'description' or 'title'`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateTodo = {
          title: "updated todo title",
        };
        const expectedTodo = {
          ...testTodos[idToUpdate - 1],
          ...updateTodo,
        };

        return supertest(app)
          .patch(`/api/todos/${idToUpdate}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({
            ...updateTodo,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/todos/${idToUpdate}`)
              .set("Authorization", `Bearer ${authToken}`)
              .expect(expectedTodo)
          );
      });
    });
  });
  describe(`PUT /api/todos/:id`, () => {
    context(`Given no todos`, () => {
      it(`responds with 404`, () => {
        const testId = 123456;
        return supertest(app)
          .delete(`/api/todos/${testId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(404, { error: { message: `Todo doesn't exist` } });
      });
    });
    context("Given there are todos in the database", () => {
      const testUsers = makeUsersArray();
      const testCats = makeCatArray();
      const testTodos = makeTodosArray();

      beforeEach("insert todos", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("categories").insert(testCats);
          })
          .then(() => {
            return db.into("todos").insert(testTodos);
          });
      });
      it("responds with 204 and updates the todo", () => {
        const idToUpdate = 2;
        const updateTodo = {
          id: 2,
          checked: false,
        };
        const expectedTodo = {
          ...testTodos[idToUpdate - 1],
          ...updateTodo,
        };
        return supertest(app)
          .patch(`/api/todos/${idToUpdate}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(updateTodo)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/todos/${idToUpdate}`)
              .set("Authorization", `Bearer ${authToken}`)
              .expect(expectedTodo)
          );
      });
      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/todos/${idToUpdate}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Request body must contain either 'description' or 'title'`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateTodo = {
          checked: true,
        };
        const expectedTodo = {
          ...testTodos[idToUpdate - 1],
          ...updateTodo,
        };

        return supertest(app)
          .patch(`/api/todos/${idToUpdate}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({
            ...updateTodo,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/todos/${idToUpdate}`)
              .set("Authorization", `Bearer ${authToken}`)
              .expect(expectedTodo)
          );
      });
    });
  });
});
