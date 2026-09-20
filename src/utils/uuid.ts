/**
 * A RFC 4122 version 4 UUID.
 *
 * The one caller is the quest completion idempotency key, which the backend parses as a `Guid` — so
 * "some unique string" will not do, it has to be shaped like a UUID. It is a de-duplication token and
 * nothing else: it guards no secret and is never used for authorization, which is why falling back to
 * `Math.random` is acceptable here and would not be anywhere else.
 *
 * React Native has no global `crypto` by default and the project pulls in no uuid package, so the
 * strong path is used when the runtime happens to offer it and the weak one otherwise.
 */

const UUID_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

interface MaybeCrypto {
  randomUUID?: () => string;
  getRandomValues?: (array: Uint8Array) => Uint8Array;
}

const getCrypto = (): MaybeCrypto | undefined => (globalThis as { crypto?: MaybeCrypto }).crypto;

const randomByte = (): number => {
  const crypto = getCrypto();

  if (crypto?.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(1))[0];
  }

  return Math.floor(Math.random() * 256);
};

export const createUuid = (): string => {
  const crypto = getCrypto();

  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return UUID_TEMPLATE.replace(/[xy]/g, character => {
    const random = randomByte() % 16;
    // The version 4 layout fixes one nibble to 4 and constrains the variant nibble to 8..b.
    const value = character === 'x' ? random : (random % 4) + 8;

    return value.toString(16);
  });
};
