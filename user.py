# This is a simple class used to represent a user in the DB

class User(object):
    def __init__(self, uid=None, username='', pwd='', dl_no=0):
        self.uid = uid
        self.username = username
        self.pwd = pwd
        self.dl_no = dl_no

    def toDict(self):
        return {
            'uid': self.uid,
            'username': self.username,
            'pwd': self.pwd,
            'dl_no': self.dl_no,
        }