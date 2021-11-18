import type {ObjectEncodingOptions, PathOrFileDescriptor} from 'fs'

interface FsApi {
  readFileSync: (path: PathOrFileDescriptor,
                 options?:
                   | (ObjectEncodingOptions & {
                   flag?: string | undefined;
                 })
                   | BufferEncoding
                   | null) => string | Buffer,
  readonly homedir: string,
}
