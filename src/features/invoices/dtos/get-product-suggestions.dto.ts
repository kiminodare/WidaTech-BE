import { IsOptional, IsString } from 'class-validator';

export class GetProductSuggestionsDto {
  @IsOptional()
  @IsString()
  q?: string;
}
