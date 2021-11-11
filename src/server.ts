import { Server, ServerCredentials } from '@grpc/grpc-js'

import { Solc, SolcService } from './service/Solc'
import { Health, HealthService } from './service/Health'
import dotenv from 'dotenv'
import debug from 'debug'

const log = debug('server')
log.enabled = true
dotenv.config({ path: '.env' })

const port: string | number = process.env.PORT || 50051
const envDEBUG: string = process.env.DEBUG || ''
if (envDEBUG !== "") {
  debug.enable(envDEBUG)
}

const server = new Server({
  'grpc.max_receive_message_length': -1,
  'grpc.max_send_message_length': -1
})

server.addService(SolcService, new Solc())
server.addService(HealthService, new Health())
server.bindAsync((`0.0.0.0:${port}`), ServerCredentials.createInsecure(), (err: Error | null, bindPort: number) => {
  if (err) {
    throw err
  }

  log(`gRPC server listening ON :${bindPort}`, new Date().toLocaleString())
  server.start()
})
