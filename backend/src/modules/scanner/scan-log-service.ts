import { Client } from "pg"

export interface ScanLogData {
  id: string
  sku: string
  locationId: string
  locationName: string
  productTitle: string
  previousQuantity: number
  currentQuantity: number
  success: boolean
  message: string
  timestamp: Date
  reverted: boolean
  revertedAt?: Date
}

export default class ScanLogService {
  protected readonly container_: any
  private dbClient: Client | null = null

  constructor(container: any) {
    this.container_ = container
  }

  private async getDbClient(): Promise<Client> {
    if (!this.dbClient) {
      // Get database URL from environment
      const databaseUrl = process.env.DATABASE_URL
      if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set')
      }
      
      this.dbClient = new Client({
        connectionString: databaseUrl
      })
      await this.dbClient.connect()
    }
    return this.dbClient
  }

  async create(data: Omit<ScanLogData, 'id' | 'timestamp'>): Promise<ScanLogData> {
    const logId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = new Date()
    
    const db = await this.getDbClient()
    
    await db.query(`
      INSERT INTO scan_log (
        id, sku, location_id, location_name, product_title, 
        previous_quantity, current_quantity, success, message, 
        timestamp, reverted, reverted_at, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
    `, [
      logId,
      data.sku,
      data.locationId,
      data.locationName,
      data.productTitle,
      data.previousQuantity,
      data.currentQuantity,
      data.success,
      data.message,
      timestamp,
      data.reverted || false,
      data.revertedAt || null,
      timestamp,
      timestamp
    ])
    
    return {
      id: logId,
      sku: data.sku,
      locationId: data.locationId,
      locationName: data.locationName,
      productTitle: data.productTitle,
      previousQuantity: data.previousQuantity,
      currentQuantity: data.currentQuantity,
      success: data.success,
      message: data.message,
      timestamp: timestamp,
      reverted: data.reverted || false,
      revertedAt: data.revertedAt
    }
  }

  async list(limit: number = 100): Promise<ScanLogData[]> {
    const db = await this.getDbClient()
    
    const result = await db.query(`
      SELECT 
        id, sku, location_id, location_name, product_title,
        previous_quantity, current_quantity, success, message,
        timestamp, reverted, reverted_at, created_at, updated_at
      FROM scan_log 
      ORDER BY timestamp DESC 
      LIMIT $1
    `, [limit])
    
    return result.rows?.map((log: any) => ({
      id: log.id,
      sku: log.sku,
      locationId: log.location_id,
      locationName: log.location_name,
      productTitle: log.product_title,
      previousQuantity: log.previous_quantity,
      currentQuantity: log.current_quantity,
      success: log.success,
      message: log.message,
      timestamp: new Date(log.timestamp),
      reverted: log.reverted,
      revertedAt: log.reverted_at ? new Date(log.reverted_at) : undefined
    })) || []
  }

  async update(id: string, data: Partial<ScanLogData>): Promise<ScanLogData> {
    const db = await this.getDbClient()
    
    const updateFields = []
    const values = []
    let paramCount = 1
    
    if (data.reverted !== undefined) {
      updateFields.push(`reverted = $${paramCount++}`)
      values.push(data.reverted)
    }
    
    if (data.revertedAt !== undefined) {
      updateFields.push(`reverted_at = $${paramCount++}`)
      values.push(data.revertedAt)
    }
    
    updateFields.push(`updated_at = $${paramCount++}`)
    values.push(new Date())
    
    values.push(id)
    
    await db.query(`
      UPDATE scan_log 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `, values)
    
    // Return the updated log
    const result = await db.query(`
      SELECT * FROM scan_log WHERE id = $1
    `, [id])
    
    const log = result.rows[0]
    return {
      id: log.id,
      sku: log.sku,
      locationId: log.location_id,
      locationName: log.location_name,
      productTitle: log.product_title,
      previousQuantity: log.previous_quantity,
      currentQuantity: log.current_quantity,
      success: log.success,
      message: log.message,
      timestamp: new Date(log.timestamp),
      reverted: log.reverted,
      revertedAt: log.reverted_at ? new Date(log.reverted_at) : undefined
    }
  }

  async delete(): Promise<void> {
    const db = await this.getDbClient()
    await db.query(`DELETE FROM scan_log`)
  }

  async deleteLog(id: string): Promise<void> {
    const db = await this.getDbClient()
    await db.query(`DELETE FROM scan_log WHERE id = $1`, [id])
  }

  async disconnect(): Promise<void> {
    if (this.dbClient) {
      await this.dbClient.end()
      this.dbClient = null
    }
  }
} 