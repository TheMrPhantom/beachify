import datetime
import secrets
import hashlib
import util


class TokenManager:
    def __init__(self):
        self.token_storage = dict()
        self.cookie_expires = util.cookie_expire

    def check_token(self, memberID, token):
        if token in self.token_storage:
            stored_token = self.token_storage[token]
            storedMemberID = int(stored_token['memberID'])
            sendedMemberID = int(memberID)
            if storedMemberID != sendedMemberID:
                return False
            if stored_token['time']+datetime.timedelta(hours=self.cookie_expires) > datetime.datetime.utcnow():
                return True
            else:
                del(self.token_storage[token])

        return False

    def create_token(self, memberID):
        token = secrets.token_urlsafe(64)
        self.token_storage[token] = {
            'memberID': memberID, 'time': datetime.datetime.utcnow()}
        return token

    def delete_token(self, token):
        del(self.token_storage[token])

    def hashPassword(password, salt=None):
        usedSalt = secrets.token_hex(32) if salt is None else salt
        hashedPassword = hashlib.pbkdf2_hmac(
            'sha256',  # The hash digest algorithm for HMAC
            password.encode('utf-8'),  # Convert the password to bytes
            usedSalt.encode('utf-8'),  # Provide the salt
            500000,  # It is recommended to use at least 100,000 iterations of SHA-256
            dklen=128  # Get a 128 byte key
        )
        if salt is None:
            return (hashedPassword, usedSalt)
        else:
            return hashedPassword
