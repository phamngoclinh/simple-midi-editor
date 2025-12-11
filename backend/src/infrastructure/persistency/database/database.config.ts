import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: () => ({
        type: 'sqlite',
        database: 'db/midi-editor.sqlite',
        entities: [path.join(__dirname, '..', 'entities', '*.entity.{ts,js}')],
        synchronize: true,
      }),
      inject: [],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseConfigModule { }
