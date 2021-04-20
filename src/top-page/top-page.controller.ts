import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Patch,
    Post, UseGuards,
    UsePipes, ValidationPipe
} from "@nestjs/common";
import { TopPageModel } from "./top-page.model";
import { FindTopPageDto } from "./dto/find-top-page.dto";
import { CreateTopPageDto } from "./dto/create-top-page.dto";
import { TopPageService } from "./top-page.service";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { PAGE_NOT_FOUND } from "./top-page.constants";
import { JwtGuard } from "../auth/guards/jwt.guard";

@Controller('top-page')
export class TopPageController {
    constructor(private readonly topPageService: TopPageService) {}

    @UseGuards(JwtGuard)
    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {
        return this.topPageService.create(dto);
    }

    @UseGuards(JwtGuard)
    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const page = await this.topPageService.findById(id);
        if (!page) {
            throw new NotFoundException(PAGE_NOT_FOUND)
        }
        return page;
    }

    @Get('byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        const page = await this.topPageService.findByAlias(alias);
        if (!page) {
            throw new NotFoundException(PAGE_NOT_FOUND)
        }
        return page;
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        const page = await this.topPageService.deleteById(id);
        if (!page) {
            throw new NotFoundException(PAGE_NOT_FOUND)
        }
    }

    @UseGuards(JwtGuard)
    @Patch(':id')
    async patch(@Param('id') id: string, @Body() dto: TopPageModel) {
        const page = await this.topPageService.updateById(id, dto);
        if (!page) {
            throw new NotFoundException(PAGE_NOT_FOUND)
        }
        return page;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindTopPageDto) {
        return this.topPageService.findByCategory(dto.firstCategory);
    }
}
