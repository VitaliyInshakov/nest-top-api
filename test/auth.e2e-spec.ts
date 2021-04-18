import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { disconnect } from "mongoose";

import { AppModule } from "../src/app.module";
import { AuthDto } from "../src/auth/dto/auth.dto";

const loginDto: AuthDto = {
    login: "test@test.com",
    password: "1234",
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
        done();
      });
  });

    it('/auth/login (POST) - fail', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, password: "1" })
            .expect(400, {
                statusCode: 401,
                message: "Wrong password",
                error: "Unauthorized",
            });
    });

    it('/auth/login (POST) - fail', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, login: "not@test.com" })
            .expect(400, {
                statusCode: 401,
                message: "User not found",
                error: "Unauthorized",
            });
    });

  afterAll(() => {
    disconnect();
  });
});
