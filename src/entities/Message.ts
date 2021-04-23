import { 
  Entity, 
  Column, 
  CreateDateColumn,
  PrimaryColumn, 
  ManyToOne,
  JoinColumn
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User";

@Entity("messages")
class Message {
  @PrimaryColumn()
  id: string;

  @Column({ name: "admin_id" })
  adminId: string;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User)
  user: User;

  @Column({ name: "user_id" })
  userId: string;

  @Column()
  text: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  constructor() {
    if (! this.id) {
      this.id = uuid();
    }
  }
}

export { Message };