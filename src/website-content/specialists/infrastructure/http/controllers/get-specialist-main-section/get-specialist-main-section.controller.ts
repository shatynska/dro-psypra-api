import { ApiErrorDecorator, Public } from '@common/decorators';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SectionNotFoundError } from '~/page-sections/application/errors/section-not-found.error';
import { NotFoundError } from '~/shared/application/errors/not-found.error';
import { Result } from '~/shared/core/result';
import { GetSpecialistMainSectionQuery } from '~/specialists/application/queries/get-specialist-main-section/get-specialist-main-section.query';
import { GetSpecialistMainSectionResult } from '~/specialists/application/queries/get-specialist-main-section/get-specialist-main-section.result';
import { GetSpecialistMainSectionResponse } from './get-specialist-main-section.response';

@Controller('pages')
@Public()
@ApiTags('pages')
export class GetSpecialistMainSectionController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiResponse({
    status: 200,
    type: GetSpecialistMainSectionResponse,
  })
  @ApiErrorDecorator(HttpStatus.NOT_FOUND, SectionNotFoundError.defaultMessage)
  @Get('specialists/:specialist/main')
  async execute(@Param('specialist') specialistAlias: string) {
    const section = await this.queryBus.execute<
      GetSpecialistMainSectionQuery,
      Result<NotFoundError, GetSpecialistMainSectionResult>
    >(new GetSpecialistMainSectionQuery(specialistAlias));

    if (section.isFailure()) {
      throw new NotFoundException(section.value.message);
    }

    return new GetSpecialistMainSectionResponse(section.value);
  }
}
