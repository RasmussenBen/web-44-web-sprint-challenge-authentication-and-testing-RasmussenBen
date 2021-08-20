const server = require("./server.js")
const db = require("../data/dbConfig.js")
const supertest = require("supertest")

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe("user tests", () => {
  it("new user registers", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUser', password: 'testPassword' })

    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe("testUser")
  })

  it("checks that the user already exists before logging in", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUser', password: 'testPassword' })

    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('testUser')

    const res3 = await supertest(server).post("/api/auth/login").send({ username: 'userNotInDB', password: 'testPassword' })

    expect(res3.statusCode).toBe(401)
    expect(res3.body.message).toBe('invalid credentials')
  })
})