import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app.js";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";

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

test("profile password changes require the current password and replace login credentials", async () => {
  const email = "password-change@test.local";
  const oldPassword = "OriginalPass123!";
  const newPassword = "ReplacementPass456!";
  const registration = await request(app).post("/api/auth/register").send({
    fullName: "Password Test Student", email, password: oldPassword,
  });
  assert.equal(registration.status, 201);
  const authorization = `Bearer ${registration.body.token}`;

  const missingCurrent = await request(app).put("/api/users/me")
    .set("Authorization", authorization).send({ newPassword });
  assert.equal(missingCurrent.status, 400);

  const wrongCurrent = await request(app).put("/api/users/me")
    .set("Authorization", authorization)
    .send({ currentPassword: "IncorrectPass123!", newPassword });
  assert.equal(wrongCurrent.status, 401);

  const tooShort = await request(app).put("/api/users/me")
    .set("Authorization", authorization)
    .send({ currentPassword: oldPassword, newPassword: "short" });
  assert.equal(tooShort.status, 400);

  const unchangedLogin = await request(app).post("/api/auth/login")
    .send({ email, password: oldPassword });
  assert.equal(unchangedLogin.status, 200);

  const changed = await request(app).put("/api/users/me")
    .set("Authorization", authorization)
    .send({ currentPassword: oldPassword, newPassword });
  assert.equal(changed.status, 200);
  assert.equal(changed.body.user.passwordHash, undefined);
  assert.equal(changed.body.user.password, undefined);

  const oldLogin = await request(app).post("/api/auth/login")
    .send({ email, password: oldPassword });
  assert.equal(oldLogin.status, 401);
  const newLogin = await request(app).post("/api/auth/login")
    .send({ email, password: newPassword });
  assert.equal(newLogin.status, 200);
  assert.equal(newLogin.body.user.passwordHash, undefined);
});

test("account deletion removes owned events, preserves other events, and rejects the deleted user's token", async () => {
  const register = (email) => request(app).post("/api/auth/register").send({
    fullName: "Deletion Test Student", email, password: "DeletionPass123!",
  });
  const owner = await register("delete-owner@test.local");
  const survivor = await register("surviving-owner@test.local");
  assert.equal(owner.status, 201);
  assert.equal(survivor.status, 201);
  const payload = {
    title: "Account Deletion Workshop", description: "Verify owner-specific event cleanup.",
    category: "Workshop", date: "2026-12-10", startTime: "13:30", location: "Room B204",
  };
  const createEvent = (token) => request(app).post("/api/events")
    .set("Authorization", `Bearer ${token}`).send(payload);
  const owned = await createEvent(owner.body.token);
  const preserved = await createEvent(survivor.body.token);
  assert.equal(owned.status, 201);
  assert.equal(preserved.status, 201);

  const deletion = await request(app).delete("/api/users/me")
    .set("Authorization", `Bearer ${owner.body.token}`);
  assert.equal(deletion.status, 200);
  assert.equal(await User.findById(owner.body.user._id), null);
  assert.equal(await Event.findById(owned.body.event._id), null);
  assert.ok(await Event.findById(preserved.body.event._id));

  const staleToken = await request(app).get("/api/users/me")
    .set("Authorization", `Bearer ${owner.body.token}`);
  assert.equal(staleToken.status, 401);
  const survivingEvent = await request(app).get(`/api/events/${preserved.body.event._id}`)
    .set("Authorization", `Bearer ${survivor.body.token}`);
  assert.equal(survivingEvent.status, 200);
});
