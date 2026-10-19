import type { ChangeBaselineInput, Domain } from '@ncc/shared'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DomainsService {
  // TODO: read from @ncc/db and the master request source.
  list(): Domain[] {
    return []
  }

  changeBaseline(domainId: string, input: ChangeBaselineInput) {
    return { domainId, ...input, accepted: false, note: 'Not implemented yet' }
  }
}
