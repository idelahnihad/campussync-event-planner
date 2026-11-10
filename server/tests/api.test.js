import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app.js";
import { Event } from "../models/Event.js";

let mongo;
let ownerToken;
let otherToken;
let eventId;

before(async () => {
  process.env.JWT_SECRET = "campussync-test-secret";
  process.env.NODE_ENV = "test";
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

after(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

test("authentication and user CRUD", async () => {
  const owner = {
    fullName: "Demo Organizer",
    email: "owner@test.local",
    password: "OwnerPass123!",
  };

  const registration = await request(app).post("/api/auth/register").send(owner);
  assert.equal(registration.status, 201);
  assert.ok(registration.body.token);
  ownerToken = registration.body.token;

  const duplicate = await request(app).post("/api/auth/register").send(owner);
  assert.equal(duplicate.status, 409);

  const wrongLogin = await request(app).post("/api/auth/login").send({
    email: owner.email,
    password: "wrong-password",
  });
  assert.equal(wrongLogin.status, 401);

  const login = await request(app).post("/api/auth/login").send({
    email: owner.email,
    password: owner.password,
  });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.fullName, owner.fullName);

  const profile = await request(app)
    .get("/api/users/me")
    .set("Authorization", `Bearer ${ownerToken}`);
  assert.equal(profile.status, 200);
  assert.equal(profile.body.user.email, owner.email);
  assert.equal(profile.body.user.passwordHash, undefined);

  const update = await request(app)
    .put("/api/users/me")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({ fullName: "Updated Organizer" });
  assert.equal(update.status, 200);
  assert.equal(update.body.user.fullName, "Updated Organizer");

  const otherRegistration = await request(app).post("/api/auth/register").send({
    fullName: "Other Student",
    email: "other@test.local",
    password: "OtherPass123!",
  });
  otherToken = otherRegistration.body.token;

  const temporary = await request(app).post("/api/auth/register").send({
    fullName: "Temporary User",
    email: "temporary@test.local",
    password: "Temporary123!",
  });
  const deletion = await request(app)
    .delete("/api/users/me")
    .set("Authorization", `Bearer ${temporary.body.token}`);
  assert.equal(deletion.status, 200);
});

test("event CRUD, token protection, and ownership authorization", async () => {
  const noToken = await request(app).get("/api/events");
  assert.equal(noToken.status, 401);

  const payload = {
    title: "API Testing Workshop",
    description: "Learn how to test protected Express endpoints with Postman.",
    category: "Workshop",
    date: "2026-12-10",
    startTime: "13:30",
    location: "Room B204",
  };

  const created = await request(app)
    .post("/api/events")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send(payload);
  assert.equal(created.status, 201);
  eventId = created.body.event._id;

  const invalid = await request(app)
    .post("/api/events")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({ title: "No" });
  assert.equal(invalid.status, 400);

  const listed = await request(app)
    .get("/api/events")
    .set("Authorization", `Bearer ${ownerToken}`);
  assert.equal(listed.status, 200);
  assert.equal(listed.body.count, 1);

  const readOne = await request(app)
    .get(`/api/events/${eventId}`)
    .set("Authorization", `Bearer ${ownerToken}`);
  assert.equal(readOne.status, 200);
  assert.equal(readOne.body.event.location, payload.location);

  const forbiddenUpdate = await request(app)
    .put(`/api/events/${eventId}`)
    .set("Authorization", `Bearer ${otherToken}`)
    .send({ location: "Not Allowed" });
  assert.equal(forbiddenUpdate.status, 403);

  const updated = await request(app)
    .put(`/api/events/${eventId}`)
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({ location: "Room C310", startTime: "15:00" });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.event.location, "Room C310");

  const forbiddenDelete = await request(app)
    .delete(`/api/events/${eventId}`)
    .set("Authorization", `Bearer ${otherToken}`);
  assert.equal(forbiddenDelete.status, 403);

  const deleted = await request(app)
    .delete(`/api/events/${eventId}`)
    .set("Authorization", `Bearer ${ownerToken}`);
  assert.equal(deleted.status, 200);
  assert.equal(await Event.countDocuments(), 0);

  const readDeleted = await request(app)
    .get(`/api/events/${eventId}`)
    .set("Authorization", `Bearer ${ownerToken}`);
  assert.equal(readDeleted.status, 404);
});
