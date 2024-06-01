import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { COMMANDS } from './application/commands';
import { QUERIES } from './application/queries';
import { READ_REPOSITORY_TOKEN } from './application/repositories/read.repository';
import { WRITE_REPOSITORY_TOKEN } from './application/repositories/write.repository';
import { CONTROLLERS } from './infrastructure/http/controllers';
import { PrismaReadRepository } from './infrastructure/persistence/prisma/prisma.read.repository';
import { PrismaWriteRepository } from './infrastructure/persistence/prisma/prisma.write.repository';

@Module({
  imports: [CqrsModule],
  controllers: [...CONTROLLERS],
  providers: [
    ...QUERIES,
    ...COMMANDS,
    {
      provide: READ_REPOSITORY_TOKEN,
      useClass: PrismaReadRepository,
    },
    {
      provide: WRITE_REPOSITORY_TOKEN,
      useClass: PrismaWriteRepository,
    },
  ],
})
export class CoreModule {}
