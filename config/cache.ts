import { BentoCache, bentostore } from 'bentocache'
import { fileDriver } from 'bentocache/drivers/file'
import { memoryDriver } from 'bentocache/drivers/memory'

export const cache = new BentoCache({
  default: 'multiLayer',
  stores: {
    multiLayer: bentostore()
      .useL1Layer(memoryDriver({ maxSize: 50_000 }))
      .useL2Layer(
        fileDriver({
          directory: './.cache',
          pruneInterval: false,
        })
      ),
  },
})
