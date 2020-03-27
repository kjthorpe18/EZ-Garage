# This is a simple class used to represent a user in the DB

class User(object):
    def __init__(self, uid=None, username='', phone=0, dl_no=0):
        self.uid = uid
        self.username = username
        self.phone = phone
        self.dl_no = dl_no

    def to_dict(self):
        return {
            'uid': self.uid,
            'username': self.username,
            'phone': self.phone,
            'dl_no': self.dl_no,
        }