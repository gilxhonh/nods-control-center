import { type ChangeBaselineInput, changeBaselineSchema } from '@ncc/shared'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import { DomainsService } from './domains.service'

@Controller('domains')
export class DomainsController {
  constructor(private readonly domains: DomainsService) {}

  @Get()
  list() {
    return this.domains.list()
  }

  @Post(':id/baseline')
  changeBaseline(@Param('id') id: string, @Body(new ZodValidationPipe(changeBaselineSchema)) body: ChangeBaselineInput) {
    return this.domains.changeBaseline(id, body)
  }
}
