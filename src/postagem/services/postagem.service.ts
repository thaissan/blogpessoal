import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Postagem } from "../entities/postagem.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { TemaService } from "../../tema/services/tema.service";

@Injectable()
export class PostagemService{
    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        private TemaService: TemaService
    ){}

    async findAll(): Promise<Postagem[]>{
        return await this.postagemRepository.find({
            relations:{
                tema: true,
                usuario: true
            }
        });
        //select * from tb_postagens;
    }

    async findById(id: number): Promise<Postagem> {
        let postagem = await this.postagemRepository.findOne({
            where:{
                id
            },
            relations:{
                tema: true,
                usuario: true
            }
        });

        //  checar se a postagem não foi encontrada
        if(!postagem)
            throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);

        //retornar a postagem, caso ele exista
        return postagem;

        //select *from tb_postagens where id = ?:
    }

    async findByTitulo(titulo: string): Promise<Postagem[]>{
        return await this.postagemRepository.find({
            where:{
                titulo: ILike(`%${titulo}%`)
            },
            relations:{
                tema: true,
                usuario: true
            }
        })
        // select * fro tb_postagens where titulo like "%titulo%";
    }

    async create(postagem: Postagem): Promise<Postagem> {

        if(postagem.tema){

            let tema = await this.TemaService.findById(postagem.tema.id)

            if(!tema)
                throw new HttpException("Tema não encontrado!", HttpStatus.NOT_FOUND)

                return await this.postagemRepository.save(postagem);
        }
        return await this.postagemRepository.save(postagem)
    }

    //UPDATE tb_postagens SET titulo = "titulo", texto = "texto", data = CURRENT_TIMESTAMP() WHERE id = id;
    async update(postagem: Postagem): Promise<Postagem> {
         
        let buscaPostagem: Postagem = await this.findById(postagem.id);

        if(!buscaPostagem || !postagem.id)
            throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);

         if(postagem.tema){

            let tema = await this.TemaService.findById(postagem.tema.id)

            if(!tema)
                throw new HttpException("Tema não encontrado!", HttpStatus.NOT_FOUND)

                return await this.postagemRepository.save(postagem);
        }
        return await this.postagemRepository.save(postagem)
    }

    async delete(id: number): Promise<DeleteResult> {

        let buscaPostagem = await this.findById(id);
           
        if(!buscaPostagem)
            throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);

        return await this.postagemRepository.delete(id);

    }


}