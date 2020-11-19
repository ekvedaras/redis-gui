export const commands = {
  'clear': {
    args: '',
    summary: 'Clear console log',
  },
  'acl load': {
    args: '',
    summary: 'Reload the ACLs from the configured ACL file',
  },
  'acl save': {
    args: '',
    summary: '',
  },
  'acl list': {
    args: '',
    summary: 'List the current ACL rules in ACL config file format',
  },
  'acl users': {
    args: '',
    summary: 'List the username of all the configured ACL rules',
  },
  'acl getuser': {
    args: 'username',
    summary: 'Get the rules for a specific ACL user',
  },
  'acl setuser': {
    args: 'username [rule [rule ...]]',
    summary: 'Modify or create the rules for a specific ACL user',
  },
  'acl deluser': {
    args: 'username [username ...]',
    summary: 'Remove the specified ACL users and the associated rules',
  },
  'acl cat': {
    args: '[categoryname]',
    summary: 'List the ACL categories or the commands inside a category',
  },
  'acl genpass': {
    args: '[bits]',
    summary: 'Generate a pseudorandom secure password to use for ACL users',
  },
  'acl whoami': {
    args: '',
    summary: 'Return the name of the user associated to the current connection',
  },
  'acl log': {
    args: '[count or RESET]',
    summary: 'List latest events denied because of ACLs in place',
  },
  'acl help': {
    args: '',
    summary: 'Show helpful text about the different subcommands',
  },
  'append': {
    args: 'key value',
    summary: 'Append a value to a key',
  },
  'auth': {
    args: '[username] password',
    summary: 'Authenticate to the server',
  },
  'bgrewriteaof': {
    args: '',
    summary: 'Asynchronously rewrite the append-only file',
  },
  'bgsave': {
    args: '[SCHEDULE]',
    summary: 'Asynchronously save the dataset to disk',
  },
  'bitcount': {
    args: 'key [start end]',
    summary: 'Count set bits in a string',
  },
  'bitfield': {
    args: 'key [GET type offset] [SET type offset value] [INCRBY type offset increment] [OVERFLOW WRAP|SAT|FAIL]',
    summary: 'Perform arbitrary bitfield integer operations on strings',
  },
  'bitop': {
    args: 'operation destkey key [key ...]',
    summary: 'Perform bitwise operations between strings',
  },
  'bitpos': {
    args: 'key bit [start] [end]',
    summary: 'Find first bit set or clear in a string',
  },
  'blpop': {
    args: 'key [key ...] timeout',
    summary: 'Remove and get the first element in a list, or block until one is available',
  },
  'brpop': {
    args: 'key [key ...] timeout',
    summary: 'Remove and get the last element in a list, or block until one is available',
  },
  'brpoplpush': {
    args: 'source destination timeout',
    summary: 'Pop an element from a list, push it to another list and return it; or block until one is available',
  },
  'blmove': {
    args: 'source destination LEFT|RIGHT LEFT|RIGHT timeout',
    summary: 'Pop an element from a list, push it to another list and return it; or block until one is available',
  },
  'bzpopmin': {
    args: 'key [key ...] timeout',
    summary: 'Remove and return the member with the lowest score from one or more sorted sets, or block until one is available',
  },
  'bzpopmax': {
    args: 'key [key ...] timeout',
    summary: 'Remove and return the member with the highest score from one or more sorted sets, or block until one is available',
  },
  'client caching': {
    args: 'YES|NO',
    summary: 'Instruct the server about tracking or not keys in the next request',
  },
  'client id': {
    args: '',
    summary: 'Returns the client ID for the current connection',
  },
  'client kill': {
    args: '[ip:port] [ID client-id] [TYPE normal|master|slave|pubsub] [USER username] [ADDR ip:port] [SKIPME yes/no]',
    summary: 'Kill the connection of a client',
  },
  'client list': {
    args: '[TYPE normal|master|replica|pubsub]',
    summary: 'Get the list of client connections',
  },
  'client getname': {
    args: '',
    summary: 'Get the current connection name',
  },
  'client getredir': {
    args: '',
    summary: 'Get tracking notifications redirection client ID if any',
  },
  'client pause': {
    args: 'timeout',
    summary: 'Stop processing commands from clients for some time',
  },
  'client reply': {
    args: 'ON|OFF|SKIP',
    summary: 'Instruct the server whether to reply to commands',
  },
  'client setname': {
    args: 'connection-name',
    summary: 'Set the current connection name',
  },
  'client tracking': {
    args: 'ON|OFF [REDIRECT client-id] [PREFIX prefix [PREFIX prefix ...]] [BCAST] [OPTIN] [OPTOUT] [NOLOOP]',
    summary: 'Enable or disable server assisted client side caching support',
  },
  'client unblock': {
    args: 'client-id [TIMEOUT|ERROR]',
    summary: 'Unblock a client blocked in a blocking command from a different connection',
  },
  'cluster addslots': {
    args: 'slot [slot ...]',
    summary: 'Assign new hash slots to receiving node',
  },
  'cluster bumpepoch': {
    args: '',
    summary: 'Advance the cluster config epoch',
  },
  'cluster count-failure-reports': {
    args: 'node-id',
    summary: 'Return the number of failure reports active for a given node',
  },
  'cluster countkeysinslot': {
    args: 'slot',
    summary: 'Return the number of local keys in the specified hash slot',
  },
  'cluster delslots': {
    args: 'slot [slot ...]',
    summary: 'Set hash slots as unbound in receiving node',
  },
  'cluster failover': {
    args: '[FORCE|TAKEOVER]',
    summary: 'Forces a replica to perform a manual failover of its master.',
  },
  'cluster flushslots': {
    args: '',
    summary: 'Delete a node\'s own slots information',
  },
  'cluster forget': {
    args: 'node-id',
    summary: 'Remove a node from the nodes table',
  },
  'cluster getkeysinslot': {
    args: 'slot count',
    summary: 'Return local key names in the specified hash slot',
  },
  'cluster info': {
    args: '',
    summary: 'Provides info about Redis Cluster node state',
  },
  'cluster keyslot': {
    args: 'key',
    summary: 'Returns the hash slot of the specified key',
  },
  'cluster meet': {
    args: 'ip port',
    summary: 'Force a node cluster to handshake with another node',
  },
  'cluster myid': {
    args: '',
    summary: 'Return the node id',
  },
  'cluster nodes': {
    args: '',
    summary: 'Get Cluster config for the node',
  },
  'cluster replicate': {
    args: 'node-id',
    summary: 'Reconfigure a node as a replica of the specified master node',
  },
  'cluster reset': {
    args: '[HARD|SOFT]',
    summary: 'Reset a Redis Cluster node',
  },
  'cluster saveconfig': {
    args: '',
    summary: 'Forces the node to save cluster state on disk',
  },
  'cluster set-config-epoch': {
    args: 'config-epoch',
    summary: 'Set the configuration epoch in a new node',
  },
  'cluster setslot': {
    args: 'slot IMPORTING|MIGRATING|STABLE|NODE [node-id]',
    summary: 'Bind a hash slot to a specific node',
  },
  'cluster slaves': {
    args: 'node-id',
    summary: 'List replica nodes of the specified master node',
  },
  'cluster replicas': {
    args: 'node-id',
    summary: 'List replica nodes of the specified master node',
  },
  'cluster slots': {
    args: '',
    summary: 'Get array of Cluster slot to node mappings',
  },
  'command': {
    args: '',
    summary: 'Get array of Redis command details',
  },
  'command count': {
    args: '',
    summary: 'Get total number of Redis commands',
  },
  'command getkeys': {
    args: '',
    summary: 'Extract keys given a full Redis command',
  },
  'command info': {
    args: 'command-name [command-name ...]',
    summary: 'Get array of specific Redis command details',
  },
  'config get': {
    args: 'parameter',
    summary: 'Get the value of a configuration parameter',
  },
  'config rewrite': {
    args: '',
    summary: 'Rewrite the configuration file with the in memory configuration',
  },
  'config set': {
    args: 'parameter value',
    summary: 'Set a configuration parameter to the given value',
  },
  'config resetstat': {
    args: '',
    summary: 'Reset the stats returned by INFO',
  },
  'dbsize': {
    args: '',
    summary: 'Return the number of keys in the selected database',
  },
  'debug object': {
    args: 'key',
    summary: 'Get debugging information about a key',
  },
  'debug segfault': {
    args: '',
    summary: 'Make the server crash',
  },
  'decr': {
    args: 'key',
    summary: 'Decrement the integer value of a key by one',
  },
  'decrby': {
    args: 'key decrement',
    summary: 'Decrement the integer value of a key by the given number',
  },
  'del': {
    args: 'key [key ...]',
    summary: 'Delete a key',
  },
  'discard': {
    args: '',
    summary: 'Discard all commands issued after MULTI',
  },
  'dump': {
    args: 'key',
    summary: 'Return a serialized version of the value stored at the specified key.',
  },
  'echo': {
    args: 'message',
    summary: 'Echo the given string',
  },
  'eval': {
    args: 'script numkeys key [key ...] arg [arg ...]',
    summary: 'Execute a Lua script server side',
  },
  'evalsha': {
    args: 'sha1 numkeys key [key ...] arg [arg ...]',
    summary: 'Execute a Lua script server side',
  },
  'exec': {
    args: '',
    summary: 'Execute all commands issued after MULTI',
  },
  'exists': {
    args: 'key [key ...]',
    summary: 'Determine if a key exists',
  },
  'expire': {
    args: 'key seconds',
    summary: 'Set a key\'s time to live in seconds',
  },
  'expireat': {
    args: 'key timestamp',
    summary: 'Set the expiration for a key as a UNIX timestamp',
  },
  'flushall': {
    args: '[ASYNC]',
    summary: 'Remove all keys from all databases',
  },
  'flushdb': {
    args: '[ASYNC]',
    summary: 'Remove all keys from the current database',
  },
  'geoadd': {
    args: 'key longitude latitude member [longitude latitude member ...]',
    summary: 'Add one or more geospatial items in the geospatial index represented using a sorted set',
  },
  'geohash': {
    args: 'key member [member ...]',
    summary: 'Returns members of a geospatial index as standard geohash strings',
  },
  'geopos': {
    args: 'key member [member ...]',
    summary: 'Returns longitude and latitude of members of a geospatial index',
  },
  'geodist': {
    args: 'key member1 member2 [m|km|ft|mi]',
    summary: 'Returns the distance between two members of a geospatial index',
  },
  'georadius': {
    args: 'key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]',
    summary: 'Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point',
  },
  'georadiusbymember': {
    args: 'key member radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]',
    summary: 'Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member',
  },
  'get': {
    args: 'key',
    summary: 'Get the value of a key',
  },
  'getbit': {
    args: 'key offset',
    summary: 'Returns the bit value at offset in the string value stored at key',
  },
  'getrange': {
    args: 'key start end',
    summary: 'Get a substring of the string stored at a key',
  },
  'getset': {
    args: 'key value',
    summary: 'Set the string value of a key and return its old value',
  },
  'hdel': {
    args: 'key field [field ...]',
    summary: 'Delete one or more hash fields',
  },
  'hello': {
    args: 'protover [AUTH username password] [SETNAME clientname]',
    summary: 'Switch Redis protocol',
  },
  'hexists': {
    args: 'key field',
    summary: 'Determine if a hash field exists',
  },
  'hget': {
    args: 'key field',
    summary: 'Get the value of a hash field',
  },
  'hgetall': {
    args: 'key',
    summary: 'Get all the fields and values in a hash',
  },
  'hincrby': {
    args: 'key field increment',
    summary: 'Increment the integer value of a hash field by the given number',
  },
  'hincrbyfloat': {
    args: 'key field increment',
    summary: 'Increment the float value of a hash field by the given amount',
  },
  'hkeys': {
    args: 'key',
    summary: 'Get all the fields in a hash',
  },
  'hlen': {
    args: 'key',
    summary: 'Get the number of fields in a hash',
  },
  'hmget': {
    args: 'key field [field ...]',
    summary: 'Get the values of all the given hash fields',
  },
  'hmset': {
    args: 'key field value [field value ...]',
    summary: 'Set multiple hash fields to multiple values',
  },
  'hset': {
    args: 'key field value [field value ...]',
    summary: 'Set the string value of a hash field',
  },
  'hsetnx': {
    args: 'key field value',
    summary: 'Set the value of a hash field, only if the field does not exist',
  },
  'hstrlen': {
    args: 'key field',
    summary: 'Get the length of the value of a hash field',
  },
  'hvals': {
    args: 'key',
    summary: 'Get all the values in a hash',
  },
  'incr': {
    args: 'key',
    summary: 'Increment the integer value of a key by one',
  },
  'incrby': {
    args: 'key increment',
    summary: 'Increment the integer value of a key by the given amount',
  },
  'incrbyfloat': {
    args: 'key increment',
    summary: 'Increment the float value of a key by the given amount',
  },
  'info': {
    args: '[section]',
    summary: 'Get information and statistics about the server',
  },
  'lolwut': {
    args: '[VERSION version]',
    summary: 'Display some computer art and the Redis version',
  },
  'keys': {
    args: 'pattern',
    summary: 'Find all keys matching the given pattern',
  },
  'lastsave': {
    args: '',
    summary: 'Get the UNIX time stamp of the last successful save to disk',
  },
  'lindex': {
    args: 'key index',
    summary: 'Get an element from a list by its index',
  },
  'linsert': {
    args: 'key BEFORE|AFTER pivot element',
    summary: 'Insert an element before or after another element in a list',
  },
  'llen': {
    args: 'key',
    summary: 'Get the length of a list',
  },
  'lpop': {
    args: 'key',
    summary: 'Remove and get the first element in a list',
  },
  'lpos': {
    args: 'key element [RANK rank] [COUNT num-matches] [MAXLEN len]',
    summary: 'Return the index of matching elements on a list',
  },
  'lpush': {
    args: 'key element [element ...]',
    summary: 'Prepend one or multiple elements to a list',
  },
  'lpushx': {
    args: 'key element [element ...]',
    summary: 'Prepend an element to a list, only if the list exists',
  },
  'lrange': {
    args: 'key start stop',
    summary: 'Get a range of elements from a list',
  },
  'lrem': {
    args: 'key count element',
    summary: 'Remove elements from list',
  },
  'lset': {
    args: 'key index element',
    summary: 'Set the value of an element in a list by its index',
  },
  'ltrim': {
    args: 'key start stop',
    summary: 'Trim a list to the specified range',
  },
  'memory doctor': {
    args: '',
    summary: 'Outputs memory problems report',
  },
  'memory help': {
    args: '',
    summary: 'Show helpful text about the different subcommands',
  },
  'memory malloc-stats': {
    args: '',
    summary: 'Show allocator internal stats',
  },
  'memory purge': {
    args: '',
    summary: 'Ask the allocator to release memory',
  },
  'memory stats': {
    args: '',
    summary: 'Show memory usage details',
  },
  'memory usage': {
    args: 'key [SAMPLES count]',
    summary: 'Estimate the memory usage of a key',
  },
  'mget': {
    args: 'key [key ...]',
    summary: 'Get the values of all the given keys',
  },
  'migrate': {
    args: 'host port key|"" destination-db timeout [COPY] [REPLACE] [AUTH password] [AUTH2 username password] [KEYS key [key ...]]',
    summary: 'Atomically transfer a key from a Redis instance to another one.',
  },
  'module list': {
    args: '',
    summary: 'List all modules loaded by the server',
  },
  'module load': {
    args: 'path [ arg [arg ...]]',
    summary: 'Load a module',
  },
  'module unload': {
    args: 'name',
    summary: 'Unload a module',
  },
  'monitor': {
    args: '',
    summary: 'Listen for all requests received by the server in real time',
  },
  'move': {
    args: 'key db',
    summary: 'Move a key to another database',
  },
  'mset': {
    args: 'key value [key value ...]',
    summary: 'Set multiple keys to multiple values',
  },
  'msetnx': {
    args: 'key value [key value ...]',
    summary: 'Set multiple keys to multiple values, only if none of the keys exist',
  },
  'multi': {
    args: '',
    summary: 'Mark the start of a transaction block',
  },
  'object': {
    args: 'subcommand [arguments [arguments ...]]',
    summary: 'Inspect the internals of Redis objects',
  },
  'persist': {
    args: 'key',
    summary: 'Remove the expiration from a key',
  },
  'pexpire': {
    args: 'key miliseconds',
    summary: 'Set a key\'s time to live in milliseconds',
  },
  'pexpireat': {
    args: 'key miliseconds-timestamp',
    summary: 'Set the expiration for a key as a UNIX timestamp specified in milliseconds',
  },
  'pfadd': {
    args: 'key element [element ...]',
    summary: 'Adds the specified elements to the specified HyperLogLog.',
  },
  'pfcount': {
    args: 'key [key ...]',
    summary: 'Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).',
  },
  'pfmerge': {
    args: 'destkey sourcekey [sourcekey ...]',
    summary: 'Merge N different HyperLogLogs into a single one.',
  },
  'ping': {
    args: '[message]',
    summary: 'Ping the server',
  },
  'psetex': {
    args: 'key miliseconds value',
    summary: 'Set the value and expiration in milliseconds of a key',
  },
  'psubscribe': {
    args: 'pattern [pattern ...]',
    summary: 'Listen for messages published to channels matching the given patterns',
  },
  'pubsub': {
    args: 'subcommand [argument [argument ...]]',
    summary: 'Inspect the state of the Pub/Sub subsystem',
  },
  'pttl': {
    args: 'key',
    summary: 'Get the time to live for a key in milliseconds',
  },
  'publish': {
    args: 'channel message',
    summary: 'Post a message to a channel',
  },
  'pubsubscribe': {
    args: '[pattern [pattern ...]]',
    summary: 'Stop listening for messages posted to channels matching the given patterns',
  },
  'quit': {
    args: '',
    summary: 'Close the connection',
  },
  'randomkey': {
    args: '',
    summary: 'Return a random key from the keyspace',
  },
  'readonly': {
    args: '',
    summary: 'Enables read queries for a connection to a cluster replica node',
  },
  'readwrite': {
    args: '',
    summary: 'Disables read queries for a connection to a cluster replica node',
  },
  'rename': {
    args: 'key newkey',
    summary: 'Rename a key',
  },
  'renamenx': {
    args: 'key newkey',
    summary: 'Rename a key, only if the new key does not exist',
  },
  'reset': {
    args: '',
    summary: 'Reset the connection',
  },
  'restore': {
    args: 'key ttl serialized-value [REPLACE] [ABSTTL] [IDLETIME seconds] [FREQ frequency]',
    summary: 'Create a key using the provided serialized value, previously obtained using DUMP.',
  },
  'role': {
    args: '',
    summary: 'Return the role of the instance in the context of replication',
  },
  'rpop': {
    args: 'key',
    summary: 'Remove and get the last element in a list',
  },
  'rpoplpush': {
    args: 'source destination',
    summary: 'Remove the last element in a list, prepend it to another list and return it',
  },
  'lmove': {
    args: 'source destination LEFT|RIGHT LEFT|RIGHT',
    summary: 'Pop an element from a list, push it to another list and return it',
  },
  'rpush': {
    args: 'key element [element ...]',
    summary: 'Append one or multiple elements to a list',
  },
  'rpushx': {
    args: 'key element [element ...]',
    summary: 'Append an element to a list, only if the list exists',
  },
  'sadd': {
    args: 'key member [member ...]',
    summary: 'Add one or more members to a set',
  },
  'save': {
    args: '',
    summary: 'Synchronously save the dataset to disk',
  },
  'scard': {
    args: 'key',
    summary: 'Get the number of members in a set',
  },
  'script debug': {
    args: 'YES|SYNC|NO',
    summary: 'Set the debug mode for executed scripts.',
  },
  'script exists': {
    args: 'sha1 [sha1 ...]',
    summary: 'Check existence of scripts in the script cache.',
  },
  'script flush': {
    args: '',
    summary: 'Remove all the scripts from the script cache.',
  },
  'script kill': {
    args: '',
    summary: 'Kill the script currently in execution.',
  },
  'script load': {
    args: 'script',
    summary: 'Load the specified Lua script into the script cache.',
  },
  'sdiff': {
    args: 'key [key ...]',
    summary: 'Subtract multiple sets',
  },
  'sdiffstore': {
    args: 'desctination key [key ...]',
    summary: 'Subtract multiple sets and store the resulting set in a key',
  },
  'select': {
    args: 'index',
    summary: 'Change the selected database for the current connection',
  },
  'set': {
    args: 'key value [EX seconds|PX milliseconds|KEEPTTL] [NX|XX] [GET]',
    summary: 'Set the string value of a key',
  },
  'setbit': {
    args: 'key offset value',
    summary: 'Sets or clears the bit at offset in the string value stored at key',
  },
  'setex': {
    args: 'key seconds value',
    summary: 'Set the value and expiration of a key',
  },
  'setnx': {
    args: 'key value',
    summary: 'Set the value of a key, only if the key does not exist',
  },
  'setrange': {
    args: 'key offset value',
    summary: 'Overwrite part of a string at key starting at the specified offset',
  },
  'shutdown': {
    args: '[NOSAVE|SAVE]',
    summary: 'Synchronously save the dataset to disk and then shut down the server',
  },
  'sinter': {
    args: 'key [key ...]',
    summary: 'Intersect multiple sets',
  },
  'sinterstore': {
    args: 'destination key [key ...]',
    summary: 'Intersect multiple sets and store the resulting set in a key',
  },
  'sismember': {
    args: 'key member',
    summary: 'Determine if a given value is a member of a set',
  },
  'smismember': {
    args: 'key member [member ...]',
    summary: 'Returns the membership associated with the given elements for a set',
  },
  'slaveof': {
    args: 'host port',
    summary: 'Make the server a replica of another instance, or promote it as master. Deprecated starting with Redis 5. Use REPLICAOF instead.',
  },
  'repicaof': {
    args: 'host port',
    summary: 'Make the server a replica of another instance, or promote it as master.',
  },
  'slowlog': {
    args: 'subcommand [argument]',
    summary: 'Manages the Redis slow queries log',
  },
  'smembers': {
    args: 'key',
    summary: 'Get all the members in a set',
  },
  'smove': {
    args: 'source destination member',
    summary: 'Move a member from one set to another',
  },
  'sort': {
    args: 'key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]',
    summary: 'Sort the elements in a list, set or sorted set',
  },
  'spop': {
    args: 'key [count]',
    summary: 'Remove and return one or multiple random members from a set',
  },
  'srandmember': {
    args: 'key [count]',
    summary: 'Get one or multiple random members from a set',
  },
  'srem': {
    args: 'key member [member ...]',
    summary: 'Remove one or more members from a set',
  },
  'stralgo': {
    args: 'LCS algo-specific-argument [algo-specific-argument ...]',
    summary: 'Run algorithms (currently LCS) against strings',
  },
  'strlen': {
    args: 'key',
    summary: 'Get the length of the value stored in a key',
  },
  'subscribe': {
    args: 'channel [channel ...]',
    summary: 'Listen for messages published to the given channels',
  },
  'sunion': {
    args: 'key [key ...]',
    summary: 'Add multiple sets',
  },
  'sunionstore': {
    args: 'destination key [key ...]',
    summary: 'Add multiple sets and store the resulting set in a key',
  },
  'swapdb': {
    args: 'index1 index2',
    summary: 'Swaps to Redis databases',
  },
  'sync': {
    args: '',
    summary: 'Internal command used for replication',
  },
  'psync': {
    args: 'replicationid offset',
    summary: 'Internal command used for replication',
  },
  'time': {
    args: '',
    summary: 'Return the current server time',
  },
  'touch': {
    args: 'key [key ...]',
    summary: 'Alters the last access time of a key(s). Returns the number of existing keys specified.',
  },
  'ttl': {
    args: 'key',
    summary: 'Get the time to live for a key',
  },
  'type': {
    args: 'key',
    summary: 'Determine the type stored at key',
  },
  'unsubscribe': {
    args: '[channel [channel ...]]',
    summary: 'Stop listening for messages posted to the given channels',
  },
  'unlink': {
    args: 'key [key ...]',
    summary: 'Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.',
  },
  'unwatch': {
    args: '',
    summary: 'Forget about all watched keys',
  },
  'wait': {
    args: 'numreplicas timeout',
    summary: 'Wait for the synchronous replication of all the write commands sent in the context of the current connection',
  },
  'watch': {
    args: 'key [key ...]',
    summary: 'Watch the given keys to determine execution of the MULTI/EXEC block',
  },
  'zadd': {
    args: 'key [NX|XX] [GT|LT] [CH] [INCR] score member [score member ...]',
    summary: 'Add one or more members to a sorted set, or update its score if it already exists',
  },
  'zcard': {
    args: 'key',
    summary: 'Get the number of members in a sorted set',
  },
  'zcount': {
    args: 'key min max',
    summary: 'Count the members in a sorted set with scores within the given values',
  },
  'zdiff': {
    args: 'numkeys key [key ...] [WITHSCORES]',
    summary: 'Subtract multiple sorted sets',
  },
  'zdiffstore': {
    args: 'destination numkeys key [key ...]',
    summary: 'Subtract multiple sorted sets and store the resulting sorted set in a new key',
  },
  'zincrby': {
    args: 'key increment member',
    summary: 'Increment the score of a member in a sorted set',
  },
  'zinter': {
    args: 'numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]',
    summary: 'Intersect multiple sorted sets',
  },
  'zinterstore': {
    args: 'destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]',
    summary: 'Intersect multiple sorted sets and store the resulting sorted set in a new key',
  },
  'zlexcount': {
    args: 'key min max',
    summary: 'Count the number of members in a sorted set between a given lexicographical range',
  },
  'zpopmax': {
    args: 'key [count]',
    summary: 'Remove and return members with the highest scores in a sorted set',
  },
  'zpopmin': {
    args: 'key [count]',
    summary: 'Remove and return members with the lowest scores in a sorted set',
  },
  'zrange': {
    args: 'key start stop [WITHSCORES]',
    summary: 'Return a range of members in a sorted set, by index',
  },
  'zrangebylex': {
    args: 'key min max [LIMIT offset count]',
    summary: 'Return a range of members in a sorted set, by lexicographical range',
  },
  'zrevrangebylex': {
    args: 'key max min [LIMIT offset count]',
    summary: 'Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.',
  },
  'zrangebyscore': {
    args: 'key min max [WITHSCORES] [LIMIT offset count]',
    summary: 'Return a range of members in a sorted set, by score',
  },
  'zrank': {
    args: 'key member',
    summary: 'Determine the index of a member in a sorted set',
  },
  'zrem': {
    args: 'key member [member ...]',
    summary: 'Remove one or more members from a sorted set',
  },
  'zremrangebylex': {
    args: 'key min max',
    summary: 'Remove all members in a sorted set between the given lexicographical range',
  },
  'zremrangebyrank': {
    args: 'key start stop',
    summary: 'Remove all members in a sorted set within the given indexes',
  },
  'zremrangebyscore': {
    args: 'key min max',
    summary: 'Remove all members in a sorted set within the given scores',
  },
  'zrevrange': {
    args: 'key start stop [WITHSCORES]',
    summary: 'Return a range of members in a sorted set, by index, with scores ordered from high to low',
  },
  'zrevrangebyscore': {
    args: 'key max min [WITHSCORES] [LIMIT offset count]',
    summary: 'Return a range of members in a sorted set, by score, with scores ordered from high to low',
  },
  'zrevrank': {
    args: 'key ',
    summary: 'Determine the index of a member in a sorted set, with scores ordered from high to low',
  },
  'zscore': {
    args: 'key member',
    summary: 'Get the score associated with the given member in a sorted set',
  },
  'zunion': {
    args: 'numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]',
    summary: 'Add multiple sorted sets',
  },
  'zmscore': {
    args: 'key member [member ...]',
    summary: 'Get the score associated with the given members in a sorted set',
  },
  'zunionstore': {
    args: 'destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]',
    summary: 'Add multiple sorted sets and store the resulting sorted set in a new key',
  },
  'scan': {
    args: 'cursor [MATCH pattern] [COUNT count] [TYPE type]',
    summary: 'Incrementally iterate the keys space',
  },
  'sscan': {
    args: 'key cursor [MATCH pattern] [COUNT count]',
    summary: 'Incrementally iterate Set elements',
  },
  'hscan': {
    args: 'key cursor [MATCH pattern] [COUNT count]',
    summary: 'Incrementally iterate hash fields and associated values',
  },
  'zscan': {
    args: 'key cursor [MATCH pattern] [COUNT count]',
    summary: 'Incrementally iterate sorted sets elements and associated scores',
  },
  'xinfo': {
    args: '[CONSUMERS key groupname] [GROUPS key] [STREAM key] [HELP]',
    summary: 'Get information on streams and consumer groups',
  },
  'xadd': {
    args: 'key ID field value [field value ...]',
    summary: 'Appends a new entry to a stream',
  },
  'xtrim': {
    args: 'key MAXLEN [~] count',
    summary: 'Trims the stream to (approximately if \'~\' is passed) a certain size',
  },
  'xdel': {
    args: 'key ID [ID ...]',
    summary: 'Removes the specified entries from the stream. Returns the number of items actually deleted, that may be different from the number of IDs passed in case certain IDs do not exist.',
  },
  'xrange': {
    args: 'key start end [COUNT count]',
    summary: 'Return a range of elements in a stream, with IDs matching the specified IDs interval',
  },
  'xrevrange': {
    args: 'key end start [COUNT count]',
    summary: 'Return a range of elements in a stream, with IDs matching the specified IDs interval, in reverse order (from greater to smaller IDs) compared to XRANGE',
  },
  'xlen': {
    args: 'key',
    summary: 'Return the number of entries in a stream',
  },
  'xread': {
    args: '[COUNT count] [BLOCK milliseconds] STREAMS key [key ...] id [id ...]',
    summary: 'Return never seen elements in multiple streams, with IDs greater than the ones reported by the caller for each stream. Can block.',
  },
  'xgroup': {
    args: '[CREATE key groupname id-or-$] [SETID key groupname id-or-$] [DESTROY key groupname] [CREATECONSUMER key groupname consumername] [DELCONSUMER key groupname consumername]',
    summary: 'Create, destroy, and manage consumer groups.',
  },
  'xreadgroup': {
    args: 'GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] ID [ID ...]',
    summary: 'Return new entries from a stream using a consumer group, or access the history of the pending entries for a given consumer. Can block.',
  },
  'xack': {
    args: 'key group ID [ID ...]',
    summary: 'Marks a pending message as correctly processed, effectively removing it from the pending entries list of the consumer group. Return value of the command is the number of messages successfully acknowledged, that is, the IDs we were actually able to resolve in the PEL.',
  },
  'xclaim': {
    args: 'key group consumer min-idle-time ID [ID ...] [IDLE ms] [TIME ms-unix-time] [RETRYCOUNT count] [FORCE] [JUSTID]',
    summary: 'Changes (or acquires) ownership of a message in a consumer group, as if the message was delivered to the specified consumer.',
  },
  'xpending': {
    args: 'key group [start end count] [consumer]',
    summary: 'Return information and entries from a stream consumer group pending entries list, that are messages fetched but never acknowledged.',
  },
  'latency doctor': {
    args: '',
    summary: 'Return a human readable latency analysis report.',
  },
  'latency graph': {
    args: 'event',
    summary: 'Return a latency graph for the event.',
  },
  'latency history': {
    args: 'event',
    summary: 'Return timestamp-latency samples for the event.',
  },
  'latency latest': {
    args: '',
    summary: 'Return the latest latency samples for all events.',
  },
  'latency reset': {
    args: '[event [event ...]]',
    summary: 'Reset latency data for one or more events.',
  },
  'latency help': {
    args: '',
    summary: 'Show helpful text about the different subcommands.',
  },
}
