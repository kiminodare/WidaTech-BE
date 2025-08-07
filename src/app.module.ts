import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [SharedModule, FeaturesModule],
})
export class AppModule {}
