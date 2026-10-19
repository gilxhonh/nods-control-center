import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common'
import type { ZodType } from 'zod'

/** Validates a request body against a zod schema shared with the frontend (@ncc/shared). */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value)
    if (!result.success) throw new BadRequestException(result.error.issues)
    return result.data
  }
}
