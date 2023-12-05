import { ApiProperty } from '@nestjs/swagger';

export class ExpenseDto {
  @ApiProperty({
    example: 'c0317617-9f36-489e-ba72-d462777987e9',
  })
  id: string;
  @ApiProperty({
    example: 380,
    type: 'integer',
    format: 'int32',
  })
  amount: number;
  @ApiProperty({
    example: 'піца',
    nullable: true,
  })
  details: string | null;
  @ApiProperty({
    example: 2022 - 11 - 27,
    type: 'string',
    format: 'date-time',
  })
  reportingDate: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
