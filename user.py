# This is a simple class used to represent a user in the DB

class User(object):
    def __init__(self, id, username='', pwd='', dl_no=0):
        self.id = id
        self.username = username
        self.pwd = pwd
        self.dl_no = dl_no

    def toDict(self):
        return {
            'id': self.id,
            'username': self.username,
            'pwd': self.pwd,
            'dl_no': self.dl_no,
        }