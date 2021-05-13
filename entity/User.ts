import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { DateTime } from 'luxon';
import { UserRole } from '../modules/abilities';
import { SqlDateTransformer } from '../modules/helpers';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    Id: number

    @Column()
    Name: string

    @Column()
    Email: string

    @Column({
      type: 'datetime',
      transformer: SqlDateTransformer,
    })
    RegDate: DateTime

    @Column({
      type: 'datetime',
      transformer: SqlDateTransformer,
    })
    LastLogIn: DateTime

    @Column({
      type: 'enum',
      enum: UserRole,
    })
    UserRole: UserRole

    @Column()
    PasswordHash: string
}
