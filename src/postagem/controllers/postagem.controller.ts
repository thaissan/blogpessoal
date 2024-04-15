import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { PostagemService } from "../services/postagem.service";
import { Postagem } from "../entities/postagem.entity";

@Controller("/postagens")
export class PostagemController{

    constructor(private readonly postagemService: PostagemService) {}

    @Get()
    @HttpCode(HttpStatus.OK) //HTTP STATUS 200 OKK
    findAll(): Promise<Postagem[]>{
        return  this.postagemService.findAll();
    }

    
}