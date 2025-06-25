import { Entity, PrimaryKey, Property, Index } from "@mikro-orm/core"

@Entity({ tableName: "scan_log" })
@Index({ properties: ["timestamp"] })
@Index({ properties: ["sku"] })
@Index({ properties: ["locationId"] })
@Index({ properties: ["success"] })
@Index({ properties: ["reverted"] })
export class ScanLog {
  @PrimaryKey()
  id!: string

  @Property({ length: 255 })
  sku!: string

  @Property({ length: 255 })
  locationId!: string

  @Property({ length: 255 })
  locationName!: string

  @Property({ length: 500 })
  productTitle!: string

  @Property()
  previousQuantity!: number

  @Property()
  currentQuantity!: number

  @Property()
  success!: boolean

  @Property({ length: 1000 })
  message!: string

  @Property()
  timestamp!: Date

  @Property({ default: false })
  reverted!: boolean

  @Property({ nullable: true })
  revertedAt?: Date

  @Property({ onCreate: () => new Date() })
  createdAt!: Date

  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date
} 