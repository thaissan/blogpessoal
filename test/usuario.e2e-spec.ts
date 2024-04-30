import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token: any;
  let usuarioId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities:[__dirname + "./../src/**/entities/*.entity.ts"], //diretorio do arq.
          synchronize: true,
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("01' - Deve Cadastrar um novo usuario", async () => {
    const resposta = await request(app.getHttpServer())
    .post('/usuarios/cadastrar')
    .send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: ' ',
    })
    expect(201);

    usuarioId = resposta.body.id;

    });

    it('02 - Não Deve Cadastrar um usuario duplicado', async () => {
      await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ' ',
      });
      expect(400)
      
 });
    it('02 - Deve Autenticar Usuario (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      });
    expect(200)

    token = resposta.body.token;

      });

    it('03 - Deve Autenticar Usuario (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      });
    expect(200)

    token = resposta.body.token;

    console.log("Token: " + token)

  });

  it('04 - Deve Listar todos os Usuários', async () => {
    return request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  });

  it('05 - Deve Atualizar um Usuário', async () => {
    return request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Thais',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ' '
        
      })
      .expect(200)
      .then(resposta => {
        expect('Thais').toEqual(resposta.body.nome);
      });

  });

  it('06 - Deve procurar por ID', async () => {
    return request(app.getHttpServer())
    .get(`/usuarios/${usuarioId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  });

  });
