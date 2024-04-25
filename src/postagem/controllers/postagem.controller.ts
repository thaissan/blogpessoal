import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { PostagemService } from "../services/postagem.service";
import { Postagem } from "../entities/postagem.entity";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("/postagens")
export class PostagemController{

    constructor(private readonly postagemService: PostagemService) {}

    @Get()
    @HttpCode(HttpStatus.OK) //HTTP STATUS 200 OKK
    findAll(): Promise<Postagem[]>{
        return  this.postagemService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK) //HTTP STATUS 200 OKK
    findById(@Param('id', ParseIntPipe) id: number): Promise<Postagem>{
        return  this.postagemService.findById(id);
    }

    @Get('/titulo/:titulo')
    @HttpCode(HttpStatus.OK) //HTTP STATUS 200 OKK
    findByTitulo(@Param('titulo') titulo: string): Promise<Postagem[]>{
        return this.postagemService.findByTitulo(titulo);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() postagem: Postagem): Promise<Postagem> {
        return this.postagemService.create(postagem);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() postagem: Postagem): Promise<Postagem> {
        return this.postagemService.create(postagem);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.postagemService.delete(id);
    }
    
}


