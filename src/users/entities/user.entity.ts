import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Card } from './card.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: false })
  password: string;


  @Column({ nullable: true })
  strigaUserId?: string;

  @Column({ type: 'json', nullable: true })
  mobile?: {
    countryCode: string;
    number: string;
  };

  @Column({ type: 'json', nullable: true })
  KYC?: {
    emailVerified: boolean;
    mobileVerified: boolean;
    currentTier: number;
    status: string;
    tier0?: {
      eligible: boolean;
      status: string;
    };
    tier1?: {
      eligible: boolean;
      status: string;
      inboundLimitConsumed?: {
        all: string;
        va: string;
      };
      inboundLimitAllowed?: {
        all: string;
        va: string;
      };
    };
  };

  @Column({
    unique: true,
    nullable: false,
    transformer: {
      to: (value: string) => value?.toLowerCase(),
      from: (value: string) => value,
    },
  })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];
}
