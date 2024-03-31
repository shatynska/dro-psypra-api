import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DimensionsModule } from '~/dimensions/dimensions.module';
import { QUERIES } from './application/queries';
import { READ_REPOSITORY_TOKEN } from './application/read.repository';
import { CONTROLLERS } from './infrastructure/http/controllers';
import { PrismaReadRepository } from './infrastructure/persistence/prisma/read.repository';

@Module({
  imports: [CqrsModule, DimensionsModule],
  controllers: [...CONTROLLERS],
  providers: [
    ...QUERIES,
    {
      provide: READ_REPOSITORY_TOKEN,
      useClass: PrismaReadRepository,
    },
  ],
  exports: [...QUERIES],
})
export class SpecialistsModule {}
