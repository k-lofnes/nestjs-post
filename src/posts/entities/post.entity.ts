import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("posts")
export class Post {
  @ApiProperty({ description: "The unique identifier of the post" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "The title of the post" })
  @Column()
  title: string;

  @ApiProperty({ description: "The content of the post" })
  @Column("text")
  content: string;

  @ApiProperty({ description: "The author of the post" })
  @Column()
  author: string;

  @ApiProperty({ description: "When the post was created" })
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty({ description: "When the post was last updated" })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
