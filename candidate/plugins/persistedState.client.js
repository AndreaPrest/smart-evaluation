import crypto from 'crypto'
import createPersistedState from 'vuex-persistedstate'
require('dotenv').config();

const algorithm = process.env.CRYPTO_ALGORITHM;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const IV_LENGTH = parseInt(process.env.IV_LENGTH)

export default ({store}) => {
  createPersistedState({
    key: 'test',
    getState: (key) => {
      // Decrypt the state
      if(localStorage.getItem(key))
      {
        const textParts = localStorage.getItem(key).split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, Buffer.concat([Buffer.from(ENCRYPTION_KEY), Buffer.alloc(32)],32), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString())
      }
      else
      {
        return null
      }

    },
    setState: (key, state) => {
      // Encrypt the state
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(algorithm, Buffer.concat([Buffer.from(ENCRYPTION_KEY), Buffer.alloc(32)], 32), iv);
      let encrypted = cipher.update(JSON.stringify(state));
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      localStorage.setItem(key, (iv.toString('hex') + ':' + encrypted.toString('hex')))
    },
  })(store)
}
